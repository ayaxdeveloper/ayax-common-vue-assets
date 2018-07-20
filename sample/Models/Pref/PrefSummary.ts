import { Guid, IEntity } from "ayax-common-types";

export class PrefSummary implements IEntity {
    id: string | number | Guid;
    title: string;
    type: number;
    value: any;
}