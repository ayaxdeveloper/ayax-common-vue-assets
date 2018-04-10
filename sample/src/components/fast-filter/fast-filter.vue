<template>
    <div>
        <div v-for="fastfilter in fastfilters" :key="fastfilter.name" class="action mr-1">
            <template v-if="fastfilter.type==htmlElementTypes['select']">
                <span class="action__label ml-2" color="grey lighten-1">{{fastfilter.label}}:</span>
                <v-select 
                    class="action__select"
                    :title="fastfilter.hint"
                    v-bind:items="fastfilter.items"
                    v-model="filter[fastfilter.name]"
                    multiple
                    allow-overflow
                    single-line
                    clearable
                    solo
                    dense
                ></v-select>
            </template>
            <template v-if="fastfilter.type==htmlElementTypes['input']">
                <span class="action__label ml-2" color="grey lighten-1">{{fastfilter.label}}:</span>
                <v-text-field
                    :name="fastfilter.name"
                    :label="fastfilter.default"
                    v-model="filter[fastfilter.name]"
                    single-line
                    solo
                ></v-text-field>
            </template>
            <template v-if="fastfilter.type==htmlElementTypes['btn']">
                <v-btn flat @click.native="$emit(fastfilter.name)">{{fastfilter.label}}</v-btn>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .input-group.input-group--solo {
        background-color: transparent !important;
        box-shadow: none !important;
    }

    .input-group.input-group--solo .input-group__input {
        max-height: 48px !important;
    }

    .action__label {
        vertical-align: middle;
        line-height: 48px;
        color: #757575!important;
    }
    .action {
        display: inherit;
        background-color:rgba(119, 119, 119, 0.1)
    }
    .action > .input-group__input {
        max-height: 48px !important;
    }
</style>

<script lang="ts" src='./fast-filter.ts'>

</script>
