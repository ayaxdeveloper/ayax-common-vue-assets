import App from './app/app.vue'
import ListDialogTestLayout from './layouts/list-dialog-test/list-dialog-test.vue';
import ListTestLayout from './layouts/list-test-layout/list-test/list-test.vue';
import EditTestLayout from './layouts/list-test-layout/edit-test/edit-test.vue';



export const routes = [
    { path: '/list-dialog-test', name: 'list-dialog-test', component: ListDialogTestLayout},
    { path: '/list-test/list', name: 'list-test', component: ListTestLayout},
    { path: "/list-test/edit/:id", name: "testentity-edit", component: EditTestLayout},
];
