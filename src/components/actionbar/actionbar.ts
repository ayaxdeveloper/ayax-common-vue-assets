import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { TableComponentAction } from '../table/table-action';
import { ResizeObserver } from 'vue-resize';

@Component({
    components: {
        'resize-observer': ResizeObserver
    }
})
export default class ActionbarComponent extends Vue{
    @Prop({default: 'primary'}) actionbarColor: string;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({required: true}) actions: TableComponentAction[];
    @Prop({default: false}) itemSelected: boolean;
    @Prop({default: null}) innerSelected: any[];

    actionbarContainer;
    actionbar;

    @Emit()
    onBarAction(items: any[], name: string) {}

    mounted() {
        this.actionbarContainer = document.getElementsByClassName('actionbarContainer');
        this.actionbar = document.getElementsByClassName('actionbar');
        this.addWindowEvents();
    }

    addWindowEvents() {
        window.onresize = () => {
            this.actionbarSize();
        }
        window.onscroll = () => {
            [].forEach.call(this.actionbarContainer, elem => {
                this.toggleActionbar(elem);
            })
        }
    }

    isElementInViewPort(el) {
        var rect = el.getBoundingClientRect();
        return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
      );
    }

    isPartOfElementInViewPort(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;
        while(el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }
        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    actionbarSize() {
        [].forEach.call(this.actionbar, el => {
            el.style.width = this.actionbarContainer[0].offsetWidth.toString() + 'px';
        })
    }

    toggleActionbar(elem) {
        let actionBarElement = elem.querySelector('.actionbar');
        if(!actionBarElement) {
            return;
        }
        if(this.isPartOfElementInViewPort(elem.querySelector('.mainAnchor')) && !this.isElementInViewPort(elem.querySelector('.actionbarAnchor'))) {
            actionBarElement.classList.add('actionbarFixed');
        }else {
            actionBarElement.classList.remove('actionbarFixed');
        }
    }
}