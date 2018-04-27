<template>
    <div class="tableContainer mb-4" style="position: relative">
        <slot name="table-head">
            <v-toolbar flat dense :dark="topbarIsDark" :class="topbarColor" style="line-height: 48px">
            <v-toolbar-title v-if="title">
                {{title}}
                <v-chip title="Количество записей" label small v-if="pagination.totalItems">{{ pagination.totalItems }}</v-chip>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <slot name="head-items"></slot>
                <v-menu bottom offset-y left offset-x :close-on-content-click="false" :value="isTableMenuVisible">
                    <v-btn flat style="height: 30px; width: 30px" small icon title="Настройки таблицы" slot="activator" @click="isTableMenuVisible=true">
                        <v-icon>settings</v-icon>
                    </v-btn>
                    <v-list dense>
                        <v-list-tile v-if="FiltersExist" @click="toggleFilters">
                            <v-list-tile-title>{{ showFiltersMessage }}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <draggable :list="editableHeaders" @update="onUpdateDraggable">
                            <v-list-tile v-for="header in editableHeaders" :key="header.text" @click="">
                                <v-list-tile-action>
                                    <v-checkbox v-if="header.hiddenable" v-model="header.isVisible" @change="onChangeVisible(header)"></v-checkbox>
                                    <v-checkbox v-else input-value="true" disabled></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-title>{{ header.text }}</v-list-tile-title>
                            </v-list-tile>
                        </draggable>
                        <v-divider></v-divider>
                            <v-list-tile @click="resetTableSettings">
                            <v-list-tile-title>Сбросить настройки таблицы</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>  
        </v-toolbar>
        </slot>
        <v-progress-circular v-if="loading" indeterminate fixed class="table-loading" color="primary" size="50"></v-progress-circular>
        <v-data-table
        v-bind:headers="editableHeaders"
        v-bind:items="items"
        :total-items="totalItems"
        :loading="loading"
        select-all
        no-data-text="Нет данных"
        v-model="innerSelected"
        hide-actions
        item-key="id"
        no-results-text="Ничего не найдено"
        class="elevation-1 table-block tableAnchor">
            <template slot="headers" slot-scope="props">
                <tr class="header-row">
                    <th v-if='selectable' class="selectable" :width="configSelectableWidth">
                        <v-checkbox v-if="!selectableSingle" 
                                primary
                                hide-details
                                @click.native="toggleAll"
                                :input-value="props.all"
                                :indeterminate="props.indeterminate"
                        ></v-checkbox>
                    </th>
                    <th class="text-xs-center action" v-if="actions" :width="configActionsWidth">
                        ...
                    </th>
                    <th v-for="header in editableHeaders"
                        v-if="header.isVisible" 
                        :key="header.value"
                        :class="[
                            'column', header.sortable ? 'sortable' : '', header.sortBy && header.sortBy.isdesc ? 'desc' : 'asc', 
                            header.sortBy ? 'active' : '',
                            header.align == 'right' ? 'text-xs-right' : 'text-xs-left'
                            ]"
                        :width="header.width"
                        @click="header.sortable && changeSort(header.value)"
                    >
                        <v-icon v-if="header.sortable">mdi-arrow-up</v-icon>
                        <strong>{{ header.text }}</strong>
                    </th>
                </tr>
                <tr v-if="FiltersExist && showFilters" class="filter-row">
                    <th v-if='selectable' class="selectable"></th>
                    <th v-if="actions" class="action">
                    </th>
                    <th v-for="header in editableHeaders"
                        v-if="header.isVisible" 
                        :key="header.value"
                        class="column"
                    >
                        <template v-if="header.filter">
                            <a-table-filter
                            @apply-filter="applyFilter"
                            :header = "header"
                            ></a-table-filter>
                        </template>
                    </th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :active="props.selected">
                    <td v-if='selectable' class="selectable" @click="selectClick(props)">
                        <v-checkbox
                                primary
                                hide-details
                                :input-value="props.selected"
                        ></v-checkbox>
                    </td>
                    <td class="text-xs-right action" v-if="actions">
                        <div class="text-xs-center">
                            <v-menu :disabled="itemSelected" offset-x>
                                <v-btn 
                                color="primary" 
                                :disabled="itemSelected"
                                dark 
                                flat
                                slot="activator"
                                small
                                fab
                                :ripple="false"
                                >
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                                <v-list
                                dark
                                dense>
                                    <v-list-tile 
                                    v-for="action in actions" 
                                    :key="action.name"
                                    v-if="action.single"
                                    @click="onRowAction(props.item, action.name)">
                                        <v-list-tile-action
                                        v-if="action.icon">
                                            <v-icon>{{action.icon}}</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-title 
                                        v-if="action.title && !action.onlyIcon"
                                        >{{ action.title }}</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </div>
                    </td>
                    <td
                        v-for="(header, index) in editableHeaders" :key="index"
                        v-if="header.isVisible" 
                        :class="[
                            header.align == 'right' ? 'text-xs-right' : 'text-xs-left'
                        , 'column']"
                        @click="selectClick(props)"
                        v-on:dblclick="firstAction(props.item)"
                    >
                        <template 
                                v-for="propertyname in Object.keys(props.item)" 
                                v-if="propertyname == editableHeaders[index].value"
                        >
                            <template v-if="editableHeaders[index].items"
                            >{{getFromDictionary(editableHeaders[index], props.item[propertyname])}}</template>
                            <template v-else>
                                {{applyFormatterIfExists(header, props.item[propertyname])}}                            
                            </template>
                        </template>
                    </td>
                </tr>   
            </template>
        </v-data-table>
        <div class="actionbarAnchor"></div>
        <div v-if="actions" class="actionbar">
            <v-toolbar :dark="actionbarIsDark" :class="actionbarColor" dense>
                <v-toolbar-items class="hidden-sm-and-down">
                    <template v-for="action in actions" v-if="!action.single">
                        <v-btn v-if="!action.children" :key="action.name" 
                        :disabled="action.needSelectedItem && !itemSelected" flat @click="onBarAction(innerSelected, action.name)">
                            <v-icon left v-if="action.icon">{{action.icon}}</v-icon>
                            {{action.title}}
                        </v-btn>
                        <v-menu top offset-y :disabled="action.needSelectedItem && !itemSelected" v-if="action.children" :key="action.name">
                            <v-btn slot="activator" :key="action.name" 
                            :disabled="action.needSelectedItem && !itemSelected" flat>
                            <v-icon left v-if="action.icon">{{action.icon}}</v-icon>
                            {{action.title}}
                        </v-btn>
                        <v-list dense>
                            <v-list-tile v-for="children in action.children" :key="children.name"  @click="children.action">
                                <v-list-tile-action v-if="children.icon"><v-icon>{{children.icon}}</v-icon></v-list-tile-action>
                                <v-list-tile-title>{{children.title}}</v-list-tile-title>
                            </v-list-tile>
                         </v-list>
                        </v-menu>
                    </template>
                </v-toolbar-items>
            </v-toolbar>
        </div>
        <div class="text-xs-center pt-2">
            <v-pagination v-if="pagination" total-visible="10" v-model="pagination.page" :length="GetTotalPages"></v-pagination>
        </div>
        <div :class="{'loading-fade':loading}"></div>
        <resize-observer v-if="actions" @notify="actionbarSize"></resize-observer>
    </div>
