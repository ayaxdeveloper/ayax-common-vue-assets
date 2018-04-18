<template>
    <v-form row justify-center :value="valid" ref="form" lazy-validation>
        <v-card>
            <v-card-title>
                <span class="headline">{{title}} ({{ actionTitle }})</span>
            </v-card-title>
            <v-card-text>
                <a-form :fields="fields"></a-form>
            </v-card-text>
            <v-card-text>
                <slot></slot>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color=" lighten-2" flat @click.native="onOk">ОК</v-btn>
                <v-btn color="lighten-2" flat @click.native="onCancel">Отмена</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script lang="ts" src="./edit.ts">
    
</script>