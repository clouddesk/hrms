export class Employee {
    constructor(
        public firstName: string,
        public lastName: string,
        public personalId: string,
        public birthDate: string,
        public mobilePhone: number,
        public projectId: number,
        public employeePhotoFileId?: number,
    ) { }
}
