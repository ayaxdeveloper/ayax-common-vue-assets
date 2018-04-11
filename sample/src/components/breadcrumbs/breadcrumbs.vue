<template>
    <v-breadcrumbs divider="/" class="mt-0 pt-0">
        <v-breadcrumbs-item 
            v-for="item in items" :key="item.text"
            :disabled="item.disabled" 
            :replace="true" router
            @click.native="routeTo(item)"
            >
            {{item.text}}
        </v-breadcrumbs-item>
    </v-breadcrumbs>
</template>

<script lang="ts" src="./breadcrumbs.ts">
</script>