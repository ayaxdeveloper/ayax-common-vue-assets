import { RouteBreadcrumbMetadata, RouteMetadata } from "ayax-common-types";
import ListDialogTestLayout from "./Layouts/ListDialogTestLayout/ListDialogTestLayout.vue";
import EditTestLayout from "./Layouts/ListTestLayout/EditTestLayout/EditTestLayout.vue";
import ListTestLayout from "./Layouts/ListTestLayout/ListTestLayout/ListTestLayout.vue";

export const routes = [
    { 
        path: "/list-dialog-test", 
        name: "list-dialog-test", 
        component: ListDialogTestLayout, 
        meta: new RouteMetadata({
            breadcrumbs: [
                new RouteBreadcrumbMetadata ({ text: "List-Dialog-Component" })
            ]
        })
    },
    { 
        path: "/list-test/list", 
        name: "list-test", 
        component: ListTestLayout,
        meta: new RouteMetadata({
            breadcrumbs: [
                new RouteBreadcrumbMetadata ({ text: "List-Component" })
            ]
        })
    },
    { 
        path: "/list-test/edit/:id", 
        name: "testentity-edit", 
        component: EditTestLayout,
        meta: new RouteMetadata({
            breadcrumbs: [
                new RouteBreadcrumbMetadata ({ text: "List-Component", route: "/list-test/list" }),
                new RouteBreadcrumbMetadata ({ text: "Edit-Component" }),
            ]
        })
    },
];
