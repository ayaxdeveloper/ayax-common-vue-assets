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

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BreadCrumbItem } from "./BreadcrumbItem";

@Component
export default class BreadcrumbsComponent extends Vue {
    @Watch("$route")
    onRouteChanged(to, from) {
        this.items = this.getItemsFromPath(to.path);
    }
    @Prop() breadcrumbsNames;
    items: any[];
    data() {
        return {
            items: this.getItemsFromPath(this.$route.path)
        };
    }
    
    getItemsFromPath(path) { 
        const result: BreadCrumbItem[] = [];
        const routes = path.split("/");
        if (!routes) return result;
        if (routes[routes.length - 1] === "") {
            routes.pop();
        }
        for (let i = 0; i < routes.length; i++) {
            if (!this.breadcrumbsNames[routes[i]]) continue;
            result.push( new BreadCrumbItem ({
                text: this.breadcrumbsNames[routes[i]].name, 
                disabled: i === routes.length - 1,
                route: this.breadcrumbsNames[routes[i]].route
            }));
        }
        return result;
    }

    routeTo(item) {
        this.$router.push({ name: item.route });
    }
}
</script>