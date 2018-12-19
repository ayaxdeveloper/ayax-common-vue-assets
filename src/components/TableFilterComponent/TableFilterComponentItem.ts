import { SelectItem } from "ayax-common-types";
import * as moment from "moment";
import { Filter } from "./Filter";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";

export class TableFilterComponentItem {
    name?: string;
    appearance: TableFilterComponentItemAppearance;
    requestName: string;
    requestType: TableFilterComponentItemType = TableFilterComponentItemType.Eq;
    inputType: TableFilterComponentItemInputType = TableFilterComponentItemInputType.Text;
    label?: string;
    icon?: string;
    hint?: string;
    buttonText?: string;
    buttonClickedText?: string;
    buttonsForToggle?: Array<{ text: string; value: any }>;
    largeInput = false;
    placeholder?: string;
    selectItems?: SelectItem[];
    selectItemsFromDictionary: string;
    selectItemsFromPromise: Promise<SelectItem[]>;
    values: any[] = [];
    active = true;
    groupName: string = null;
    numbersAfterComma?: number;
    width = 180;
    quickDates = [
        [moment(new Date()).format("YYYY.MM.DD"), moment(new Date()).format("YYYY.MM.DD") + " 23:59:59", "Сегодня"],
        [
            moment(new Date())
                .add(1, "days")
                .format("YYYY.MM.DD"),
            moment(new Date())
                .add(1, "days")
                .format("YYYY.MM.DD") + " 23:59:59",
            "Завтра",
        ],
        [
            moment(new Date())
                .startOf("isoWeek")
                .format("YYYY.MM.DD"),
            moment(new Date())
                .endOf("isoWeek")
                .format("YYYY.MM.DD") + " 23:59:59",
            "Неделя",
        ],
        [
            moment(new Date())
                .startOf("month")
                .format("YYYY.MM.DD"),
            moment(new Date())
                .endOf("month")
                .format("YYYY.MM.DD") + " 23:59:59",
            "Месяц",
        ],
    ];

    constructor(init: Partial<TableFilterComponentItem>) {
        Object.assign(this, init);
    }

    public FormRequestFilters(): Filter[] | Filter | null {
        switch (this.requestType) {
            case TableFilterComponentItemType.Eq:
                if (this.values[0]) {
                    return Filter.Eq(this.values[0]);
                }
                break;
            case TableFilterComponentItemType.Like:
                if (this.values[0]) {
                    return Filter.Like(this.values[0]);
                }
                break;
            case TableFilterComponentItemType.Range:
                return Filter.Range(this.values);
            case TableFilterComponentItemType.In:
                if (this.values.length > 0) {
                    return Filter.In(this.values);
                }
                break;
            default:
                return null;
        }
        return null;
    }
}
