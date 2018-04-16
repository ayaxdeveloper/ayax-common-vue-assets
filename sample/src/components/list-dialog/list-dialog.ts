import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { TableComponentHeader } from '../table/table-header';
import { IPagination, IEntity, IClientSettings, INotificationProvider, Pagination, IOperationService, Dictionary, SearchResponse } from 'ayax-common-types';
import { TableComponentAction } from '../table/table-action';
import { FormComponentItem } from '../form/form-item';
import { ICacheService } from 'ayax-common-cache';

@Component
export default class ListDialogComponent extends Vue {
    @Inject() clientSettings: IClientSettings;
    @Inject() notificationProvider: INotificationProvider;
    @Inject() operationService: IOperationService;
    @Inject() cacheService: ICacheService;
    @Prop() headers: TableComponentHeader[];
    @Prop({required: true}) pagination: IPagination;
    @Prop() actions: TableComponentAction[];
    @Prop() entity: string;
    @Prop() defaultModel: any;
    @Prop() fields: FormComponentItem[];
    @Prop() search: {url: string, method: string};
    @Prop() updateUrl: string;
    @Prop() addUrl: string;
    @Prop() getUrl: string;
    @Prop() deleteUrl: string;
    @Prop() title: string;
    editDialog: boolean = false;
    request: any;
    itemForRemove: IEntity | null;
    items: any[] = [];
    selected = [];
    removeDialog = false;
    loading = true;
    _search: {url: string, method: string};
    _updateUrl: string;
    _addUrl: string;
    _getUrl: string;
    _deleteUrl: string;

    async created() {
        if(this.entity && !this.search) {
            this._search = {url: `/${this.entity}/search`, method : 'post'};
        } else {
            this._search = this.search;
        }
        if(this.entity && !this.updateUrl) {
            this._updateUrl = `/${this.entity}/update`;
        } else {
            this._updateUrl = this.updateUrl;
        }
        if(this.entity && !this.addUrl) {
            this._addUrl = `/${this.entity}/add`;
        } else {
            this._addUrl = this.addUrl;
        }
        if(this.entity && !this.getUrl) {
            this._getUrl = `/${this.entity}/get`;
        } else {
            this._getUrl = this.getUrl;
        }
        if(this.entity && !this.deleteUrl) {
            this._deleteUrl = `/${this.entity}/delete`;
        } else {
            this._deleteUrl = this.deleteUrl;
        }
        if(!this.pagination) {
            this.pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
        }
        this.request = {
            page: 1,
            perPage: this._search.method == "post" ? this.clientSettings.listRowsPerpage : 100
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

    @Watch('pagination.page')
    PageChanged(newVal, oldVal) {
        if(newVal!==oldVal) {
            this.request.page = newVal;
            this.load();
        }
    }

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
        }
        return name;
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
        return filteredRequest; 
    }

    mapModelToFields(model: any) {
        Object.keys(model).forEach(x=> {
            let field = this.fields.find(f=>f.name == x);
            if(field) {
                field.model = model[x];
            }
        });
    }

    getModelFromFields(): any {
        let model = {};
        this.fields.filter(x=>x.name && x.model).forEach(x=> {
            model[x.name] = x.model;
        });
        return model;
    }

    add() {
        this.mapModelToFields(this.defaultModel);
        this.editDialog = true;
    };
    async edit(item) {
        try {
            // console.log(`${this._getUrl}/${item.id}`);
            let fetch = (await this.operationService.get(`${this._getUrl}/${item.id}`)).data;
            if(fetch.status == 0) {
                this.mapModelToFields(fetch.result);
                this.editDialog = true;
            } else {
                this.notificationProvider.Error(fetch.message);
                this.editDialog = false;
            }
        } catch(e) {
            this.notificationProvider.Error(e);
            this.editDialog = false;
        }
    };
    async editOk() {
        try {
            let model = this.getModelFromFields();
            let operation = +model.id > 0 
            ? (await this.operationService.put(`${this._updateUrl}/${+model.id}`, model)).data
            : (await this.operationService.post(`${this._addUrl}`, model)).data;
            if(operation.status == 0) {
                this.notificationProvider.Success("Успешно сохранено");
                this.editDialog = false;
                this.load();
            } else {
                this.notificationProvider.Error(operation.message);
                this.editDialog = true;
            }
        } catch (e) {
            this.notificationProvider.Error(e);
            this.editDialog = true;
        }
    }

    editCancel() {
        this.mapModelToFields(this.defaultModel);
        this.editDialog = false;
    }

    remove(item) {
        this.itemForRemove = item;
        this.removeDialog = true;
    };
    async removeOk() {
        try {
            if (!this.itemForRemove) {
                this.notificationProvider.Error('Удаляемый объект не существует')
                return;
            }
            let operation = (await this.operationService.delete(`${this._deleteUrl}/${this.itemForRemove.id}`)).data;
            if(operation.status == 0) {
                this.notificationProvider.Success("Удалено");
                this.load();
            } else {
                this.notificationProvider.Error(operation.message);
            }
            this.removeDialog = false;
            this.itemForRemove = null;
        } catch(e) {
            this.notificationProvider.Error(e);
        }
    };
    removeCancel() {
        this.itemForRemove = null;
        this.removeDialog = false;
    };

    public async load() {
        try {
            this.loading = true;
            if(this._search.method == "post") {
                let operation = (await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`,this.AddFilter(this.request))).data;
                if(operation.status === 0) {
                    this.items =  operation.result.data;
                    this.pagination.totalItems = operation.result.total;
                    // this.notificationProvider.Success("Загружено");
                } else {
                    this.notificationProvider.Error(operation.message);
                }
                this.loading = false;
            } else {
                let operation = (await this.operationService.get<any[]>(`${this._search.url}`)).data;
                if(operation.status === 0) {
                    this.items =  operation.result;
                    this.pagination.totalItems = this.items.length;
                    // this.notificationProvider.Success("Загружено");
                } else {
                    console.log(`error loading post ${JSON.stringify(operation)}`);
                    this.notificationProvider.Error(operation.message);
                }
                this.loading = false;
            }
        } catch(e) {
            this.notificationProvider.Error(e);
            this.loading = false;
        } 
    }
}