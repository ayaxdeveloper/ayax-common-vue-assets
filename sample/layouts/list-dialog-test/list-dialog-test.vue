<template>
    <div>
        <a-list-dialog
        entity="testentity"
        title="Test List-Dialog Component"
        :headers="headers"
        :pagination="pagination"
        :actions="actions"
        :default-model="defaultModel"
        :fields="fields"
        :configure="true"
        :tableFilters="tableFilters">
        <template slot="toolbar-items">
            <v-btn icon>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
        </template>
        </a-list-dialog>
    </div>
</template>

<script lang="ts" src="./list-dialog-test.ts">
</script>

<style>

</style>