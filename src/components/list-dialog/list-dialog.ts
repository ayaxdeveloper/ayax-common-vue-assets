import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { TableComponentHeader } from '../table/table-header';
import { IPagination, IEntity, IClientSettings, INotificationProvider, Pagination, Dictionary, SearchResponse } from 'ayax-common-types';
import { IOperationService } from 'ayax-common-services'
import { TableComponentAction } from '../table/table-action';
import { FormComponentItem } from '../form/form-item';
import { ICacheService } from 'ayax-common-cache';
import { TableFilterComponentItem } from '../table-filter/table-filter-item';

@Component
export default class ListDialogComponent extends Vue {
    @Inject() clientSettings: IClientSettings;
    @Inject() notificationProvider: INotificationProvider;
    @Inject() operationService: IOperationService;
    @Inject() cacheService: ICacheService;
    @Prop() headers: TableComponentHeader[];
    @Prop({required: true}) pagination: IPagination;
    @Prop({default: () => []}) tableFilters: TableFilterComponentItem[];
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
    @Prop({ default: true}) selectable: boolean; 
    @Prop({ default: false}) selectableSingle: boolean; 
    @Prop({default: 'secondary'}) topbarColor: string;
    @Prop({default: 'primary'}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    editDialog: boolean = false;
    request: any;
    itemForRemove: IEntity | null;
    itemsForRemove: any[] | null;
    items: any[] = [];
    selected = [];
    removeDialog = false;
    removeSelectedDialog = false;
    loading = true;  
    _search: {url: string, method: string};
    _updateUrl: string;
    _addUrl: string;
    _getUrl: string;
    _deleteUrl: string;
    tableVisible: boolean = false;

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
        await Promise.all(this.headers.filter(x=>x.dictionary && !x.items).map(x=>{
            return new Promise((resolve) => {
                this.cacheService.List(x.dictionary)
                .then(z=> {
                    x.items = z;
                    resolve();
                });
            });
        }));

        await Promise.all(this.headers.filter(x=>x.dictionaryPromise && !x.items).map(x=>{
            return new Promise((resolve) => {
                x.dictionaryPromise
                .then(z=> {
                    x.items = z;
                    resolve();
                });
            });
        }));

        await Promise.all(this.tableFilters.filter(x => !x.selectItems && x.selectItemsFromDictionary).map(x => {
            return new Promise((resolve) => {
                this.cacheService.ListAsSelectItems(x.selectItemsFromDictionary)
                .then(z => {
                    x.selectItems = z;
                    resolve();
                })
            }) 
        }));

        await Promise.all(this.tableFilters.filter(x => !x.selectItems && x.selectItemsFromPromise).map(x => {
            return new Promise((resolve) => {
                x.selectItemsFromPromise
                .then(z => {
                    x.selectItems = z;
                    resolve();
                })
            }) 
        }));

        this.tableVisible = true;
        this.load();
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
        let tableAction = this.actions.find(x=>x.name == name);
        if(tableAction && tableAction.action) {
            tableAction.action(item);
            return name;
        }
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

    @Emit()
    onBarAction(items: any[], name: string) {
        let tableAction = this.actions.find(x=>x.name == name);
        if(tableAction && tableAction.action) {
            tableAction.action(items);
            return name;
        }
        switch(name) {
            case 'add':
            this.add();
            break;
            case 'removeSelected':
            this.removeSelected(items);
            break;
        }
        return name;
    }

    private AddFilter(request) {
        let filteredRequest = {...request};
        this.tableFilters.filter(x => x.values.length > 0)
        .forEach((filter) => {           
            let filters = filter.FormRequestFilters();
            if(filters) {
                filteredRequest[filter.requestName] = filters;
            }
        });
        this.headers.filter(x=>x.sortBy).forEach((header)=> {
            filteredRequest[`${header.value}sort`] = header.sortBy;
        });
        return filteredRequest; 
    }

    mapModelToFields(model: any) {
        this.fields.forEach(element => {
            element.model = null;
        });
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
            let fetch = (await this.operationService.get(`${this._getUrl}/${item.id}`));
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
            ? (await this.operationService.put(`${this._updateUrl}/${+model.id}`, model))
            : (await this.operationService.post(`${this._addUrl}`, model));
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

    removeSelected(items) {
        if(items.length > 0) {
            this.itemsForRemove = items;
        }
        this.removeSelectedDialog = true;
    }
    async removeOk() {
        try {
            if (!this.itemForRemove) {
                this.notificationProvider.Error('Удаляемый объект не существует')
                return;
            }
            let operation = (await this.operationService.delete(`${this._deleteUrl}/${this.itemForRemove.id}`));
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

    async removeSelectedOk() {
        try {
            if (!this.itemsForRemove) {
                this.notificationProvider.Error('Удаляемые объекты не существуют')
                return;
            }
            let operation = (await this.operationService.post(`${this._deleteUrl}/bulkdelete`, this.itemsForRemove));
            if(operation.status == 0) {
                this.notificationProvider.Success("Удалено");
                this.load();
            } else {
                this.notificationProvider.Error(operation.message);
            }
            this.removeSelectedDialog = false;
            this.itemsForRemove = null;
        } catch(e) {
            this.notificationProvider.Error(e);
        }
    };

    removeCancel() {
        this.itemForRemove = null;
        this.removeDialog = false;
        this.itemsForRemove = null;
        this.removeSelectedDialog = false;
    };

    public async load() {
        try {
            this.loading = true;
            if(this._search.method == "post") {
                let operation = (await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`,this.AddFilter(this.request)));
                if(operation.status === 0) {
                    this.items =  operation.result.data;
                    this.pagination.totalItems = operation.result.total;
                } else {
                    this.notificationProvider.Error(operation.message);
                }
                this.loading = false;              
            } else {
                let operation = (await this.operationService.get<any[]>(`${this._search.url}`));
                if(operation.status === 0) {
                    this.items =  operation.result;
                    this.pagination.totalItems = this.items.length;
                } else {
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