import {Injectable, Renderer2, RendererFactory2, PLATFORM_ID, effect, inject, signal} from "@angular/core";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {StorageKeys} from "../../constants/storage.config";
import {StorageService} from "../storage/storage.service";


@Injectable({providedIn: "root"})
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly rendererFactory2 = inject(RendererFactory2);
    private readonly _platformId = inject(PLATFORM_ID);

    private readonly STORAGE_KEY = StorageKeys.THEME;
    private readonly _storage = inject(StorageService);
    renderer!: Renderer2;

    theme = signal<"light" | "dark">("light");

    constructor() {
        this.renderer = this.rendererFactory2.createRenderer(null, null);
        this.initializeTheme();
        this.setupThemeListener();
    }

    toggle(): void {
        this.theme.update((value) => (value === "dark" ? "light" : "dark"));
    }

    setTheme(theme: "light" | "dark"): void {
        this.theme.set(theme);
    }

    private initializeTheme(): void {
        if (!isPlatformBrowser(this._platformId)) return;

        const savedTheme = this._storage.get<"light" | "dark">(this.STORAGE_KEY);

        if (savedTheme) {
            this.theme.set(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: light)").matches;
            this.theme.set(prefersDark ? "light" : "light");
        }

        this.applyTheme(this.theme());
    }

    private setupThemeListener(): void {
        effect(() => {
            const currentTheme = this.theme();
            if (isPlatformBrowser(this._platformId)) {
                this._storage.set(this.STORAGE_KEY, currentTheme);
            }
            this.applyTheme(currentTheme);
        });
    }

    private applyTheme(theme: "light" | "dark"): void {
        if (!isPlatformBrowser(this._platformId)) return;

        const html = this.document.documentElement;

        this.renderer.removeClass(html, "light-mode");
        this.renderer.removeClass(html, "dark-mode");

        if (theme === "dark") {
            this.renderer.addClass(html, "dark-mode");
        } else {
            this.renderer.addClass(html, "light-mode");
        }
    }
}
