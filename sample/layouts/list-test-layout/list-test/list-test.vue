<template>
    <a-list
            :headers="headers"
            entity='testentity'
            title="Test List Component"
            :selecteable="false"
            :pagination="pagination"
            :actions="actions"
            :toggledItemSlot="toggledItemSlot"
            :configure="true"
            :tableFilters="tableFilters">
            <template slot="qq" slot-scope="{item}">
                <div>{{item.activeLead.qq}}</div>
                <template v-if="item.otherLeads.length > 0">
                    <v-flex class="mt-1 mb-1">
                    <div v-if="item.toggleForSlot" v-for="lead in item.otherLeads" :key="lead.name">
                        {{ lead.name }}
                    </div>
                    <div class="tableItemSlot" @click.stop="toggleLead(item)">
                        {{item.toggleForSlot ? 'Скрыть' : `Еще ${item.otherLeads.length} обращений`}}
                    </div>
                </v-flex>
                </template>
            </template>
            <template slot="ww" slot-scope="{item}">
                <div>{{item.activeLead.ww}}</div>
            </template>
    </a-list>
</template>

<script lang="ts" src='./list-test.ts'></script>

<style scoped>
    .tableItemSlot {
        display: inline;
        font-size: 12px;
        text-decoration: underline;
    }
    .tableItemSlot:hover {
        cursor: pointer;
    }
</style>