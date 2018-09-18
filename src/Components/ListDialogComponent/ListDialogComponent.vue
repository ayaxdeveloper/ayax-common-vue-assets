<template>
    <div>
        <v-layout v-if="!tableVisible" fill-height row justify-center>
            <v-progress-circular style="position: fixed; top: 40%" :size="150" :width="8" indeterminate color="primary"></v-progress-circular>
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
            :updateActionBar="updateActionBar"
            :rowColor="(item) => rowColor(item)"
            :topbar-color="topbarColor"
            :actionbar-color="actionbarColor"
            :topbarIsDark="topbarIsDark"
            :actionbarIsDark="actionbarIsDark"
            :max-height="maxHeight"
            :clear-selected="clearSelected"
            @on-row-action="onRowAction"
            @on-bar-action="onBarAction"
            @apply-filter="load"
            @change-pagination="changePagination"
            @relocate-actionbar="updateActionBar++"
            :configure="configure"
            :showHeaderFiltersByDefault="showHeaderFiltersByDefault"
            :tableFilters="tableFilters">
            <template slot="toolbar-items"><slot name="toolbar-items"></slot></template>
            <template v-for="header in headers.filter(x => x.custom)" :slot="header.value" slot-scope="{item}">
                <slot :name="header.value" :item="item"></slot>
            </template>
            </a-table>
            <v-layout row justify-center>
                <v-dialog v-model="editDialog" max-width="600px">
                    <v-card>
                    <!-- <v-card-title>
                            <slot name="edit-head"></slot>
                    </v-card-title> -->
                    <v-card-text v-shortkey.once="editModalShortkeys" @shortkey="editModelShortkeyHandler">
                        <a-form :fields="fields" :model="defaultModel" ></a-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color=" lighten-2" flat @click.native="editOk" :loading="itemIsSaving">ОК</v-btn>
                        <v-btn color="lighten-2" flat @click.native.stop="editCancel">Отмена</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
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
import { FormComponentItem } from "../FormComponent/FormItem";
import { TableComponentAction } from "../TableComponent/TableAction";
import { TableComponentHeader } from "../TableComponent/TableHeader";
import { TableFilterComponentItem } from "../TableFilterComponent/TableFilterComponentItem";

@Component({
    name: "a-list-dialog"
})
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
    @Prop({default: "secondary"}) topbarColor: string;
    @Prop({default: "primary"}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    @Prop({default: null}) toggledItemSlot;
    @Prop({default: () => () => "" }) rowColor: (item) => string;
    @Prop({default: 442}) maxHeight: number;
    @Prop({default: 0}) forceReload: number;
    clearSelected = 0;
    editDialog = false;
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
    tableVisible = false;
    tableIdentifier = `${this.title}_${this.entity}`.replace(/\s+/g, "_").replace("-", "_");
    updateActionBar = 0;

    itemIsSaving = false;

    editModalShortkeys = {
        save: ["enter"],
        close: ["esc"]
    };

    @Watch("forceReload")
    async onForce() {
        await this.load();
    }

    editModelShortkeyHandler(key : any) {
        if (!key || !key.srcKey) {
            return;
        }
        switch (key.srcKey) {
            case "save":
                this.editOk();
            break;

            case "close":
                this.editCancel();
            break;

            default:
            break;
        }
    }

    async created() {
        if (this.entity && !this.search) {
            this._search = {url: `/${this.entity}/search`, method : "post"};
        } else {
            this._search = this.search;
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
        if (this.entity && !this.getUrl) {
            this._getUrl = `/${this.entity}/get`;
        } else {
            this._getUrl = this.getUrl;
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
        this.request = {
            page: 1,
            perPage: this._search.method === "post" ? this.clientSettings.listRowsPerpage : 100
        };
        if (localStorage.getItem(`${this.tableIdentifier}_custom_pagination`)) {
            this.request.perPage = parseInt(localStorage.getItem(`${this.tableIdentifier}_custom_pagination`));
            this.pagination.perPage = parseInt(localStorage.getItem(`${this.tableIdentifier}_custom_pagination`));
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
            default:
            break;
        }
        return name;
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

    async changePagination(perPage: number) {
        if (perPage !== 0) {
            this.request.perPage = perPage;
            this.pagination.perPage = perPage;
        } else {
            this.request.perPage = this.clientSettings.listRowsPerpage;
            this.pagination.perPage = this.clientSettings.listRowsPerpage;
        }

        this.request.page = 1;
        this.pagination.page = 1;

        await this.load();
        this.updateActionBar++;
    }

    mapModelToFields(model: any) {
        this.fields.forEach(element => {
            element.model = null;
        });
        Object.keys(model).forEach(x => {
            const field = this.fields.find(f => f.name === x);
            if (field) {
                field.model = model[x];
            }
        });
    }

    getModelFromFields(): any {
        const model = {};
        this.fields.filter(x => x.name && x.model).forEach(x => {
            model[x.name] = x.model;
        });
        return model;
    }

    add() {
        this.mapModelToFields(this.defaultModel);
        this.editDialog = true;
    }

    async edit(item) {
        try {
            this.loading = true;
            const entity = (await this.operationService.get(`${this._getUrl}/${item.id}`)).ensureSuccess();
            this.mapModelToFields(entity);
            this.editDialog = true;
        } catch (e) {
            this.notificationProvider.Error(e);
            this.editDialog = false;
        }

        this.loading = false;
    }

    async editOk() {
        this.itemIsSaving = true;
        try {
            
            const model = this.getModelFromFields();
            const operation = +model.id > 0 ? (this.operationService.put(`${this._updateUrl}/${+model.id}`, model))
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
            this.notificationProvider.Success("Удалено");
            this.load();
        } catch (e) {
            this.notificationProvider.Error(e);
        }
        
        this.removeDialog = false;
        this.itemForRemove = null;
    }

    async removeSelectedOk() {
        if (!this.itemsForRemove) {
            this.notificationProvider.Error("Удаляемые объекты не существуют");
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
    }

    removeCancel() {
        this.itemForRemove = null;
        this.removeDialog = false;
        this.itemsForRemove = null;
        this.removeSelectedDialog = false;
    }

    public async load() {
        try {
            this.loading = true;
            this.clearSelected++;
            if (this._search.method === "post") {
                const response = (await this.operationService.post<SearchResponse<any[]>>(`${this._search.url}`,this.AddFilter(this.request))).ensureSuccess();
                this.items =  response.data;
                this.pagination.totalItems = response.total;
                if (this.headers.filter(x => x.custom).length > 0) {
                    let index = 0;
                    this.items.forEach(item => {
                        item["toggleForSlot"] = false;
                        item["indexForSlot"] = index;
                        index++;
                    });
                }          
            } else {
                const response = (await this.operationService.get<any[]>(`${this._search.url}`)).ensureSuccess();
                this.items = response;
                this.pagination.totalItems = this.items.length;
            }
        } catch (e) {
            this.notificationProvider.Error(e);
        } 
        this.loading = false;
        
        const tableScroll = document.querySelector(`#${this.tableIdentifier} .v-table__overflow`) as HTMLElement;
        if (tableScroll) {
            tableScroll.scrollTop = 0;
        }
    }
}
</script>