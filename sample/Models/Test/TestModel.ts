import { IEntity } from "ayax-common-types";

export class TestModel implements IEntity {
    id: number;
    code: string;
    title: string;
    created: Date;
    constructor(init?: Partial<TestModel>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}