<template>
    <div>
        <v-layout v-if="!tableVisible" fill-height row justify-center>
            <v-progress-circular style="position: absolute; top: 40%" :size="150" :width="8" indeterminate color="primary"></v-progress-circular>
        </v-layout>
        <a-table v-else
        :title="title"
        :headers="headers" 
        :pagination="pagination" 
        :selectable="selectable"
        :selectable-single="selectableSingle"
        :items="items"
        :loading="loading"
        :actions="actions"
        :entity="entity"
        :rowColor="(item) => rowColor(item)"
        :topbar-color="topbarColor"
        :actionbar-color="actionbarColor"
        :topbarIsDark="topbarIsDark"
        :actionbarIsDark="actionbarIsDark"
        @on-row-action="onRowAction"
        @on-bar-action="onBarAction"
        @apply-filter="load"
        :configure="configure"
        :showHeaderFiltersByDefault="showHeaderFiltersByDefault"
        :tableFilters="tableFilters">
        <template slot="toolbar-items"><slot name="toolbar-items"></slot></template>
        <template v-for="header in headers.filter(x => x.custom)" :slot="header.value" slot-scope="{item}">
            <slot :name="header.value" :item="item"></slot>
        </template>
        </a-table>
        <v-layout row justify-center>
            <v-dialog v-model="removeDialog" max-width="600px">
                <v-card>
                    <v-card-title class="headline">Удаление записи</v-card-title>
                    <v-card-text>Удалить текущую запись?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" flat @click.native="removeOk()">Да</v-btn>
                        <v-btn color="darken-1" flat @click.native="removeCancel()">Нет</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="removeSelectedDialog" max-width="600px">
                    <v-card>
                        <v-card-title class="headline">Удаление записей</v-card-title>
                        <v-card-text>Удалить выбранные записи?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="darken-1" flat @click.native="removeSelectedOk()">Да</v-btn>
                            <v-btn color="darken-1" flat @click.native="removeCancel()">Нет</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
        </v-layout>
        
    </div>
</template>

