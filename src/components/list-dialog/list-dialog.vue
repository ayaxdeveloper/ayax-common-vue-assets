<template>
    <v-card style="width:100%" tile flat>
        <slot name="table-head">
            <v-toolbar flat dense dark class="secondary">
            <v-toolbar-title v-if="title">
                {{title}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <slot name="head-items"></slot>
                <v-btn flat @click.native.stop="add">
                    <v-icon left>mdi-plus</v-icon>
                    Добавить
                </v-btn>
            </v-toolbar-items>  
        </v-toolbar>
        </slot>
        <a-table 
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
                <v-dialog v-model="editDialog" persistent max-width="600px">
                    <v-card>
                    <!-- <v-card-title>
                            <slot name="edit-head"></slot>
                    </v-card-title> -->
                    <v-card-text>
                        <a-form :fields="fields" :model="defaultModel"></a-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color=" lighten-2" flat @click.native="editOk">ОК</v-btn>
                        <v-btn color="lighten-2" flat @click.native.stop="editCancel">Отмена</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
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
    </v-card>
</template>

<script lang="ts" src="./list-dialog.ts">
    
</script>