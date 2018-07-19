import { FormComponentItem } from "../Components/FormComponent/FormItem";

export class FormComponentHelper {
    static mapFieldsToModel(fields: FormComponentItem[], model: any) {
        Object.keys(model).forEach(key => {
            const field = fields.find(x => x.name === key);
            if (field) {
                model[key] = field.model;
            }
        });
    }

    static mapModelToFields(model: any, fields: FormComponentItem[]) {
        Object.keys(model).forEach(key => {
            const field = fields.find(x => x.name === key);
            if (field) {
                field.model = model[key];
            }
        });
    }
}