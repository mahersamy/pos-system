import {inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: "root",
})
export class TranslationService {
    private readonly _translate = inject(TranslateService);
    private readonly _platformId = inject(PLATFORM_ID);

    currentLang = signal<string>("en");

    constructor() {
        if (isPlatformBrowser(this._platformId)) {
            const savedLang = localStorage.getItem("lang");
            const lang = savedLang || "en";

            if (!savedLang) {
                localStorage.setItem("lang", "en");
            }

            this.currentLang.set(lang);
            this._translate.setDefaultLang("en");
            this._translate.use(lang);
            this.updateDirection(lang);
        } else {
            this._translate.setDefaultLang("en");
            this._translate.use("en");
        }
    }

    setLanguage(lang: string) {
        if (isPlatformBrowser(this._platformId)) {
            document.body.classList.add("lang-changing");

            setTimeout(() => {
                this.currentLang.set(lang);
                this._translate.use(lang);
                localStorage.setItem("lang", lang);
                this.updateDirection(lang);

                setTimeout(() => {
                    document.body.classList.remove("lang-changing");
                }, 50);
            }, 300);
        } else {
            this.currentLang.set(lang);
            this._translate.use(lang);
        }
    }

    toggleLanguage() {
        const nextLang = this.currentLang() === "en" ? "ar" : "en";
        this.setLanguage(nextLang);
    }

    private updateDirection(lang: string) {
        const dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        if (isPlatformBrowser(this._platformId) && document.body) {
            document.body.dir = dir;
        }
    }
}
