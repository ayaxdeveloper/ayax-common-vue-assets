<template>
    <div>
        <a-list-dialog
        entity="testentity"
        title="Test List-Dialog Component"
        :headers="headers"
        :pagination="pagination"
        :actions="actions"
        :default-model="defaultModel"
<<<<<<< HEAD
        :fields="fields"
        :configure="true"
        :tableFilters="tableFilters"/>
=======
        :fields="fields">
        <template slot="toolbar-items">
            <v-btn icon>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
        </template>
        </a-list-dialog>
>>>>>>> 2ef0d81adf9f69545142367978d0478077a34298
    </div>
</template>

<script lang="ts" src="./list-dialog-test.ts">
</script>

<style>

</style>