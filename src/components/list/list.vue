<template>
    <div>
        <div style="position:relative">
        </div>
        <a-table 
        :title="title"
        :headers="headers" 
        :pagination="pagination" 
        :selectable="selectable"
        :selectable-single="selectableSingle"
        :items="items"
        :loading="loading"
        :actions="actions"
        :entity="entity"
        :topbar-color="topbarColor"
        :actionbar-color="actionbarColor"
        :topbarIsDark="topbarIsDark"
        :actionbarIsDark="actionbarIsDark"
        @on-row-action="onRowAction"
        @on-bar-action="onBarAction"
        @apply-filter="load"
        :configure="configure"
        ></a-table>
        
        <v-layout row justify-center>
            <v-dialog v-model="removeDialog" max-width="600px">
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
            <v-dialog v-model="removeSelectedDialog" max-width="600px">
                    <v-card>
                        <v-card-title class="headline">Удаление записей</v-card-title>
                        <v-card-text>Удалить выбранные записи?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="darken-1" flat @click.native="removeSelectedOk()">Да</v-btn>
                            <v-btn color="darken-1" flat @click.native="removeCancel()">Нет</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
        </v-layout>
        
    </div>
</template>

<script lang="ts" src='./list.ts'>
</script>