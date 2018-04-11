import App from './app/app.vue'

export const routes = [
    { path: "/", name: "home", component: App, meta: {access: "CC_Base"} },
    { path: "/signin", name: "signin", component: App },
    { path: "/unauthorized", name: "unauthorized", component: App },

    { path: "/infosource", name: "infosource", component: App, meta: {access: ["CC_Admin"] }},

    { path: "/", name: "monitoring", component: App, meta: {access: "CC_Admin"} },
    { path: "/", name: "records", component: App, meta: {access: "CC_Admin"} }, 
    { path: "/", name: "logs", component: App, meta: {access: "CC_Admin"} },

    { path: "/route", name: "route", component: App, meta: {access: "CC_Admin"} },

    { path: "/leadtype", name: "leadtype", component: App, meta: {access: "CC_Admin"} },

    { path: "/objecttype", name: "objecttype", component: App, meta: {access: "CC_Admin"} },

    { path: "/operatornumber/list", name: "operator-number-list", component: App, meta: {access: "CC_Admin"} },
    { path: "/operatornumber/edit/:id", name: "operatorAlias-edit", component: App, meta: {access: "CC_Admin"} },

    { path: "/preference", name: "preference", component: App, meta: {access: "CC_Admin"} },

    { path: "/switcher/list", name: "switcher-list", component: App, meta: {access: "CC_Admin"} },
    { path: "/switcher/edit/:id", name: "switcher-edit", component: App, meta: {access: "CC_Admin"} },
    { path: "/switcher/show/:id", name: "switcher-show", component: App, meta: {access: "CC_Admin"} },
    { path: "/switcher/schedule/edit/:id", name: "switcherschedule-edit", component: App, meta: {access: "CC_Admin"} },
    { path: "/switcher/rounded/edit/:id", name: "switcherroundededepartment-edit", component: App, meta: {access: "CC_Admin"} },

    { path: "/lead/add", name: "lead-add", component: App, meta: {access: ["CC_Operator","CC_Admin"]}},
    { path: "/lead/add/:layout", name: "lead-add-layout", component: App, meta: {access: ["CC_Operator","CC_Admin"] }},
    { path: "/lead/show/:id", name: "lead-show", component: App, meta: {access: ["CC_Operator","CC_Agent", "CC_Chief", "CC_Manager", "CC_Admin"] }},
    { path: "/lead/list", name: "lead-list", component: App, meta: {access: ["CC_Operator","CC_Agent", "CC_Chief", "CC_Manager", "CC_Admin"] }},

    { path: "/frame", name: "frame", component: App, meta: {access: ["CC_Operator","CC_Admin"] }},

    { path: "/divisionredirect", name: "divisionredirect", component: App, meta: {access: ["CC_Admin"] }}
];
