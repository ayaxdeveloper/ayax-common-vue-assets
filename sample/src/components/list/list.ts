import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { IHttpService, Pagination, ISearchDataService, IListDataService, IClientSettings, INotificationProvider, IPagination, IEntity, ICrudDataService, IDataService, Dictionary } from 'ayax-common-types';
import { DataService, CrudDataService } from 'ayax-common-services';
import { PrefSummary } from '../../models/pref/pref-summary';
import TableComponent from '../../assets/components/table/table.vue';
import { TableComponentHeader } from 'ayax-common-vue-assets';
import { FastFilterComponentItem } from 'ayax-common-vue-assets';
import { TableComponentAction } from 'ayax-common-vue-assets';
import { Route } from 'vue-router';
import { ICacheService } from 'ayax-common-cache';

@Component
export default class ListComponent extends Vue {
    @Inject() httpService: IHttpService;
    @Inject() notificationProvider: INotificationProvider;
    @Inject() cacheService: ICacheService;
    @Inject() clientSettings: IClientSettings;
    @Prop() headers: TableComponentHeader[];
    @Prop() entity: string;
    @Prop() title: string;
    @Prop({required: true}) pagination: IPagination;
    @Prop() fastFilters: FastFilterComponentItem[];
    @Prop() actions: TableComponentAction[];
    @Prop() addRoute: Route;
    @Prop() editRoute: Route;
    @Prop() showRoute: Route;

    @Watch('pagination.page')
    PageChanged(newVal, oldVal) {
        if(newVal!==oldVal) {
            this.request.page = newVal;
            this.load();
        }
    }

    localHeaders: TableComponentHeader[];
    dataService: IDataService;

    request = {
        page: 1,
        perPage: this.clientSettings.listRowsPerpage
    };
    itemForRemove: IEntity | null;
    items: any[] = [];
    selected = [];
    removeDialog = false;
    loading = true;

    @Emit()
    onRowAction(item: IEntity, name: string) {
        if(!item) {
            return false;
        }
        switch(name) {
            case "edit": 
            this.edit(item);
            break;
            case "remove":
            this.remove(item);
            break;
            case "show":
            this.show(item);
            break;
        }
        return true;
    }

    private AddFilter(request) {
        let filteredRequest = {...request};
        this.headers.filter(x=> x.filter && x.filter.values)
        .forEach((header) => {           
            let filters = header.filter.FormRequestFilters();
            if(filters) {
                filteredRequest[header.filter.name] = filters;
            }
        });
        this.headers.filter(x=>x.sortBy).forEach((header)=> {
            filteredRequest[`${header.value}sort`] = header.sortBy;
        });
        console.log(`filteredRequest ${JSON.stringify(filteredRequest)}`);
        return filteredRequest; 
    }

    created() {
        this.dataService = new DataService(this.httpService, `/${this.entity}`);
        if(!this.pagination) {
            this.pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
        }
        try {
            let headersWithDictionaries = this.headers.filter(x=>x.dictionary && !x.items);
            Promise.all(headersWithDictionaries.map(x=>{
                return new Promise((resolve) => {
                    this.cacheService.List(x.dictionary)
                    .then(z=> {
                        x.items = z;
                        resolve();
                    });
                });
            })).then(()=> {
                this.load();
            });
        } catch(e) {
            this.notificationProvider.Error(e);
        }
    };

    add() {
        if(this.addRoute) {
            this.$router.push(this.addRoute);
        } else {
            this.$router.push({ name: `${this.entity}-edit`, params: { id: '0'}});
        }
    };
    edit(item) {
        if(this.editRoute) {
            this.editRoute.params.id = item.id;
            this.$router.push(this.editRoute);
        } else {
            this.$router.push({ name: `${this.entity}-edit`, params: { id: item.id } });
        }
    };
    show(item) {
        if(this.showRoute) {
            this.showRoute.params.id = item.id;
            this.$router.push(this.showRoute);
        } else {
            this.$router.push({ name: `${this.entity}-show`, params: { id: item.id } });
        }
        
        
    }

    remove(item) {
        this.itemForRemove = item;
        this.removeDialog = true;
    };
    removeOk() {
        if (!this.itemForRemove) {
            this.notificationProvider.Error('Удаляемый объект не существует');
            return;
        }
        this.dataService.delete(this.itemForRemove.id).then((response) => {
            this.loading = true;
            let operation = response.data;
            if (operation.status === 0) {
                this.notificationProvider.Success("Объект удален");
                this.load()
            } else {
                this.notificationProvider.Error(`Ошибка удаления объекта: ${operation.message}`);
            }
            this.loading = false;
            this.itemForRemove = null;
            this.removeDialog = false;
        })
            .catch(e => {
                this.notificationProvider.Error(`Ошибка удаления объекта: ${e}`);
                this.loading = false;
                this.itemForRemove = null;
                this.removeDialog = false;
            });
    };
    removeCancel() {
        this.itemForRemove = null;
        this.removeDialog = false;
    };

    public async load() {
        try {
            let response =  await this.dataService.search<any>(this.AddFilter(this.request));
            let operation = response.data;
            if(operation.status === 0) {
                this.items =  operation.result.data;
                this.pagination.totalItems = operation.result.total
            } else {
                console.log(operation.message);
            }
            this.loading = false;
        } catch(e) {
            console.log(e);
            this.loading = false;
        } 
    }
}