<template>
    <div>
        <a-list-dialog
        entity="testentity"
        title="Test List-Dialog Component"
        :headers="headers"
        :pagination="pagination"
        :actions="actions"
        :default-model="defaultModel"
        :fields="fields">
        </a-list-dialog>
    </div>
</template>

<script lang="ts" src="./list-dialog-test.ts">
</script>

<style>

</style>