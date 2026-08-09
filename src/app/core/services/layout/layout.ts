import {inject, Injectable, signal} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
    providedIn: "root",
})
export class LayoutService {
    private readonly _translateService = inject(TranslateService)
    /** Signal broadcasting the current layout title to the main application header */
    title = signal<string>("Dashboard");

    /**
     * Updates the global layout title signal dynamically
     * @param {string} newTitle - The human-readable string for the current active view
     */
    setTitle(newTitle: string) {
        this.title.set(this._translateService.instant(newTitle));
    }
}
