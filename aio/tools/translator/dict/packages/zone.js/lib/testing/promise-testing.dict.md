Promise for async/fakeAsync zoneSpec test
can support async operation which not supported by zone.js
such as
it \('test jsonp in AsyncZone', async\(\) => {
  new Promise\(res => {
    jsonp\(url, \(data\) => {
      // success callback
      res\(data\);
    }\);
  }\).then\(\(jsonpResult\) => {
    // get jsonp result.



// user will expect AsyncZoneSpec wait for
    // then, but because jsonp is not zone aware
    // AsyncZone will finish before then is called.
  }\);
}\);