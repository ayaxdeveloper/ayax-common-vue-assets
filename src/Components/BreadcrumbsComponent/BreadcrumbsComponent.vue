<template>
    <v-breadcrumbs :items="items" divider="/" class="mt-0 pa-0" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BreadCrumbItem } from "./BreadcrumbItem";

@Component({
  name: "a-breadcrumbs",
})
export default class BreadcrumbsComponent extends Vue {
  get items(): any[] {
    const arr = [
      {
        text: "Главная",
        href: "/",
        disabled: false,
      },
    ];
    const routeBreadcrumbs = this.$route.meta.breadcrumbs;
    if (routeBreadcrumbs && routeBreadcrumbs.length > 0) {
      routeBreadcrumbs.forEach((x) => {
        arr.push({
          text: x.text,
          href: !x.route ? "/" : x.route.replace(/:([^/]+)/g, (x) => this.$route.params[x.slice(1)]),
          disabled: !x.route,
        });
      });
    }
    return arr;
  }
}
</script>
