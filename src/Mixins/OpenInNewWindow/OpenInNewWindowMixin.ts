import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export class OpenInNewWindowMixin extends Vue {
    OpenInNewWindow(link: string) {
        window.open(link, '_blank');
    }

    OpenInNewWindowByName(name: string) {
        const route = this.$router.resolve({name: name});
        if(route) {
            window.open(route.href, '_blank');
        }
    }
}