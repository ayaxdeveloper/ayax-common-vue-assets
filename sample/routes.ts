import ListDialogTestLayout from "./Layouts/ListDialogTestLayout/ListDialogTestLayout.vue";
import EditTestLayout from "./Layouts/ListTestLayout/EditTestLayout/EditTestLayout.vue";
import ListTestLayout from "./Layouts/ListTestLayout/ListTestLayout/ListTestLayout.vue";

export const routes = [
    { path: "/list-dialog-test", name: "list-dialog-test", component: ListDialogTestLayout},
    { path: "/list-test/list", name: "list-test", component: ListTestLayout},
    { path: "/list-test/edit/:id", name: "testentity-edit", component: EditTestLayout},
];
