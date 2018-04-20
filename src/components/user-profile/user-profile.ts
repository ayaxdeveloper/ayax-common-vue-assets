import { Vue, Component, Inject } from 'vue-property-decorator';
import { AuthUser, IAuthService, ITokenService } from 'ayax-common-auth';

@Component
export default class UserProfileComponent extends Vue {
    @Inject() authService: IAuthService;
    @Inject() eventBus: Vue;
    @Inject() tokenService: ITokenService;
    currentUser: AuthUser = new AuthUser();
    async created() {
        this.currentUser = (await this.authService.GetAuthenticatedUser(this.tokenService.getToken()));
    }

    logout(){
        this.eventBus.$emit('logout');
    }
}