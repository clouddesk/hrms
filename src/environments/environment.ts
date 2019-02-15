// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const MSCSfaceAPI_base =
  'https://westeurope.api.cognitive.microsoft.com/face/v1.0';
const DBAPI = 'http://80.240.26.77/api';
const GoogleMapsAPI = 'https://maps.googleapis.com/maps/api/';

export const employee_directory_params = {
  employeeDirectoryDefaultPageSize: '5'
};

export const sysobject_directory_params = {
  sysObjectDirectoryDefaultPageSize: '25'
};

export const user_directory_params = {
  userDirectoryDefaultPageSize: '25'
};

export const group_directory_params = {
  groupDirectoryDefaultPageSize: '25'
};

export const permission_directory_params = {
  permissionDirectoryDefaultPageSize: '25'
};

export const environment = {
  production: false,
  subscriptionKey: 'e3d39b6740494052b6ea534de2fc8e04',
  googleMapssubscriptionKey: 'AIzaSyCPKD2tubxvBakQdgJmxX4kZDfEdwinSks',
  FaceAPI_detect: `${MSCSfaceAPI_base}/detect`,
  FaceAPI_verify: `${MSCSfaceAPI_base}/verify`,
  FaceAPI_person_group: `${MSCSfaceAPI_base}/persongroups`,

  Google_Maps_API_static: `${GoogleMapsAPI}staticmap?`,

  DatabaseAPI_auth: `${DBAPI}/auth`,
  DatabaseAPI_users: `${DBAPI}/users/`,
  DatabaseAPI_groups: `${DBAPI}/groups/`,
  DatabaseAPI_sysObjects: `${DBAPI}/sysobjects/`,
  DatabaseAPI_permissions_library: `${DBAPI}/permissions/library/`,
  DatabaseAPI_permissions_group: `${DBAPI}/permissions/group/`,
  DatabaseAPI_permissions_user: `${DBAPI}/permissions/user/`,
  DatabaseAPI_menu: `${DBAPI}/menu`,
  DatabaseAPI_Project: `${DBAPI}/projects/`,
  DatabaseAPI_Location: `${DBAPI}/locations/`,
  DatabaseAPI_Employee: `${DBAPI}/employees/`,
  DatabaseAPI_Employee_addPersonId: `${DBAPI}/employees/addpersonid/`,
  DatabaseAPI_Employee_addPersonGroupId: `${DBAPI}/employees/addpersongroupid/`,
  DatabaseAPI_Employee_addPersistedFaceId: `${DBAPI}/employees/addpersistedfaceid/`,
  DatabaseAPI_Employee_removePersistedFaceId: `${DBAPI}/employees/removepersistedfaceid/`,
  DatabaseAPI_Employee_linkPhoto: `${DBAPI}/employees/linkphoto/`,
  DatabaseAPI_Employee_unLinkPhoto: `${DBAPI}/employees/unlinkphoto/`,
  DatabaseAPI_attendance: `${DBAPI}/attendance/`,
  DatabaseAPI_report: `${DBAPI}/reports/`,
  DatabaseAPI_files: `${DBAPI}/files/`
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
