import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    importProvidersFrom,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeuix/themes/aura";
import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./core/interceptors/auth-interceptor";
import { environment } from "../environments/environment";
import { TranslateModule } from "@ngx-translate/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            theme: {
                preset: Aura,
            },
        }),
        importProvidersFrom(TranslateModule.forRoot()),
        DialogService,
        MessageService
    ],
};
