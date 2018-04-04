import { FormComponentItem } from "../components/form/form-item";

export const FormComponentHelper = {
    mapFieldsToModel(fields: FormComponentItem[], model: any) {
        Object.keys(model).forEach(key => {
            let field = fields.find(x=>x.name == key);
            if(field) {
                model[key] = field.model;
            }
        });
    },
    mapModelToFields(model: any, fields: FormComponentItem[]) {
        Object.keys(model).forEach(key => {
            let field = fields.find(x=>x.name == key);
            if(field) {
                field.model = model[key];
            }
        });
    }
}