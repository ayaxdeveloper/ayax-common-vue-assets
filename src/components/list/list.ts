import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { Pagination, IClientSettings, INotificationProvider, IPagination, IEntity, Dictionary, SearchResponse } from 'ayax-common-types';
import { IHttpService, OperationService, IOperationService } from 'ayax-common-services';
import { TableComponentHeader } from '../table/table-header';
import { FastFilterComponentItem } from '../fast-filter/fast-filter-item';
import { TableComponentAction } from '../table/table-action';
import { Route } from 'vue-router';
import { ICacheService } from 'ayax-common-cache';

@Component
export default class ListComponent extends Vue {
    @Inject() httpService: IHttpService;
    @Inject() notificationProvider: INotificationProvider;
    @Inject() cacheService: ICacheService;
    @Inject() clientSettings: IClientSettings;
    @Inject() operationService: IOperationService;
    @Prop() search: {url: string, method: string};
    @Prop() deleteUrl: string;
    @Prop() headers: TableComponentHeader[];
    @Prop() entity: string;
    @Prop() title: string;
    @Prop({required: true}) pagination: IPagination;
    @Prop() fastFilters: FastFilterComponentItem[];
    @Prop() actions: TableComponentAction[];
    @Prop() addRoute: Route;
    @Prop() editRoute: Route;
    @Prop() showRoute: Route;
    @Prop({ default: true}) selectable: boolean; 
    @Prop({ default: false}) selectableSingle: boolean; 
    @Prop({default: 'secondary'}) topbarColor: string;
    @Prop({default: 'primary'}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    
    @Watch('pagination.page')
    PageChanged(newVal, oldVal) {
        if(newVal!==oldVal) {
            this.request.page = newVal;
            this.load();
        }
    }

    localHeaders: TableComponentHeader[];

    request = {
        page: 1,
        perPage: this.clientSettings.listRowsPerpage
    };
    itemForRemove: IEntity | null;
    itemsForRemove: any[] | null;
    items: any[] = [];
    selected = [];
    removeDialog = false;
    removeSelectedDialog = false;
    loading = true;
    _search: {url: string, method: string};
    _deleteUrl: string;

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

    @Emit()
    onBarAction(items: any[], name: string) {
        switch(name) {
            case 'add':
            this.add();
            break;
            case 'removeSelected':
            this.removeSelected(items);
            break;
        }
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
        //console.log(`filteredRequest ${JSON.stringify(filteredRequest)}`);
        return filteredRequest; 
    }

    created() {
        if(this.entity && !this.search) {
            this._search = {url: `/${this.entity}/search`, method : 'post'};
        } else {
            this._search = this.search;
        }
        if(this.entity && !this.deleteUrl) {
            this._deleteUrl = `/${this.entity}/delete`;
        } else {
            this._deleteUrl = this.deleteUrl;
        }
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

    removeSelected(items) {
        if(items.length > 0) {
            this.itemsForRemove = items;
        }
        this.removeSelectedDialog = true;
    }

    removeOk() {
        if (!this.itemForRemove) {
            this.notificationProvider.Error('Удаляемый объект не существует');
            return;
        }
        this.operationService.delete(`${this._deleteUrl}/${this.itemForRemove.id}`).then((response) => {
            this.loading = true;
            let operation = response;
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

    async removeSelectedOk() {
        try {
            if (!this.itemsForRemove) {
                this.notificationProvider.Error('Удаляемые объекты не существуют')
                return;
            }
            let operation = (await this.operationService.post(`${this._deleteUrl}/bulkdelete`, this.itemsForRemove));
            if(operation.status == 0) {
                this.notificationProvider.Success("Объект удален");
                this.load();
            } else {
                this.notificationProvider.Error(`Ошибка удаления объекта: ${operation.message}`);
            }
            this.removeSelectedDialog = false;
            this.itemsForRemove = null;
        } catch(e) {
            this.notificationProvider.Error(`Ошибка удаления объекта: ${e}`);
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
            let response =  await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`, this.AddFilter(this.request));
            let operation = response;
            if(operation.status === 0) {
                this.items =  operation.result.data;
                this.pagination.totalItems = operation.result.total
            } else {
                this.notificationProvider.Error(operation.message);
            }
            this.loading = false;
        } catch(e) {
            this.notificationProvider.Error(e);
            this.loading = false;
        } 
    }
}