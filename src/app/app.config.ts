import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    importProvidersFrom,
} from "@angular/core";
import {provideRouter} from "@angular/router";
import {providePrimeNG} from "primeng/config";
import Aura from "@primeuix/themes/aura";
import {routes} from "./app.routes";
import {provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./core/interceptors/auth-interceptor";
import {errorHandlingInterceptor} from "./core/interceptors/error-handling.interceptor";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader, provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {DialogService} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor, errorHandlingInterceptor])),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            theme: {
                preset: Aura,
            },
        }),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useClass: TranslateHttpLoader,
                },
            })
        ),
        provideTranslateHttpLoader({
            prefix: "./i18n/",
            suffix: ".json",
        }),
        DialogService,
        MessageService,
    ],
};
