import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormComponentItem } from './form-item';
import { HtmlElementType } from 'ayax-common-types';
import { DateHelper } from 'ayax-common-helpers';
import * as moment from 'moment';
@Component
export default class FormControlComponent extends Vue {
    @Prop() field: FormComponentItem;
    input = HtmlElementType.input;
    select = HtmlElementType.select;
    checkbox = HtmlElementType.checkbox;
    btn = HtmlElementType.btn;
    date = HtmlElementType.date;
    datetime = HtmlElementType.datetime;
    password = HtmlElementType.password;
    textarea = HtmlElementType.textarea;
    hidden = HtmlElementType.hidden;
    menu: boolean = false;
    dateFormatted: string;
    show: boolean = true;

    created() {
        if(this.field.type == this.date) {
            if(!this.field.model) {
                this.dateFormatted = moment().startOf('day').format('DD.MM.YYYY');
            } else {
                this.dateFormatted = this.formatDate(this.field.model);
            }
            this.field.model = this.parseDate(this.dateFormatted);
        }
        if(this.field.required) {
            if(this.field.rules) {
                this.field.rules.push(v=> !!v || "Обязателное поле для заполнения");
            } else {
                this.field.rules = [v=> !!v || "Обязателное поле для заполнения"];
            }
        } 
    }

    @Watch('field.model')
    onModelChanges(model) {
        if(this.field.type == this.date) {
            // console.log(this.formatDate(this.field.model));
            this.dateFormatted = this.formatDate(this.field.model);
            // this.refresh();
        }
    }

    datePickerCancel(name) {
        this.field.model=null;
        this.menu = false;
    }
    datePickerOk(name) {
        this.menu = false;
    }
    formatDate (date: any) {
        return DateHelper.formatDate(date);
    };
    parseDate (date: any) {
        return DateHelper.parseDate(date);
    };

    refresh() {
        this.show = false;
        this.$nextTick(() => {
            this.show = true;
        })
    }
}