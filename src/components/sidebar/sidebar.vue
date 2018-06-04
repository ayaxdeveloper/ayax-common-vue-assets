<template>
    <v-navigation-drawer app :dark="darkTheme" :mini-variant.sync="mini" mini-variant-width="60" permanent fixed :width="width">
        <v-layout row>
            <v-flex class="sidebar-switcher">
                <v-btn class="collapseBtn" icon @click.native.stop="mini = !mini" title="Меню">
                    <v-icon>menu</v-icon>
                </v-btn>
            </v-flex>
            <v-flex class="sidebar-content">
                <v-list dense>
                    <v-list-group v-for="item in items.filter(x=>x.isSystem && x.visible)" 
                    :key="item.title" 
                    append-icon=""
                    :value="item.expanded"  @click.stop="moveTo(item)">
                        <v-list-tile slot="activator">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn v-if="item.subItems.length > 0" icon @click.stop="toogleList(item)">
                                    <v-icon>{{ item.arrowDirection }}</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-if="item.subItems.length > 0"
                            v-for="subItem in item.subItems.filter(subItem => subItem.visible)" :key="subItem.title" @click="moveTo(subItem)">
                            <v-list-tile-action>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>
                </v-list>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-list dense>
            <v-list-group v-for="item in items.filter(item => !item.isSystem && item.visible)" 
            :key="item.title" 
            :prepend-icon="item.icon"
            append-icon=""
            :value="item.expanded"  @click.stop="moveTo(item)">
                <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn v-if="item.subItems.length > 0" icon @click.stop="toogleList(item)">
                            <v-icon>{{ item.arrowDirection }}</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="item.subItems.length > 0" v-for="subItem in item.subItems" :key="subItem.title" @click="moveTo(subItem)">
                    <v-list-tile-action>
                        <v-icon>{{ subItem.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
        </v-list>
        <slot></slot>
    </v-navigation-drawer>
</template>

<script lang="ts" src='./sidebar.ts'>
</script>

<style scoped>
    .sidebar-switcher {
        max-width:60px;
    }
    .sidebar-content {
        margin-left:3px;
    }
    .list__tile__action {
        min-width: 32px !important;
    }

    .list__tile__title {
        color: #FFFFFF;
    }
    .collapseBtn { 
        margin-left: 12px;
    }

</style>