import {inject, Injectable, signal} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {StorageService} from "../storage/storage.service";

@Injectable({
    providedIn: "root",
})
export class TranslationService {
    private readonly _translate = inject(TranslateService);
    private readonly _storage = inject(StorageService);

    currentLang = signal<string>("en");

    constructor() {
        const savedLang = this._storage.get<string>("lang");
        const lang = savedLang || "en";

        if (!savedLang) {
            this._storage.set("lang", "en");
        }

        this.currentLang.set(lang);
        this._translate.setDefaultLang("en");
        this._translate.use(lang);
        this.updateDirection(lang);
    }

    setLanguage(lang: string) {
        document.body.classList.add("lang-changing");

        setTimeout(() => {
            this.currentLang.set(lang);
            this._translate.use(lang);
            this._storage.set("lang", lang);
            this.updateDirection(lang);

            setTimeout(() => {
                document.body.classList.remove("lang-changing");
            }, 50);
        }, 300);
    }

    toggleLanguage() {
        const nextLang = this.currentLang() === "en" ? "ar" : "en";
        this.setLanguage(nextLang);
    }

    private updateDirection(lang: string) {
        const dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        if (document.body) {
            document.body.dir = dir;
        }
    }
}
