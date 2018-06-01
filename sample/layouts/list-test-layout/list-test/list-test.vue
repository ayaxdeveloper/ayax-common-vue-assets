<template>
    <a-list
            :headers="headers"
            entity='testentity'
            title="Test List Component"
            :selecteable="false"
            :pagination="pagination"
            :actions="actions"
            :tableFilters="tableFilters">
    </a-list>
</template>

<script lang="ts" src='./list-test.ts'></script>