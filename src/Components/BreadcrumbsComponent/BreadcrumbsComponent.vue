<template>
    <v-breadcrumbs divider="/" class="mt-0 pt-0">
        <v-breadcrumbs-item 
            v-for="item in items" :key="item.text"
            :disabled="item.disabled" 
            :to="item.route">
            {{item.text}}
        </v-breadcrumbs-item>
    </v-breadcrumbs>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BreadCrumbItem } from "./BreadcrumbItem";

@Component({
    name: "a-breadcrumbs"
})
export default class BreadcrumbsComponent extends Vue {
    items = [];

    created() {
        this.$router.afterEach((to, from) => {
            this.FillBreadcrumbsFromRouteMetedata();
        });
    }

    mounted() {
        this.FillBreadcrumbsFromRouteMetedata();
    }

    FillBreadcrumbsFromRouteMetedata() {
        this.items = [{
            text: "Главная",
            route: "/",
            disabled: true
        }];
        const routeBreadcrumbs = this.$route.meta.breadcrumbs;
        if(routeBreadcrumbs && routeBreadcrumbs.length > 0) {
            this.items[0].disabled = false;
            routeBreadcrumbs.forEach(x => {
                this.items.push({
                    text: x.text,
                    route: x.route,
                    disabled: !x.route
                })
            });
        }
    }
}
</script>