import App from './app/app.vue'
import ListDialogTestLayout from './layouts/list-dialog-test/list-dialog-test.vue';


export const routes = [
    { path: "/", name: "home", component: App, meta: {access: "CC_Base"} },
    { path: '/list-dialog-test', name: 'list-dialog-test', component: ListDialogTestLayout}
];
