import { ICacheService } from "ayax-common-cache";
import { IOperationService } from "ayax-common-operation";
import { INotificationProvider, SelectItem } from "ayax-common-types";
import { Component, Inject, Prop, Vue, } from "vue-property-decorator";
import { FormComponentItem } from "../form/form-item";

@Component
export default class EditComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    @Inject() cacheService: ICacheService;
    @Inject() operationService: IOperationService; 
    @Prop() getUrl: string;
    @Prop() updateUrl: string;
    @Prop() addUrl: string;
    @Prop() title: string;
    @Prop() fields: FormComponentItem[];
    @Prop() entity: string;
    @Prop() defaultModel: any;
    $refs: {
        form: HTMLFormElement
    };
    id: number;
    model: any;
    valid = true;
    _getUrl: string;
    _updateUrl: string;
    _addUrl: string;

    itemIsSaving = false;

    shortkeys = {
        save: ["enter"],
        close: ["esc"]
    };

    shortkeyHandler(key : any) {
        if (!key || !key.srcKey) {
            return;
        }
        switch (key.srcKey) {
            case "save":
                this.onOk();
            break;

            case "close":
                this.onCancel();
            break;

            default:
            break;
        }
    }

    async created() {
        if (this.entity && !this.getUrl) {
            this._getUrl = `/${this.entity}/get`;
        } else {
            this._getUrl = this.getUrl;
        }
        if (this.entity && !this.updateUrl) {
            this._updateUrl = `/${this.entity}/update`;
        } else {
            this._updateUrl = this.updateUrl;
        }
        if (this.entity && !this.addUrl) {
            this._addUrl = `/${this.entity}/add`;
        } else {
            this._addUrl = this.addUrl;
        }
        this.id = +this.$route.params.id;
        this.model = this.defaultModel;
        this.fields.filter(x => x.dictionary != null && !x.items).forEach((field) => {
            this.cacheService.List(field.dictionary).then((items) => {
                field.items = items.map(x => new SelectItem({text: x.name, value: x.id}));
            });
        });
        
        await this.load();
        Object.keys(this.model).forEach(x => {
            const field = this.fields.find(z => z.name && z.name === x);
            if (field) {
                field.model = this.model[x];
            } 
        });
    }

    get fetchModel() {
        const newModel = {};
        this.fields.forEach(x => {
            if (x.name && x.model) {
                newModel[x.name] = x.model;
            }
        });
        return newModel;
    }

    get actionTitle() {
        return this.id > 0
            ? "редактирование"
            : "добавление";
    }

    onOk() {
        if (this.$refs.form.validate()) {
            this.save(this.fetchModel);
        } else {
            this.notificationProvider.Error("Проверьте данные");
        }

    }

    onCancel() {
        this.backToList();
    }

    async save(data) {
        this.itemIsSaving = true;
        try {
            const operation = this.id !== null && this.id > 0
            ? this.operationService.put(`${this._updateUrl}/${this.id}`, data)
            : this.operationService.post(`${this._addUrl}`, data);
            (await operation).ensureSuccess();
            this.backToList();
        } catch (e) {
            this.notificationProvider.Error(e);
        }
        this.itemIsSaving = false;
    }
    async load() {
        try {
            if (this.id === 0) {
                return;
            }
            const response = (await this.operationService.get(`${this._getUrl}/${this.id}`)).ensureSuccess();
            this.model = response;
        } catch (e) {
            this.notificationProvider.Error(e);
            this.model = this.defaultModel();
        }
    }

    backToList() {
        this.$router.go(-1); 
        // this.$router.push({ name: `${this.entity}-list`});
    }
}