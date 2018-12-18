import { Location } from './location';

export class OrganizationUnit {
    constructor(
        public name: string,
        public location?: Location[],
    ) {}
}
