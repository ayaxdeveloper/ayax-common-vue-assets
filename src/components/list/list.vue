<template>
    <div>
        <div style="position:relative">
        </div>
        <a-table 
        :title="title"
        :headers="headers" 
        :pagination="pagination" 
        :selectable = "true"
        :selectable-single = "true"
        :items="items"
        :loading="loading"
        :actions="actions"
        @on-row-action="onRowAction"
        @apply-filter="load"
        ></a-table>
        
        <v-layout row justify-center>
            <v-dialog v-model="removeDialog" persistent>
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
        </v-layout>
        
    </div>
</template>

<script lang="ts" src='./list.ts'>
</script>