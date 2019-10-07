import { DateHelper } from "ayax-common-helpers";
import { IListItem, SortableField } from "ayax-common-types";

export class TableComponentHeader {
  align = "left";
  value: string;
  text: string;
  dictionary?: string;
  dictionaryPromise?: Promise<IListItem[]>;
  items: IListItem[];
  isVisible = true;
  hiddenable = true;
  width?: number | string;
  formatter: (value: any) => void;
  sortBy?: SortableField;
  sortable = false;
  mask: string;
  type: TableComponentHeaderType = TableComponentHeaderType.string;
  order: number;
  initialOrder: number;
  custom = false;
  wrap = true;

  constructor(init?: Partial<TableComponentHeader>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  public static String(init: Partial<TableComponentHeader>) {
    return new TableComponentHeader(init);
  }

  public static Date(init: Partial<TableComponentHeader>) {
    init.formatter = value => DateHelper.formatDate(value);
    init.type = TableComponentHeaderType.date;
    return new TableComponentHeader(init);
  }

  public static DateTime(init: Partial<TableComponentHeader>) {
    init.formatter = value => DateHelper.formatDate(value, "DD.MM.YYYY HH:mm");
    init.type = TableComponentHeaderType.datetime;
    return new TableComponentHeader(init);
  }

  public static Boolean(init: Partial<TableComponentHeader>) {
    init.formatter = (value: boolean) => {
      return value === true ? "Да" : "Нет";
    };
    init.type = TableComponentHeaderType.boolean;
    return new TableComponentHeader(init);
  }

  public static Phone(init: Partial<TableComponentHeader>) {
    init.formatter = (val: string) => {
      if (val && val.length >= 11) {
        val = `${val[0]} (${val.slice(1, 4)}) ${val.slice(4, 7)}-${val.slice(7, 9)}-${val.slice(9, 11)}`;
      }
      return val;
    };
    init.type = TableComponentHeaderType.phone;
    init.wrap = false;
    return new TableComponentHeader(init);
  }
}

export enum TableComponentHeaderType {
  string,
  date,
  datetime,
  boolean,
  phone,
}
