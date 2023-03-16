/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': '/node_modules/'
    },
    map: {
      'ng-loader': '../src/systemjs-angular-loader.js',
      app: '/app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/fesm2022/core.mjs',
      '@angular/common': 'npm:@angular/common/fesm2022/common.mjs',
      '@angular/common/http': 'npm:@angular/common/fesm2022/http.mjs',
      '@angular/compiler': 'npm:@angular/compiler/fesm2022/compiler.mjs',
      '@angular/platform-browser': 'npm:@angular/platform-browser/fesm2022/platform-browser.mjs',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs',
      '@angular/router': 'npm:@angular/router/fesm2022/router.mjs',
      '@angular/router/upgrade': 'npm:@angular/router/fesm2022/upgrade.mjs',
      '@angular/forms': 'npm:@angular/forms/fesm2022/forms.mjs',
      '@angular/upgrade': 'npm:@angular/upgrade/fesm2022/upgrade.mjs',
      '@angular/upgrade/static': 'npm:@angular/upgrade/fesm2022/static.mjs',

      // other libraries
      'rxjs': 'npm:rxjs/dist/cjs',
      'rxjs/operators': 'npm:rxjs/dist/cjs/operators',
      'tslib': 'npm:tslib/tslib.js',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',

      'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
      'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js'
    },
    transpiler: 'plugin-babel',
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      'app': {
        main: './main.js',
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'ng-loader'
          }
        }
      },
      'angular-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
      },
      'rxjs': {
        defaultExtension: 'js',
        format: 'cjs',
        main: 'index.js'
      },
      'rxjs/operators': {
        defaultExtension: 'js',
        format: 'cjs',
        main: 'index.js'
      },
      'meta': {
        '*.mjs': {
          babelOptions: {
            es2015: false
          }
        }
      }
    }
  });
})(this);
