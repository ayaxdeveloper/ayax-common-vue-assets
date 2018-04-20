<template>
    <v-card>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-title>
                Test List Component
                <v-chip title="Количество записей" label small v-if="pagination.totalItems">{{ pagination.totalItems }}</v-chip>
            </v-toolbar-title>
        </v-toolbar>
        <a-list
                :headers="headers"
                entity='testentity'
                title="Test List Component"
                :selecteable="false"
                :pagination="pagination"
                :actions="actions">
        Ошибка загрузки List Component
        </a-list>
    </v-card>
</template>

<script lang="ts" src='./list-test.ts'></script>