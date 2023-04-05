import {NgZone, Injectable} from '@angular/core';
import {connectable, Observable, race, ReplaySubject, timer} from 'rxjs';
import {concatMap, first} from 'rxjs/operators';
import {WebWorkerClient} from 'app/shared/web-worker';
import {SearchResults} from 'app/search/interfaces';

@Injectable()
export class SearchService {
  private ready: Observable<boolean>;
  private searchesSubject = new ReplaySubject<string>(1);
  private worker: WebWorkerClient;
  constructor(private zone: NgZone) {}

  /**
   * Initialize the search engine. We offer an `initDelay` to prevent the search initialisation from delaying the
   * initial rendering of the web page. Triggering a search will override this delay and cause the index to be
   * loaded immediately.
   *
   * @param initDelay the number of milliseconds to wait before we load the WebWorker and generate the search index
   */
  initWorker(initDelay: number) {
    // Wait for the initDelay or the first search
    const readySource = (this.ready = race(
      timer(initDelay),
      this.searchesSubject.asObservable().pipe(first())
    ).pipe(
      concatMap(() => {
        // Create the worker and load the index
        const worker = new Worker(new URL('./search.worker', import.meta.url), {type: 'module'});
        this.worker = WebWorkerClient.create(worker, this.zone);
        return this.worker.sendMessage<boolean>('load-index');
      })
    ));
    const ready = connectable(readySource, {
      connector: () => new ReplaySubject(1),
    });

    // Connect to the observable to kick off the timer
    ready.connect();
    return ready;
  }

  /**
   * Search the index using the given query and emit results on the observable that is returned.
   *
   * @param query The query to run against the index.
   * @returns an observable collection of search results
   */
  search(query: string): Observable<SearchResults> {
    // Trigger the searches subject to override the init delay timer
    this.searchesSubject.next(query);
    // Once the index has loaded, switch to listening to the searches coming in.
    return this.ready.pipe(
      concatMap(() => this.worker.sendMessage<SearchResults>('query-index', query))
    );
  }
}
