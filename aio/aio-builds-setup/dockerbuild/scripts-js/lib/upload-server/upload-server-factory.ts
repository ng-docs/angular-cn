// Imports
import * as express from 'express';
import * as http from 'http';
import {BuildCreator} from './build-creator';
import {CreatedBuildEvent} from './build-events';
import {UploadError} from './upload-error';

// Constants
const X_FILE_HEADER = 'X-FILE';

// Classes
class UploadServerFactory {
  // Methods - Public
  public create(buildsDir: string): http.Server {
    if (!buildsDir) {
      throw new Error('Missing or empty required parameter \'buildsDir\'!');
    }

    const buildCreator = new BuildCreator(buildsDir);
    const middleware = this.createMiddleware(buildCreator);
    const httpServer = http.createServer(middleware);

    buildCreator.on(CreatedBuildEvent.type, (data: CreatedBuildEvent) => httpServer.emit(CreatedBuildEvent.type, data));
    httpServer.on('listening', () => {
      const info = httpServer.address();
      console.info(`Up and running (and listening on ${info.address}:${info.port})...`);
    });

    return httpServer;
  }

  // Methods - Protected
  protected createMiddleware(buildCreator: BuildCreator): express.Express {
    const middleware = express();

    middleware.get(/^\/create-build\/([1-9][0-9]*)\/([0-9a-f]{40})\/?$/, (req, res) => {
      const pr = req.params[0];
      const sha = req.params[1];
      const archive = req.header(X_FILE_HEADER);

      if (!archive) {
        this.throwRequestError(400, `Missing or empty '${X_FILE_HEADER}' header`, req);
      }

      buildCreator.
        create(pr, sha, archive).
        then(() => res.sendStatus(201)).
        catch(err => this.respondWithError(res, err));
    });
    middleware.get(/^\/health-check\/?$/, (_req, res) => res.sendStatus(200));
    middleware.get('*', req => this.throwRequestError(404, 'Unknown resource', req));
    middleware.all('*', req => this.throwRequestError(405, 'Unsupported method', req));
    middleware.use((err: any, _req: any, res: express.Response, _next: any) => this.respondWithError(res, err));

    return middleware;
  }

  protected respondWithError(res: express.Response, err: any) {
    if (!(err instanceof UploadError)) {
      err = new UploadError(500, String((err && err.message) || err));
    }

    const statusText = http.STATUS_CODES[err.status] || '???';
    console.error(`Upload error: ${err.status} - ${statusText}`);
    console.error(err.message);

    res.status(err.status).end(err.message);
  }

  protected throwRequestError(status: number, error: string, req: express.Request) {
    throw new UploadError(status, `${error} in request: ${req.method} ${req.originalUrl}`);
  }
}

// Exports
export const uploadServerFactory = new UploadServerFactory();
