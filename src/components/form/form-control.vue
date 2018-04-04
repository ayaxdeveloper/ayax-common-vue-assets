<template v-if="show">
    <input type='hidden' :name="field.name" :value="field.model" v-if="field.type == hidden">
    <v-text-field v-else-if="field.type == input"
    :name="field.name"
    :label="field.dense ? field.title : null"
    v-model="field.model"
    :mask="field.mask"
    :required="field.required"
    :disabled="field.disabled"
    :return-masked-value="field.returnMaskedValue"
    :hint="field.hint"
    :rules="field.rules"
    >
    </v-text-field>
    <v-text-field v-else-if="field.type == password"
    type="password"
    :name="field.name"
    :label="field.dense ? field.title : null"
    v-model="field.model"
    :mask="field.mask"
    :required="field.required"
    :disabled="field.disabled"
    :return-masked-value="field.returnMaskedValue"
    :hint="field.hint"
    :rules="field.rules"
    >
    </v-text-field>
    <div v-else-if="field.type == date">
        <v-menu
            class="datepicker-menu"
            lazy
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
        >
            <v-text-field
            slot="activator"
            :label="field.dense ? field.title : null"
            v-model="dateFormatted"
            return-masked-value
            @blur="field.model = parseDate(dateFormatted)"
            @input="field.model = parseDate(dateFormatted)"
            mask="##.##.####"
            :rules="field.rules"
            :disabled="field.disabled"
            ></v-text-field>
            <v-date-picker 
            v-model="field.model" 
            @input="dateFormatted = formatDate($event); menu = false"
            no-title
            locale="ru-ru" 
            
            actions>
            <template slot-scope="{ save, cancel }">
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="datePickerCancel(field.name)">Отмена</v-btn>
                <v-btn flat color="primary" @click="datePickerOk(field.name)">OK</v-btn>
                </v-card-actions>
            </template>
            </v-date-picker>
        </v-menu>
    </div>
    <v-select
    v-else-if="field.type == select"
    :name="field.name"
    :label="field.dense ? field.title : null"
    :items="field.items"
    v-model="field.model"
    :required="field.required"
    :disabled="field.disabled"
    :hint="field.hint"
    bottom
    autocomplete
    :rules="field.rules"
    clearable
    > 
    ></v-select>
    <v-checkbox
    v-else-if="field.type == checkbox"
    :label="field.dense ? field.title : null"
    :name="field.name"
    v-model="field.model"
    :required="field.required"
    :disabled="field.disabled"
    :hint="field.hint"
    :rules="field.rules"
    ></v-checkbox>
</template>

<script lang="ts" src="./form-control.ts">
</script>

<style>

</style>
