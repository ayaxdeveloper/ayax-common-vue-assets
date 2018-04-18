import { IEntity, guid } from "ayax-common-types";

export class PrefSummary implements IEntity {
    id: string | number | guid;
    title: string;
    type: number;
    value: any;
}