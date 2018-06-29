import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { TableFilterComponentItem } from './TableFilterComponentItem';
import { TableComponentHeader, TableComponentHeaderType } from '../table/table-header';
import { TableFilterComponentItemType } from './TableFilterComponentItemType';
import { TableFilterComponentItemInputType } from './TableFilterComponentItemInputType';
import { TableFilterComponentItemAppearance } from './TableFilterComponentItemAppearance';

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
    filterAppearance: {[name: string]: TableFilterComponentItemAppearance} = {};
    searchInput: Function;
    applyFilterButton: boolean = false;
    buttonText = '';

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
        Object.keys(TableFilterComponentItemAppearance).forEach(item => {
            this.filterAppearance[item] = TableFilterComponentItemAppearance[item];
        });
        if(this.filter.inputType == this.filterInputTypes['Button']) {
            this.filter.values[0] = false;
            this.buttonText = this.filter.buttonText;
        }

    }

    changeBtnValue() {
        this.filter.values[0] = !this.filter.values[0];
        if(this.filter.values[0] == true) {
            this.buttonText = this.filter.buttonClickedText;
        } else {
            this.buttonText = this.filter.buttonText;
        }
        this.applyFilter();
    }

    @Watch('filter.values')
    onFilterValuesChange(newVal: any, oldVal: any) {
        if(newVal) {
            if((newVal == [] || newVal == '') && oldVal != []) {
                this.applyFilterButton = true;
            }
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
            case TableFilterComponentItemType.Eq:
            return "Точное совпадение";
            case TableFilterComponentItemType.Like:
            return "Содержит";
            case TableFilterComponentItemType.In:
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
        if(this.filter.requestType == this.filterTypes['Range'] && this.filter.inputType == this.filterInputTypes['Date']) {
            if(this.filter.values.length >= 2) {
                this.filter.values[1] = this.filter.values[1] + ' 23:59:59';
            }
        }
        
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