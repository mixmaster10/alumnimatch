// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASEURL: 'https://api.alumnimatch.co/staging/',  
  GOOGLEMAP_APIKEY: 'AIzaSyCv9AobG90T2aGkr4gZxwmUTAv0vELqnOA',
  STRIPE_APIKEY: 'pk_test_51HZKL0KiR0tw86RIDUsmdg1hNmN42fc1zfdd1NW2I9uS5qln59znbt97oWfXsTRN3tTUzxZMroSR6JElU355epHl00Rj2OmD63',
  /* config: {
    apiKey: "AIzaSyAXN8mC1pzsM90YRrWeGILm8ASJf5q24zE",
    authDomain: "alumnimatchapp.firebaseapp.com",
    databaseURL: "https://alumnimatchapp.firebaseio.com",
    projectId: "alumnimatchapp",
    storageBucket: "alumnimatchapp.appspot.com",
    messagingSenderId: "267418649890",
    appId: "1:267418649890:web:738ba042e80c2da615517b",
    measurementId: "G-WSGG6LVJKN"
  }, */
  firebaseConfig: {
    apiKey: "AIzaSyBUgjyTfk6S07XAYZkVer8Us4fhnf_h5RA",
    authDomain: "alumnimatch-f290c.firebaseapp.com",
    databaseURL: "https://alumnimatch-f290c.firebaseio.com",
    projectId: "alumnimatch-f290c",
    storageBucket: "alumnimatch-f290c.appspot.com",
    messagingSenderId: "56173969666",
    appId: "1:56173969666:web:61c5b8c969bd25cf76021b"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
