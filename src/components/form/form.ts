import { Component, Vue, Prop } from 'vue-property-decorator';
import { FormComponentItem } from './form-item';

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
        let cnt = 1;
        this.fields.forEach(x=> {
            rows[0] = [];
            if(x.hidden) {
                rows[0].push(x);
            } else {
                if(x.row == 0) {
                    if(!rows[cnt+1]) {
                        rows[cnt+1] = [];
                    }
                    rows[cnt+1].push(x);
                    cnt++;
                } else {
                    if(!rows[x.row+1]) {
                        rows[x.row+1] = [];
                    }
                    rows[x.row+1].push(x);
                }
            }
        });
        return rows;
    }
}