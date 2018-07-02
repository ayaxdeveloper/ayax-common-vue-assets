import { mixins } from "vue-class-component";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { OpenInNewWindowMixin } from "../../Mixins/OpenInNewWindow/OpenInNewWindowMixin";
import { SidebarComponentItem } from "./sidebar-item";

@Component
export default class SidebarComponent extends mixins(OpenInNewWindowMixin) {
    @Prop() items: SidebarComponentItem[];
    @Prop({default: true}) darkTheme: boolean;
    @Prop({default: 300}) width: number;
    @Prop({default: false}) miniProp: boolean;
    mini = this.miniProp;
    @Watch("mini")
    onStateChanged(val: boolean, oldVal: boolean) { 
        if (val === true) {
            this.items.forEach(element => {
                element.expanded = false;
                element.arrowDirection = "keyboard_arrow_down";
            });
        }
    }

    toogleList(item: SidebarComponentItem) {
        
        this.items.forEach(element => {
            if (element !== item) {
                element.expanded = false;
                element.arrowDirection = "keyboard_arrow_down";    
            } 
        });

        item.expanded = !item.expanded;
        item.arrowDirection === "keyboard_arrow_down" ? item.arrowDirection = "keyboard_arrow_up" : item.arrowDirection = "keyboard_arrow_down";
    }

    click(e, item: SidebarComponentItem) {
        e = e || window.event;
        if (item.route == null && item.href == null) {
            this.toogleList(item);
            this.mini = false;
        } else if (item.route != null) {
            if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
                window.open(item.route);
            } else {
                this.$router.push({path: item.route});
            }
        } else if (item.href != null) {
            if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
                window.open(item.href);
            } else {
                location.href = item.href;
            }
        }
    }

    clickMiddle(e, item: SidebarComponentItem) {
        e.preventDefault();
        if (item.route != null) {
            window.open(item.route);
            return;
        } else if (item.href != null) {
            window.open(item.route);
            return;
        }
        this.click(e, item);
    }


    moveToNewWindow(item : SidebarComponentItem) {
        if (item.route == null && item.href == null) {
            this.toogleList(item);
            this.mini = false;
        } else if (item.route != null) {
            window.open(item.route);
        }else if (item.href != null) {
            window.open(item.href);
        }
    }
}