import { Company } from './company';

export class Location {
    constructor(
        public name: string,
        public company: Company
    ) {}
}
