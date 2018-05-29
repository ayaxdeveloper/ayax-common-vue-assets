import { Vue, Component, Prop, Emit, Inject, Watch } from 'vue-property-decorator';
import { TableFilterComponentItem, TableFilterComponentItemType, TableFilterComponentShortkey, TableFilterComponentItemInputType } from './table-filter-item';
import { SelectItem } from 'ayax-common-types';
import { TableComponentHeader, TableComponentHeaderType } from '../table/table-header';

@Component
export default class TableFilterComponent extends Vue {
    @Prop({default: null}) header: TableComponentHeader;
    @Prop({required: true}) filter: TableFilterComponentItem;
    @Prop() value: any;
    @Prop({default: 0}) index: number;
    @Prop({default: true}) applyFilterButtonVisibility: boolean;
    @Prop({default: "grey lighten-1"}) color: string;
    focus: false;
    filterTypes: {[name: string]: TableFilterComponentItemType} = {};
    headerTypes: {[name: string]: TableComponentHeaderType} = {};
    filterInputTypes: {[name: string]: TableFilterComponentItemInputType} = {};
    searchInput: Function;
    applyFilterButton: boolean = false;

    created() {
        Object.keys(TableFilterComponentItemType).forEach(item => {
            this.filterTypes[item] = TableFilterComponentItemType[item];
        });
        Object.keys(TableComponentHeaderType).forEach(item => {
            this.headerTypes[item] = TableComponentHeaderType[item];
        });
        Object.keys(TableFilterComponentItemInputType).forEach(item => {
            this.filterInputTypes[item] = TableFilterComponentItemInputType[item];
        });
    }

    @Watch('filter.values')
    onFilterValuesChange(newVal: any, oldVal: any) {
        if(newVal) {
            if(this.applyFilterButtonVisibility != false) {
                this.applyFilterButton = true;
            }
        } else {
            this.applyFilterButton = false;
        }
        if(this.filter.inputType == this.filterInputTypes['Date']) {
            if(!this.filter.values) {
                this.filter.values = [];
            }
            this.applyFilter();
        }
    }

    @Watch('applyFilterButtonVisibility')
    onApplyButtonChange(value) {
       if(!value) {
           this.applyFilterButton = false;
       }
    }

    getMask() {

    }

    getHint() {
        switch(this.filter.requestType) {
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
    // reloadSelectItems() {
    //     const from = this.header.items;
    //     this.$forceUpdate();
    //     // console.log(JSON.stringify(this.header.items));
    //     if(this.header.dictionary && from) {
    //         this.selectItems = from.map(x=> new SelectItem({value: x.id, text: x.name}));
    //     }
        
    // }
}