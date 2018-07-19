const listDialogTestLayout = () => import("./Layouts/ListDialogTestLayout/ListDialogTestLayout.vue");
const editTestLayout = () => import("./Layouts/ListTestLayout/EditTestLayout/EditTestLayout.vue");
const listTestLayout = () => import("./Layouts/ListTestLayout/ListTestLayout/ListTestLayout.vue");

export const routes = [
    { path: "/list-dialog-test", name: "list-dialog-test", component: listDialogTestLayout},
    { path: "/list-test/list", name: "list-test", component: listTestLayout},
    { path: "/list-test/edit/:id", name: "testentity-edit", component: editTestLayout},
];
