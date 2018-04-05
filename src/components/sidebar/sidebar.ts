import { SidebarComponentItem } from './sidebar-item';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class SidebarComponent extends Vue {
    @Prop() items:SidebarComponentItem[];
    @Prop({default: true}) darkTheme: boolean;
    @Prop({default: 300}) width: number;
    @Prop({default: false}) mini: boolean;
    @Watch('mini')
    onStateChanged(val: boolean, oldVal: boolean) { 
        if(val == true){
            this.items.forEach(element => {
                element.expanded = false;
                element.arrowDirection = "keyboard_arrow_down";
            });
        }
    }

    toogleList(item:SidebarComponentItem) {
        this.items.forEach(element => {
            if(element != item){
                element.expanded = false;
                element.arrowDirection = "keyboard_arrow_down";    
            } 
        })
        item.expanded = !item.expanded;
        item.arrowDirection == "keyboard_arrow_down" ? item.arrowDirection = "keyboard_arrow_up" : item.arrowDirection = "keyboard_arrow_down";
    }

    moveTo(item:SidebarComponentItem) {
        if(item.route == null && item.href == null){
            this.toogleList(item);
            this.mini = false;
        }else if(item.route != null){
            if(item.newTab){
                // this.mini = true;
                window.open(item.route);
            }else{
                // this.mini = true;
                this.$router.push({path: item.route});
            }
        }else if(item.href != null){
            if(item.newTab){
                // this.mini = true;
                window.open(item.href);
            }else{
                // this.mini = true;
                location.href = item.href;
            }
        }
    }
}