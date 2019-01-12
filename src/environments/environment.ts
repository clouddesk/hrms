// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const MSCSfaceAPI_base = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0';
export const environment = {
  production: false,
  subscriptionKey: 'e3d39b6740494052b6ea534de2fc8e04',
  FaceAPI_detect: `${MSCSfaceAPI_base}/detect`,
  FaceAPI_person_group: `${MSCSfaceAPI_base}/persongroups`
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