<script lang="ts">
import { ICacheService } from "ayax-common-cache";
import { IOperationService } from "ayax-common-operation";
import { IClientSettings, IEntity, INotificationProvider, IPagination, Pagination, SearchResponse } from "ayax-common-types";
import { Component, Emit, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { TableComponentAction } from "../TableComponent/TableAction";
import { TableComponentHeader } from "../TableComponent/TableHeader";
import { TableFilterComponentItem } from "../TableFilterComponent/TableFilterComponentItem";

@Component
export default class ListComponent extends Vue {
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
    @Prop({default: "secondary"}) topbarColor: string;
    @Prop({default: "primary"}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    @Prop({default: null}) toggledItemSlot;
    @Prop({default: () => () => "" }) rowColor: (item) => string;
    tableVisible = false;
    
    @Watch("pagination.page")
    PageChanged(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.request.page = newVal;
            this.load();
        }
    }

    @Watch("toggledItemSlot")
    onChange() {
        if (this.headers.filter(x => x.custom).length > 0) {
            if (this.toggledItemSlot) {
                this.items.forEach(item => {
                    if (item.indexForSlot === this.toggledItemSlot.indexForSlot) {
                        item.toggleForSlot = this.toggledItemSlot.toggleForSlot;
                    }
                });
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
        
        const tableAction = this.actions.find(x => x.name === name);
        if (tableAction && tableAction.action) {
            tableAction.action(item);
            return name;
        }

        if (!item) {
            return false;
        }

        switch (name) {
            case "edit": 
            this.edit(item);
            break;
            case "remove":
            this.remove(item);
            break;
            case "show":
            this.show(item);
            break;
            default:
            break;
        }

        return true;
    }

    @Emit()
    onBarAction(items: any[], name: string) {
        const tableAction = this.actions.find(x => x.name === name);

        if (tableAction && tableAction.action) {
            tableAction.action(items);
            return name;
        }

        switch (name) {
            case "add":
            this.add();
            break;
            case "removeSelected":
            this.removeSelected(items);
            break;
            default:
            break;
        }

        return name;
    }

    private AddFilter(request) {
        const filteredRequest = {...request};
        this.tableFilters.filter(x => x.values.length > 0)
        .forEach((filter) => {           
            const filters = filter.FormRequestFilters();
            if (filters) {
                filteredRequest[filter.requestName] = filters;
            }
        });

        this.headers.filter(x => x.sortBy).forEach((header) => {
            filteredRequest[`${header.value}sort`] = header.sortBy;
        });

        return filteredRequest; 
    }

    async created() {
        if (this.entity && !this.search) {
            this._search = {url: `/${this.entity}/search`, method : "post"};
        } else {
            this._search = this.search;
        }
        if (this.entity && !this.deleteUrl) {
            this._deleteUrl = `/${this.entity}/delete`;
        } else {
            this._deleteUrl = this.deleteUrl;
        }
        if (this.entity && !this.bulkDeleteUrl) {
            this._bulkDeleteUrl = `/${this.entity}/bulkdelete`;
        } else {
            this._bulkDeleteUrl = this.bulkDeleteUrl;
        }

        if (!this.pagination) {
            this.pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
        }

        const headerPromises = this.headers.filter(x => (x.dictionary || x.dictionaryPromise) && !x.items).map(x => {
            return new Promise((resolve) => {
                if (x.dictionary) {
                    this.cacheService.List(x.dictionary)
                    .then(z => {
                        x.items = z;
                        resolve();
                    });
                } else if (x.dictionaryPromise) {
                    x.dictionaryPromise
                    .then(z => {
                        x.items = z;
                        resolve();
                    });
                }
            });
        });

        const filterPromises = this.tableFilters.filter(x => !x.selectItems && (x.selectItemsFromDictionary || x.selectItemsFromPromise)).map(x => {
            return new Promise((resolve) => {
                if (x.selectItemsFromDictionary) {
                    this.cacheService.ListAsSelectItems(x.selectItemsFromDictionary)
                    .then(z => {
                        x.selectItems = z;
                        resolve();
                    });
                } else if (x.selectItemsFromPromise) {
                    x.selectItemsFromPromise
                    .then(z => {
                        x.selectItems = z;
                        resolve();
                    });
                }
            });
        });

        await Promise.all([headerPromises, filterPromises]);

        await this.load();
        this.tableVisible = true;
    }

    add() {
        if (this.addRoute) {
            this.$router.push(this.addRoute);
        } else {
            this.$router.push({ name: `${this.entity}-edit`, params: { id: "0"}});
        }
    }
    edit(item) {
        if (this.editRoute) {
            this.editRoute.params.id = item.id;
            this.$router.push(this.editRoute);
        } else {
            this.$router.push({ name: `${this.entity}-edit`, params: { id: item.id } });
        }
    }
    show(item) {
        if (this.showRoute) {
            this.showRoute.params.id = item.id;
            this.$router.push(this.showRoute);
        } else {
            this.$router.push({ name: `${this.entity}-show`, params: { id: item.id } });
        }
        
        
    }

    remove(item) {
        this.itemForRemove = item;
        this.removeDialog = true;
    }

    removeSelected(items) {
        if (items.length > 0) {
            this.itemsForRemove = items;
        }
        this.removeSelectedDialog = true;
    }

    async removeOk() {
        if (!this.itemForRemove) {
            this.notificationProvider.Error("Удаляемый объект не существует");
            return;
        }
        try {
            (await this.operationService.delete(`${this._deleteUrl}/${this.itemForRemove.id}`)).ensureSuccess();
            this.notificationProvider.Success("Объект удален");
            this.load();
        } catch (e) {
            this.notificationProvider.Error(e);
        }
        this.loading = false;
        this.itemForRemove = null;
        this.removeDialog = false;
    }

    async removeSelectedOk() {
        try {
            if (!this.itemsForRemove) {
                this.notificationProvider.Error("Удаляемые объекты не существуют");
                return;
            }
            (await this.operationService.delete(`${this._bulkDeleteUrl}`, this.itemsForRemove)).ensureSuccess();
            this.notificationProvider.Success("Объект удален");
            this.load();            
        } catch (e) {
            this.notificationProvider.Error(e);
        }

        this.removeSelectedDialog = false;
            this.itemsForRemove = null;
    }

    removeCancel() {
        this.itemForRemove = null;
        this.removeDialog = false;
        this.itemsForRemove = null;
        this.removeSelectedDialog = false;
    }

    public async load() {
        try {
            const response =  (await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`, this.AddFilter(this.request))).ensureSuccess();
            this.items = response.data;
            this.pagination.totalItems = response.total;
            if (this.headers.filter(x => x.custom).length > 0) {
                let index = 0;
                this.items.forEach(item => {
                    item["toggleForSlot"] = false;
                    item["indexForSlot"] = index;
                    index++;
                });
            }
        } catch (e) {
            this.notificationProvider.Error(e);
        } 
        this.loading = false;
    }
}
</script>