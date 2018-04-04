import { Vue, Component, Prop, Emit, Inject, Watch } from 'vue-property-decorator';
import { TableFilterComponentItem, TableFilterComponentItemType, TableFilterComponentShortkey } from './table-filter-item';
import { SelectItem } from 'ayax-common-types';
import { TableComponentHeader, TableComponentHeaderType } from '../table/table-header';

@Component
export default class TableFilterComponent extends Vue {
    @Prop({required: true}) header: TableComponentHeader;
    @Prop() value: any;
    
    focus: false;
    filterTypes: {[name: string]: TableFilterComponentItemType} = {};
    headerTypes: {[name: string]: TableComponentHeaderType} = {};
    searchInput: Function;
    applyFilterButton: boolean = false;
    selectItems: SelectItem[] = [];

    created() {

        Object.keys(TableFilterComponentItemType).forEach(item => {
            this.filterTypes[item] = TableFilterComponentItemType[item];
        });
        Object.keys(TableComponentHeaderType).forEach(item => {
            this.headerTypes[item] = TableComponentHeaderType[item];
        });
    }
    @Watch('header.filter.values')
    onFilterValuesChange(newVal: any, oldVal: any) {
        if(newVal) {
            this.applyFilterButton = true;
        } else {
            this.applyFilterButton = false;
        }
    }

    getMask() {

    }

    getHint() {
        switch(this.header.filter.type) {
            case TableFilterComponentItemType.InputEq:
            return "Точное совпадение";
            case TableFilterComponentItemType.InputLike:
            return "Содержит"; 
            case TableFilterComponentItemType.SelectSingle:
            return "Выбор одного"; 
            case TableFilterComponentItemType.SelectMultiple:
            return "Выбор нескольких"; 
            default:
            return null;
        }
    }

    shortkeyHandler(key : any) {
        if(!key || !key.srcKey) {
            return;
        }
        switch(key.srcKey) {
            case "applyFilter":
                this.applyFilter();
            break;
        }
    }

    @Watch('header.dictionary')
    onSelectItemsChange() {
        this.$forceUpdate();
    }

@Emit()
    applyFilter() {
        this.applyFilterButton = false;
    }
    reloadSelectItems() {
        const from = this.header.items;
        this.$forceUpdate();
        // console.log(JSON.stringify(this.header.items));
        if(this.header.dictionary && from) {
            this.selectItems = from.map(x=> new SelectItem({value: x.id, text: x.name}));
        }
        
    }
}