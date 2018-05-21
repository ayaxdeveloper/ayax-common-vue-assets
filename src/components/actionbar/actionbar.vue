<template>
    <div class="actionbar">
        <v-toolbar :dark="actionbarIsDark" :class="actionbarColor" dense>
            <v-toolbar-items class="hidden-sm-and-down">
                <template v-for="action in actions">
                    <v-btn v-if="!action.children" :key="action.name" 
                    :disabled="action.needSelectedItem && !itemSelected" flat @click="executeAction(action)">
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
                        <v-list-tile v-for="child in action.children" :key="child.name"  @click="executeAction(child)">
                            <v-list-tile-action v-if="child.icon"><v-icon>{{child.icon}}</v-icon></v-list-tile-action>
                            <v-list-tile-title>{{ child.title }}</v-list-tile-title>
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

