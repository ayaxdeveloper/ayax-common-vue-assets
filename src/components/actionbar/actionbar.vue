<template>
    <div class="actionbar">
        <v-toolbar :dark="actionbarIsDark" :class="actionbarColor" dense>
            <v-toolbar-items class="hidden-sm-and-down">
                <template v-for="action in actions">
                    <v-btn v-if="!action.children" :key="action.name" 
                    :disabled="action.needSelectedItem && !itemSelected" flat @click="onBarAction(innerSelected, action.name)">
                        <v-icon left v-if="action.icon">{{action.icon}}</v-icon>
                        {{action.title}}
                    </v-btn>
                    <v-menu top offset-y :disabled="action.needSelectedItem && !itemSelected" v-if="action.children" :key="action.name">
                        <v-btn slot="activator" :key="action.name" 
                        :disabled="action.needSelectedItem && !itemSelected" flat>
                        <v-icon left v-if="action.icon">{{action.icon}}</v-icon>
                        {{action.title}}
                    </v-btn>
                    <v-list dense>
                        <v-list-tile v-for="children in action.children" :key="children.name"  @click="children.action">
                            <v-list-tile-action v-if="children.icon"><v-icon>{{children.icon}}</v-icon></v-list-tile-action>
                            <v-list-tile-title>{{children.title}}</v-list-tile-title>
                        </v-list-tile>
                        </v-list>
                    </v-menu>
                </template>
            </v-toolbar-items>
        </v-toolbar>
        <resize-observer v-if="actions" @notify="actionbarSize"></resize-observer>
    </div>
</template>

<script lang="ts" src="./actionbar.ts">
</script>

<style scoped>
    .actionbarFixed {
        position: fixed;
        bottom: 0;
    }
</style>

