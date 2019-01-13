export class User {
    constructor(
        public personalId: string,
        public firstName: string,
        public lastName: string,
        public emailAddress: string,
        public mobilePhone: number,
        public companyId: number
    ) { }
}