</template>

<script lang="ts" src='./table.ts'>
    
</script>

<style>
    .filter-row {
        border-bottom: 1px solid rgba(0,0,0,.12) !important;
        height: 32px !important;
    }
    .header-row {
        border-bottom: none !important;
        height: 32px !important;
    }
    
</style>

<style scoped>
    .table-block >>> tbody tr {
        line-height: 12px !important;
        height: 32px !important;
    }
    .sort-apply-btn {
        position: absolute;
        top: -24px;
        height: 20px !important;
    }
    .table-block >>> th.column, .table-block >>> td.column {
        padding: 0 8px !important;
        line-height: 12px;
    }
    th.header, td.header {
        padding: 0 8px !important;
    }
    .table-block >>> th.action, td.action {
        padding: 0 !important;
    }
    .table-block >>> td.action > .btn {
        height: 16px !important;
        width: 16px !important;
        margin: 4px 8px !important;
    }
    .table-block >>> th.selectable, td.selectable {
        padding: 0 8px !important;
    }
    .table-block >>> tbody td.selectable {
        padding: 0 8px !important;
    }
    .sortable i {
        float: right;
    }
    .table-block >>> tbody td {
        height: 32px !important;
    }
    .table-loading {
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .loading-fade {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.1);
    }
    .actionbarFixed {
       position: fixed;
       bottom: 0;
    }
</style>