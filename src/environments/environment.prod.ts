// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const DBAPI = 'https://api.clouddesk.ge/api';
// const DBAPI = 'http://localhost:3000/api';

export const employee_directory_params = {
  employeeDirectoryDefaultPageSize: '5'
};

export const sysobject_directory_params = {
  sysObjectDirectoryDefaultPageSize: '25'
};

export const persongroup_directory_params = {
  personGroupDirectoryDefaultPageSize: '25'
};

export const person_directory_params = {
  personDirectoryDefaultPageSize: '25'
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
  production: true,

  API_auth: `${DBAPI}/auth`,
  API_users: `${DBAPI}/users/`,
  API_groups: `${DBAPI}/groups/`,
  API_sysObjects: `${DBAPI}/sysobjects/`,
  API_permissions_library: `${DBAPI}/permissions/library/`,
  API_permissions_group: `${DBAPI}/permissions/group/`,
  API_permissions_user: `${DBAPI}/permissions/user/`,
  API_menu: `${DBAPI}/menu`,
  API_Project: `${DBAPI}/projects/`,
  API_Location: `${DBAPI}/locations/`,
  API_map: `${DBAPI}/maps/`,
  API_face_persongroups: `${DBAPI}/face/persongroups/`,
  API_face_persongroupsperson: `${DBAPI}/face/persongroupsperson/`,
  API_face_persistedface: `${DBAPI}/face/persistedface/`,
  API_face_detectperson: `${DBAPI}/face/detectperson`,
  API_face_verifyperson: `${DBAPI}/face/verifyperson`,
  API_Employee: `${DBAPI}/employees/`,
  API_Employee_addPersonId: `${DBAPI}/employees/addpersonid/`,
  API_Employee_addPersonGroupId: `${DBAPI}/employees/addpersongroupid/`,
  API_Employee_addPersistedFaceId: `${DBAPI}/employees/addpersistedfaceid/`,
  API_Employee_removePersistedFaceId: `${DBAPI}/employees/removepersistedfaceid/`,
  API_Employee_linkPhoto: `${DBAPI}/employees/linkphoto/`,
  API_Employee_unLinkPhoto: `${DBAPI}/employees/unlinkphoto/`,
  API_attendance: `${DBAPI}/attendance/`,
  API_attendance_linkPhoto: `${DBAPI}/attendance/linkphoto/`,
  API_attendance_unLinkPhoto: `${DBAPI}/attendance/unlinkphoto/`,
  API_report: `${DBAPI}/reports/`,
  API_files: `${DBAPI}/files/`
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
