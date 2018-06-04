import { Vue, Component, Inject, Prop } from 'vue-property-decorator';
import { AuthUser, IAuthService, ITokenService } from 'ayax-common-auth';

@Component
export default class UserProfileComponent extends Vue {
    @Inject() authService: IAuthService;
    @Inject() eventBus: Vue;
    @Inject() tokenService: ITokenService;
    @Prop({default: () => []}) modules: string[];
    currentUser: AuthUser = new AuthUser();
    async created() {
        this.currentUser = (await this.authService.GetAuthenticatedUser(this.modules));
    }

    logout(){
        this.eventBus.$emit('logout');
    }
}