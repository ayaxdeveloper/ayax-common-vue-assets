<template>
    <v-navigation-drawer app :dark="darkTheme" :mini-variant.sync="mini" mini-variant-width="60" permanent fixed :width="width">
        <v-layout row>
            <v-flex class="sidebar-switcher">
                <v-btn class="collapseBtn" icon @click.native.stop="mini = !mini" title="Меню">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </v-flex>
            <v-flex class="sidebar-content">
                <v-list dense>
                    <v-list-group v-for="item in items.filter(x=>x.isSystem && x.visible)" 
                    :key="item.title" 
                    append-icon=""
                    :value="item.expanded"  
                    @click="click($event, subItem)"
                    @click.middle="clickMiddle($event, subItem)">
                        <v-list-tile slot="activator">
                            <v-list-tile-action v-if="item.icon">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title :title="item.title">{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn v-if="item.subItems.length > 0" icon @click.stop="toogleList(item)">
                                    <v-icon>{{ item.arrowDirection }}</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-if="item.subItems.length > 0"
                            v-for="subItem in item.subItems.filter(subItem => subItem.visible)" :key="subItem.title" 
                            @click="click($event, subItem)"
                            @click.middle="clickMiddle($event, subItem)">
                            <v-list-tile-action>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title :title="subItem.title">{{ subItem.title }}</v-list-tile-title>
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
            :value="item.expanded"  
            @click="click($event, item)"
            @click.middle="clickMiddle($event, item)">
                <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title :title="item.title">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn v-if="item.subItems.length > 0" icon @click.stop="toogleList(item)">
                            <v-icon>{{ item.arrowDirection }}</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="item.subItems.length > 0" v-for="subItem in item.subItems" :key="subItem.title" 
                    @click="click($event, subItem)"
                    @click.middle="clickMiddle($event, subItem)">
                    <v-list-tile-action>
                        <v-icon>{{ subItem.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title :title="subItem.title">{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
        </v-list>
        <slot></slot>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { OpenInNewWindowMixin } from "../../Mixins/OpenInNewWindow/OpenInNewWindowMixin";
import { SidebarComponentItem } from "./SidebarItem";

@Component
export default class SidebarComponent extends Vue {
    @Prop() items: SidebarComponentItem[];
    @Prop({default: true}) darkTheme: boolean;
    @Prop({default: 300}) width: number;
    @Prop({default: false}) miniProp: boolean;
    mini = this.miniProp;
    @Watch("mini")
    onStateChanged(val: boolean, oldVal: boolean) { 
        if (val === true) {
            this.items.forEach(element => {
                element.expanded = false;
                element.arrowDirection = "mdi-chevron-down";
            });
        }
    }

    toogleList(item: SidebarComponentItem) {
        
        this.items.forEach(element => {
            if (element !== item) {
                element.expanded = false;
                element.arrowDirection = "mdi-chevron-down";    
            } 
        });

        item.expanded = !item.expanded;
        item.arrowDirection === "mdi-chevron-down" ? item.arrowDirection = "mdi-chevron-up" : item.arrowDirection = "mdi-chevron-down";
    }

    click(e, item: SidebarComponentItem) {
        e = e || window.event;
        if (item.route == null && item.href == null) {
            this.toogleList(item);
            this.mini = false;
        } else if (item.route != null) {
            if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
                window.open(item.route);
            } else {
                this.$router.push({path: item.route});
            }
        } else if (item.href != null) {
            if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
                window.open(item.href);
            } else {
                location.href = item.href;
            }
        }
    }

    clickMiddle(e, item: SidebarComponentItem) {
        e.preventDefault();
        if (item.route != null) {
            window.open(item.route);
            return;
        } else if (item.href != null) {
            window.open(item.route);
            return;
        }
        this.click(e, item);
    }


    moveToNewWindow(item : SidebarComponentItem) {
        if (item.route == null && item.href == null) {
            this.toogleList(item);
            this.mini = false;
        } else if (item.route != null) {
            window.open(item.route);
        }else if (item.href != null) {
            window.open(item.href);
        }
    }
}
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