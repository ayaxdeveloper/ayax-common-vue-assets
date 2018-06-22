import { Component, Vue, Prop } from 'vue-property-decorator';
import { FormComponentItem } from './form-item';
import { HtmlElementType } from 'ayax-common-types';

@Component
export default class FormComponent extends Vue {
    @Prop() fields: FormComponentItem[];
    @Prop() model: any;
    formVisible = false;

    async created() {
        if(this.model) {
            Object.keys(this.model).forEach(key => {
                let field = this.fields.find(x=>x.name == key);
                if(field) {
                    field.model = this.model[key];
                }
            })
        }
        const fieldsPromises = this.fields.filter(x => x.itemsFromPromise && !x.items).map(x => {
            return new Promise((resolve) => {
                x.itemsFromPromise
                .then(z => {
                    x.items = z;
                    resolve();
                })
            })
        });

        await Promise.all(fieldsPromises);

        this.formVisible = true;
    }

    get computedRows() {
        let rows: {[rowId: number]: FormComponentItem[]} = {};
        let cnt = 1;
        rows[0] = [];
        this.fields.forEach(x=> {
            
            if(x.hidden || x.type == HtmlElementType.hidden) {
                rows[0].push(x);
            } else {
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
            }
        });
        return rows;
    }
}