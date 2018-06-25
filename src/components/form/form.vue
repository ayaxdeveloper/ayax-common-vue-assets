<template>
    <div v-if="formVisible">
        <v-layout row wrap 
        v-for="(row, rowIndex) in computedRows" :key="rowIndex" 
        :class="{hidden : rowIndex == 0 || row.length == 0}"
        >
            <v-flex v-for="(field, fieldIndex) in row" :key="fieldIndex" class="pa-1">
                <template v-if="field.dense">
                    <a-form-control
                    :field="field"></a-form-control>
                </template>
                <template v-else>
                    <v-flex xs4 v-if="!field.dense">
                        <v-subheader>{{field.title}}</v-subheader>
                    </v-flex>
                    <v-flex xs12>
                        <a-form-control
                        :field="field"></a-form-control>
                    </v-flex>
                </template>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts" src="./form.ts">
</script>

<style scoped>
    .hidden {
        display: none;
    }
</style>