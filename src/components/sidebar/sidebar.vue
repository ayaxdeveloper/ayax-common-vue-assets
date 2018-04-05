<template>
    <v-navigation-drawer app :dark="darkTheme" :mini-variant.sync="mini" mini-variant-width="60" permanent absolute :width="width">
        <v-layout row>
            <v-flex style="max-width:60px">
                <v-btn class="collapseBtn" icon @click.native.stop="mini = !mini" title="Меню">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </v-flex>
            <v-flex>
                <v-list style="margin-left: 3px" dense>
                    <v-list-group v-for="item in items" 
                    :key="item.title" 
                    v-if="item.isSystem && item.visible"
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
                        <v-list-tile v-if="subItem.visible && item.subItems.length > 0" 
                            v-for="subItem in item.subItems" :key="subItem.title" @click="moveTo(subItem)">
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
            <v-list-group v-for="item in items" 
            :key="item.title" 
            :prepend-icon="item.icon"
            v-if="!item.isSystem && item.visible"
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
    </v-navigation-drawer>
</template>

<script lang="ts" src='./sidebar.ts'>
</script>

<style scoped>
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