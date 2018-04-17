import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormComponentItem } from './form-item';
import { HtmlElementType } from 'ayax-common-types';
import * as moment from 'moment';
import { DateHelper } from 'ayax-common-helpers';
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
    datePicker: boolean = false;
    dateString: string = "";
    dateISOString: string = "";
    dateObject: Date = new Date();
    dateStringForPicker: string = "";

    created() {
        if(this.field.required) {
            if(this.field.rules) {
                this.field.rules.push(v=> !!v || "Обязателное поле для заполнения");
            } else {
                this.field.rules = [v=> !!v || "Обязателное поле для заполнения"];
            }
        } 
    }

    private dateTypeInit() {
        if(this.field.type == this.date) {
            this.dateObject = this.field.model ? DateHelper.ToDate(this.field.model) : moment().startOf('day').toDate();
            this.dateString = DateHelper.ToString(this.dateObject);
            this.dateISOString = DateHelper.ToStringISO(this.dateObject);
            this.dateStringForPicker = DateHelper.ToString(this.dateObject,"YYYY-MM-DD");
        }
    }

    @Watch("field.model")
    onFieldModelChange(model: any) {
        this.dateTypeInit();
    }


    @Watch("datePicker") 
    onDateStringChange() {
        if(this.dateString && this.dateString != "") {
            this.field.model = DateHelper.ToStringISO(DateHelper.ToDate(this.dateString, "DD.MM.YYYY"));
        }
    }

    @Watch("dateStringForPicker")
    onPickerDateChange(val) {
        if(val) {
            this.field.model = this.dateStringForPicker;
        }
    }

    dateFieldOnClick() {
        this.datePicker = true;
    }

    datePickerCancel(name) {
        this.datePicker = false;
    }
    datePickerOk(name) {
        this.datePicker = false;
    }

    refreshDatePicker() {
        this.datePicker = !this.datePicker;
        this.$nextTick(() => {
            this.datePicker = !this.datePicker;
        })
    }
}