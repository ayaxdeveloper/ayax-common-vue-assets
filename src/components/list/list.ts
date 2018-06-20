import { Component, Vue, Prop, Inject, Watch, Emit } from 'vue-property-decorator';
import { Pagination, IClientSettings, INotificationProvider, IPagination, IEntity, Dictionary, SearchResponse } from 'ayax-common-types';
import { IHttpService, OperationService, IOperationService } from 'ayax-common-services';
import { TableComponentHeader } from '../table/table-header';
import { TableFilterComponentItem } from '../table-filter/table-filter-item';
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
    @Prop() bulkDeleteUrl: string;
    @Prop() headers: TableComponentHeader[];
    @Prop({default: () => []}) tableFilters: TableFilterComponentItem[];
    @Prop() entity: string;
    @Prop() title: string;
    @Prop({required: true}) pagination: IPagination;
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
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    @Prop({default: null}) toggledItemSlot;
    tableVisible = false;
    
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
    _bulkDeleteUrl: string;

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
            case "show":
            this.show(item);
            break;
        }
        return true;
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
        //console.log(`filteredRequest ${JSON.stringify(filteredRequest)}`);
        return filteredRequest; 
    }

    async created() {
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
        if(this.entity && !this.bulkDeleteUrl) {
            this._bulkDeleteUrl = `/${this.entity}/bulkdelete`;
        } else {
            this._bulkDeleteUrl = this.bulkDeleteUrl;
        }
        if(!this.pagination) {
            this.pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
        }
        await Promise.all(this.headers.filter(x=>x.dictionary && (!x.items || x.items.length == 0)).map(x=>{
            return new Promise((resolve) => {
                this.cacheService.List(x.dictionary)
                .then(z=> {
                    x.items = z;
                    resolve();
                });
            });
        }));

        await Promise.all(this.headers.filter(x=>x.dictionaryPromise && (!x.items || x.items.length == 0)).map(x=>{
            return new Promise((resolve) => {
                x.dictionaryPromise
                .then(z=> {
                    x.items = z;
                    resolve();
                });
            });
        }));

        await Promise.all(this.tableFilters.filter(x => x.selectItemsFromDictionary && (!x.selectItems || x.selectItems.length == 0)).map(x => {
            return new Promise((resolve) => {
                this.cacheService.ListAsSelectItems(x.selectItemsFromDictionary)
                .then(z => {
                    x.selectItems = z;
                    resolve();
                })
            }) 
        }));

        await Promise.all(this.tableFilters.filter(x => x.selectItemsFromPromise && (!x.selectItems || x.selectItems.length == 0)).map(x => {
            return new Promise((resolve) => {
                x.selectItemsFromPromise
                .then(z => {
                    x.selectItems = z;
                    resolve();
                })
            }) 
        }));

        await this.load();
        this.tableVisible = true;
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
            let operation = (await this.operationService.post(`${this._bulkDeleteUrl}`, this.itemsForRemove));
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
                this.items = operation.result.data;
                this.pagination.totalItems = operation.result.total

                if(this.headers.filter(x => x.custom).length > 0) {
                    let index = 0;
                    this.items.forEach(item => {
                        item['toggleForSlot'] = false;
                        item['indexForSlot'] = index;
                        index++;
                    })
                }
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