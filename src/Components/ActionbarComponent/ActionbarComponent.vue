<template>
    <div class="actionbar">
        <v-toolbar :dark="actionbarIsDark" :class="actionbarColor" dense>
            <template v-for="action in actions">
                <v-toolbar-items :key="action.name">
                    <v-btn v-if="!action.children"
                    :disabled="action.needSelectedItem && !itemSelected" flat @click="executeAction(action)"
                    :loading="action.loading">
                        <v-icon left v-if="action.icon">{{action.icon}}</v-icon>
                        {{action.title}}
                    </v-btn>
                    <v-menu top offset-y :disabled="action.needSelectedItem && !itemSelected" v-if="action.children">
                        <v-btn slot="activator"
                        :loading="action.loading"
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
                </v-toolbar-items>
                <v-spacer v-if="action.spaceNext" :key="action.title"></v-spacer>
            </template>
        </v-toolbar>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { TableComponentAction } from "../TableComponent/TableAction";

@Component
export default class ActionbarComponent extends Vue{
    @Prop({default: "primary"}) actionbarColor: string;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({required: true}) actions: TableComponentAction[];
    @Prop({default: false}) itemSelected: boolean;
    @Prop({default: null}) innerSelected: any[];

    actionbarContainer;
    actionbar;

    @Emit()
    onBarAction(items: any[], name: string) {}

    mounted() {
        this.actionbarContainer = document.getElementsByClassName("actionbarContainer");
        this.actionbar = document.getElementsByClassName("actionbar");
        this.addWindowEvents();
        this.actionbarSize();
        [].forEach.call(this.actionbarContainer, elem => {
            this.toggleActionbar(elem);
        });
    }

    updated() {
        this.actionbarSize();
    }

    addWindowEvents() {
        window.onresize = () => {         
            this.actionbarSize();
        };
        window.onscroll = () => {
            [].forEach.call(this.actionbarContainer, elem => {
                this.toggleActionbar(elem);
            });
        };
    }

    isElementInViewPort(el) {
        const rect = el.getBoundingClientRect();
        return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
      );
    }

    isPartOfElementInViewPort(el) {
        let top = el.offsetTop;
        let left = el.offsetLeft;
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }
        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    actionbarSize() {
        [].forEach.call(this.actionbar, el => {
            el.style.width = this.actionbarContainer[0].offsetWidth.toString() + "px";
        });
    }

    toggleActionbar(elem) {
        const actionBarElement = elem.querySelector(".actionbar");
        if (!actionBarElement) {
            return;
        }
        if (this.isPartOfElementInViewPort(elem.querySelector(".mainAnchor")) && !this.isElementInViewPort(elem.querySelector(".actionbarAnchor"))) {
            actionBarElement.classList.add("actionbarFixed");
        }else {
            actionBarElement.classList.remove("actionbarFixed");
        }
    }

    executeAction(action: TableComponentAction) {
        if (action.action) {
            action.action();
        } else {
            this.onBarAction(this.innerSelected.map(x => x.id), action.name);
        }
    }
}
</script>

<style scoped>
    .actionbarFixed {
        position: fixed;
        bottom: 0;
    }
</style>

<style>
    .actionbar .v-toolbar__content {
        padding: 0px;
    }
</style>


