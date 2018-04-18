export class TokenService {
    private static localStorageTokenName = "token";
    public static getTokenFromCookie(name: string, source: string) {
        var matches = source.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          let cookie = matches ? decodeURIComponent(matches[1]) : undefined;
        //   console.log(`${name}Cookie=${cookie}`);
        return cookie;
    }
    private static getTokenFromLocalStorage(name: string) {
        return localStorage.getItem(this.localStorageTokenName);
    }

    public static getToken() {
        let cookie = this.getTokenFromCookie(this.localStorageTokenName, document.cookie);
        if(!cookie) {
            cookie = this.getTokenFromLocalStorage(this.localStorageTokenName);
        }
        return cookie
    }

    public static setToken(token: string) {
        return localStorage.setItem(this.localStorageTokenName, token);
    }

    public static clearToken() {
        localStorage.removeItem(this.localStorageTokenName);
    }
}