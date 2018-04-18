import { IAppSettings, INotificationSettings, NotificationSettings, IServerSettings, ServerSettings, IClientSettings, ClientSettings } from "ayax-common-types";

export class AppSettings implements IAppSettings {
    Notification(): INotificationSettings {
        return new NotificationSettings({
            successDismiss: 3000
        });
    }
    Server(): IServerSettings {
        return new ServerSettings({
            apiPrefix: "/api",
            authenticateUrl: "/authenticate",
            baseUrl: "",
            tokenCheckMethod: "/infosource/list"
        });
    };
    Client(): IClientSettings {
        return new ClientSettings({
            clientCacheExpiresAfter: 20,
            listRowsPerpage: 20,
            systemCode: "cc"
        });
    };
    Custom: () => { [name: string]: any; };
}