<template>
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
    :hide-details="!field.hint"
    :rules="field.rules"
    >
    </v-text-field>
    <v-text-field v-else-if="field.type == textarea"
    :name="field.name"
    :label="field.dense ? field.title : null"
    v-model="field.model"
    :mask="field.mask"
    :required="field.required"
    multi-line
    :disabled="field.disabled"
    :return-masked-value="field.returnMaskedValue"
    :hint="field.hint"
    :hide-details="!field.hint"
    :rules="field.rules"/>
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
    <div v-else-if="field.type == date" style="display: inline-grid; width: 100%"> 
        <label class="label">{{field.dense ? field.title : null}}</label>
        <el-date-picker
        v-model="field.model"
        format="dd.MM.yyyy"
        :disabled="field.disabled"
        size="small"
        clearable
        :picker-options="{firstDayOfWeek: 1}"
        />
    </div>
    <v-autocomplete
    v-else-if="field.type == select"
    :name="field.name"
    :label="field.dense ? field.title : null"
    :items="field.items"
    v-model="field.model"
    :required="field.required"
    :disabled="field.disabled"
    :hint="field.hint"
    bottom
    :hide-details="!field.hint"
    clearable
    :rules="field.rules"
    > 
    ></v-autocomplete>
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

<style scoped>
.label {
    display: inline-block;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    max-width: 90%;
    min-width: 0;
    overflow: hidden;
    pointer-events: none;
    text-align: left;
    text-overflow: ellipsis;
    -webkit-transform-origin: top left;
    transform-origin: top left;
    transition: .4s cubic-bezier(.25,.8,.25,1);
    white-space: nowrap;
    width: 100%;
    z-index: 0;
    color: rgba(0,0,0,.54);
}
.el-date-editor {
    width: 100%;
}
</style>
