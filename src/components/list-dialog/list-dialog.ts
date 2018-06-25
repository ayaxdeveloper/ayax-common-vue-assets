import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { TableComponentHeader } from '../table/table-header';
import { IPagination, IEntity, IClientSettings, INotificationProvider, Pagination, SearchResponse } from 'ayax-common-types';
import { TableComponentAction } from '../table/table-action';
import { FormComponentItem } from '../form/form-item';
import { ICacheService } from 'ayax-common-cache';
import { TableFilterComponentItem } from '../table-filter/table-filter-item';
import { IOperationService } from 'ayax-common-operation'; 

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
    @Prop() bulkDeleteUrl: string;
    @Prop() title: string;
    @Prop({ default: true}) selectable: boolean; 
    @Prop({ default: false}) selectableSingle: boolean; 
    @Prop({default: 'secondary'}) topbarColor: string;
    @Prop({default: 'primary'}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    @Prop({default: null}) toggledItemSlot;
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
    _bulkDeleteUrl: string;
    tableVisible: boolean = false;

    itemIsSaving = false;

    editModalShortkeys = {
        save: ['enter'],
        close: ['esc']
    }

    editModelShortkeyHandler(key : any) {
        if(!key || !key.srcKey) {
            return;
        }
        switch(key.srcKey) {
            case "save":
                this.editOk();
            break;

            case "close":
                this.editCancel();
            break;
        }
    }

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
        if(this.entity && !this.bulkDeleteUrl) {
            this._bulkDeleteUrl = `/${this.entity}/bulkdelete`;
        } else {
            this._bulkDeleteUrl = this.bulkDeleteUrl;
        }
        if(!this.pagination) {
            this.pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
        }
        this.request = {
            page: 1,
            perPage: this._search.method == "post" ? this.clientSettings.listRowsPerpage : 100
        }

        const headerPromises = this.headers.filter(x=> (x.dictionary || x.dictionaryPromise) && !x.items).map(x=>{
            return new Promise((resolve) => {
                if(x.dictionary) {
                    this.cacheService.List(x.dictionary)
                    .then(z=> {
                        x.items = z;
                        resolve();
                    });
                } else if (x.dictionaryPromise) {
                    x.dictionaryPromise
                    .then(z=> {
                        x.items = z;
                        resolve();
                    });
                }
            });
        });

        const filterPromises = this.tableFilters.filter(x => !x.selectItems && (x.selectItemsFromDictionary || x.selectItemsFromPromise)).map(x => {
            return new Promise((resolve) => {
                if(x.selectItemsFromDictionary) {
                    this.cacheService.ListAsSelectItems(x.selectItemsFromDictionary)
                    .then(z => {
                        x.selectItems = z;
                        resolve();
                    })
                } else if (x.selectItemsFromPromise) {
                    x.selectItemsFromPromise
                    .then(z => {
                        x.selectItems = z;
                        resolve();
                    })
                }
            }) 
        });

        await Promise.all([headerPromises, filterPromises]);

        await this.load();
        this.tableVisible = true;
    };

    @Watch('pagination.page')
    PageChanged(newVal, oldVal) {
        if(newVal!==oldVal) {
            this.request.page = newVal;
            this.load();
        }
    }

    @Watch('toggledItemSlot')
    onChange() {
        if(this.headers.filter(x => x.custom).length > 0) {
            if(this.toggledItemSlot) {
                this.items.forEach(item => {
                    if(item.indexForSlot == this.toggledItemSlot.indexForSlot) {
                        item.toggleForSlot = this.toggledItemSlot.toggleForSlot;
                    }
                })
            }
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
            this.loading = true;
            let entity = (await this.operationService.get(`${this._getUrl}/${item.id}`)).ensureSuccess();
            this.mapModelToFields(entity);
            this.editDialog = true;
        } catch (e) {
            this.editDialog = false;
        }

        this.loading = false;
    };
    async editOk() {
        this.itemIsSaving = true;
        try {
            
            let model = this.getModelFromFields();
            let operation = +model.id > 0 
            ? (this.operationService.put(`${this._updateUrl}/${+model.id}`, model))
            : (this.operationService.post(`${this._addUrl}`, model));
            (await operation).ensureSuccess();
            this.notificationProvider.Success("Успешно сохранено");
            this.editDialog = false;
            this.load();
        } catch (e) {
            this.editDialog = true;
            this.notificationProvider.Error(e);
        }
        this.itemIsSaving = false;
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
        if (!this.itemForRemove) {
            this.notificationProvider.Error('Удаляемый объект не существует')
            return;
        }
        try {
            (await this.operationService.delete(`${this._deleteUrl}/${this.itemForRemove.id}`)).ensureSuccess();
            this.notificationProvider.Success("Удалено");
            this.load();
        } catch (e) {
            this.notificationProvider.Error(e);
        }
        
        this.removeDialog = false;
        this.itemForRemove = null;
    };

    async removeSelectedOk() {
        if (!this.itemsForRemove) {
            this.notificationProvider.Error('Удаляемые объекты не существуют')
            return;
        }
        try {
            (await this.operationService.delete(`${this._bulkDeleteUrl}`, this.itemsForRemove)).ensureSuccess();
            this.notificationProvider.Success("Удалено");
            this.load();
        } catch (e) {
            this.notificationProvider.Error(e);
        }

        this.removeSelectedDialog = false;
        this.itemsForRemove = null;
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
                let response = (await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`,this.AddFilter(this.request))).ensureSuccess();
                this.items =  response.data;
                this.pagination.totalItems = response.total;
                if(this.headers.filter(x => x.custom).length > 0) {
                    let index = 0;
                    this.items.forEach(item => {
                        item['toggleForSlot'] = false;
                        item['indexForSlot'] = index;
                        index++;
                    })
                }          
            } else {
                let response = (await this.operationService.get<any[]>(`${this._search.url}`)).ensureSuccess();
                this.items = response;
                this.pagination.totalItems = this.items.length;
            }
        } catch(e) {
            this.notificationProvider.Error(e);
        } 
        this.loading = false;
    }
}