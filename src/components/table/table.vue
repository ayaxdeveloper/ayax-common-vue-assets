<template>
    <div>
        <v-progress-circular v-if="loading" indeterminate fixed class="table-loading" color="primary" size="50"></v-progress-circular>
        <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        :total-items="totalItems"
        :loading="loading"
        select-all
        no-data-text="Нет данных"
        v-model="innerSelected"
        hide-actions
        item-key="id"
        class="elevation-1 table-block">
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
                    <th v-for="header in props.headers"
                        v-if="!header.hidden" 
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
                <tr v-if="FiltersExist" class="filter-row">
                    <th v-if='selectable' class="selectable"></th>
                    <th v-if="actions" class="action">
                    </th>
                    <th v-for="header in props.headers"
                        v-if="!header.hidden" 
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
                            <v-menu offset-x>
                                <v-btn 
                                color="primary" 
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
                        v-for="(header, index) in headers" :key="index"
                        v-if="!header.hidden" 
                        :class="[
                            header.align == 'right' ? 'text-xs-right' : 'text-xs-left'
                        , 'column']"
                        @click="selectClick(props)"
                        v-on:dblclick="firstAction(props.item)"
                    >
                        <template 
                                v-for="propertyname in Object.keys(props.item)" 
                                v-if="propertyname == headers[index].value"
                        >
                            <template v-if="headers[index].items"
                            >{{getFromDictionary(headers[index], props.item[propertyname])}}</template>
                            <template v-else>
                                {{applyFormatterIfExists(header, props.item[propertyname])}}                            
                            </template>
                            
                        </template>
                    </td>
                    
                </tr>   
            </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
            <v-pagination v-if="pagination" total-visible="10" v-model="pagination.page" :length="GetTotalPages"></v-pagination>
        </div>
        <div v-if="loading" class="loading-fade"></div>
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
</style>