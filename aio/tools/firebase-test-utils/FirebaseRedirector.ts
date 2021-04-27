import { FirebaseRedirect } from './FirebaseRedirect';

export type FirebaseRedirectConfig =
  { source: string, regex?: undefined, destination: string } |
  { source?: undefined, regex: string, destination: string };

export class FirebaseRedirector {
  private redirects: FirebaseRedirect[];
  constructor(redirects: FirebaseRedirectConfig[]) {
    this.redirects = redirects.map(redirect => new FirebaseRedirect(redirect));
  }

  redirect(url: string): string {
    let ttl = 50;
    while (ttl > 0) {
      const newUrl = this.doRedirect(url);
      if (newUrl === url) {
        return url;
      } else {
        url = newUrl;
        ttl--;
      }
    }
    throw new Error('infinite redirect loop');
  }

  private doRedirect(url: string) {
    for (const redirect of this.redirects) {
      const newUrl = redirect.replace(url);
      if (newUrl !== undefined) {
        return newUrl;
      }
    }
    return url;
  }
}
