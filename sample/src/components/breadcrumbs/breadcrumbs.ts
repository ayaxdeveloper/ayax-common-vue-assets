import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { BreadCrumbItem } from './breadcrumb-item';

@Component
export default class BreadcrumbsComponent extends Vue {
    @Watch('$route')
    onRouteChanged(to, from) {
        this.items = this.getItemsFromPath(to.path);
    }
    @Prop() breadcrumbsNames;
    items: any[];
    data() {
        return {
            items: this.getItemsFromPath(this.$route.path)
        }
    }
    
    getItemsFromPath(path) { 
        let result = Array<BreadCrumbItem>();
        var routes = path.split('/');
        if(!routes) return result;
        if(routes[routes.length-1]=="") {
            routes.pop();
        }
        for(let i=0; i<routes.length; i++) {
            if(!this.breadcrumbsNames[routes[i]]) continue;
            result.push( new BreadCrumbItem ({
                text: this.breadcrumbsNames[routes[i]].name, 
                disabled: i == routes.length - 1,
                route: this.breadcrumbsNames[routes[i]].route
            }));
        }
        return result;
    };
    routeTo(item) {
        this.$router.push({ name: item.route });
    };
}