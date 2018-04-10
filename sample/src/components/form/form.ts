import { Component, Vue, Prop } from 'vue-property-decorator';
import { FormComponentItem } from './form-item';
import { HtmlElementType } from 'ayax-common-types';
import * as moment from 'moment';
import { DateHelper } from 'ayax-common-helpers';
import { SelectItem } from 'ayax-common-types';

@Component
export default class FormComponent extends Vue {
    @Prop() fields: FormComponentItem[];
    @Prop() model: any;

    created() {
        if(this.model) {
            Object.keys(this.model).forEach(key => {
                let field = this.fields.find(x=>x.name == key);
                if(field) {
                    field.model = this.model[key];
                }
            })
        }
    }

    get computedRows() {
        let rows: {[rowId: number]: FormComponentItem[]} = {};
        let cnt = 0;
        this.fields.forEach(x=> {
            if(x.row == 0) {
                if(!rows[cnt]) {
                    rows[cnt] = [];
                }
                rows[cnt].push(x);
                cnt++;
            } else {
                if(!rows[x.row]) {
                    rows[x.row] = [];
                }
                rows[x.row].push(x);
            }
        });
        return rows;
    }
}