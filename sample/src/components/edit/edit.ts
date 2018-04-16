import { Component, Vue, Inject, Prop, Emit, } from 'vue-property-decorator';
import FieldLayoutComponent from './field-layout.vue';
import { SelectItem, INotificationProvider, IHttpService, ICrudDataService } from 'ayax-common-types';
import { HttpService } from '../../services/base/http/http-service';
import { CrudDataService } from 'ayax-common-services';
import { FormComponentItem } from 'ayax-common-vue-assets';
import FormComponent from 'ayax-common-vue-assets';
import { ICacheService } from 'ayax-common-cache';
import RefreshableComponent from '../../assets/base/refreshable';

@Component({
    components: {
        'a-form': FormComponent
    }
})
export default class EditComponent extends Vue {
    @Inject() httpService: IHttpService;
    @Inject() notificationProvider: INotificationProvider;
    @Inject() cacheService: ICacheService;
    @Prop() title: string;
    @Prop() fields: FormComponentItem[];
    @Prop() entity: string;
    @Prop() defaultModel: any;
    $refs: {
        form: HTMLFormElement
    }
    crudDataService: ICrudDataService;
    id: number;
    model: any;
    valid: boolean = true;

    async created() {
        this.id = +this.$route.params.id,
        this.model = this.defaultModel
        this.crudDataService = new CrudDataService(this.httpService, `/${this.entity}`);
        this.fields.filter(x=>x.dictionary!=null && !x.items).forEach((field) => {
            this.cacheService.List(field.dictionary).then((items) => {
                field.items = items.map(x=> new SelectItem({text: x.name, value: x.id}));
            })
        });
        
        await this.load();
        Object.keys(this.model).forEach(x => {
            let field = this.fields.find(z => z.name && z.name == x);
            if(field) {
                field.model = this.model[x];
            } 
        });
    }

    get fetchModel() {
        let newModel = {};
        this.fields.forEach(x=> {
            if(x.name && x.model) {
                newModel[x.name] = x.model;
            }
        });
        return newModel;
    }

    get actionTitle() {
        return this.id > 0
            ? 'редактирование'
            : 'добавление';
    };

    onOk() {
        if (this.$refs.form.validate()) {
            this.save(this.fetchModel);
        } else {
            this.notificationProvider.Error("Проверьте данные");
        }

    };

    onCancel() {
        this.backToList();
    };

    save(data) {
        let method = this.id !== null && this.id > 0
        ? this.crudDataService.update(this.id, data)
        : this.crudDataService.add(data);

        method
            .then((response) => {
                this.backToList();
            })
            .catch(e => {
                this.notificationProvider.Error(e);
            });
    }
    async load() {
        try {
            if (this.id === 0) {
                return
            }
            let response = await this.crudDataService.get(this.id);
            if (response.data.status === 0) {
                this.model = response.data.result;
            } else {
                this.notificationProvider.Error(response.data.message);
                this.model = this.defaultModel();
            }
        } catch(e) {
            this.notificationProvider.Error(e);
        }
    };
    backToList() {
        this.$router.go(-1);
        // this.$router.push({ name: `${this.entity}-list`});
    };
}