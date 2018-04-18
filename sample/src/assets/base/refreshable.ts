import { Vue } from 'vue-property-decorator';
export default abstract class RefreshableComponent extends Vue {
    show: boolean = true;
    refresh(renderEnds?: Function) {
        this.show = false
        this.$nextTick(() => {
            this.show = true
            console.log('re-render start')
            this.$nextTick(() => {
                if(renderEnds) {
                    renderEnds();
                }
            })
        })
    }
}