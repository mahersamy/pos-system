import {Injectable, Renderer2, RendererFactory2, effect, inject, signal} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {PlatFormService} from "../platform/platform";
import {StorageKeys} from "../../constants/storage.config";

/**
 * A service for managing the application’s theme mode (light or dark) using Angular signals.
 *
 * This service handles theme initialization, toggling, persistence in `localStorage`, and
 * dynamic DOM class updates to apply the correct styles to the entire app.
 *
 * @usageNotes
 *
 * ### 1️⃣ Provide and use the ThemeService
 * The service is provided in the root injector by default, so you can inject it directly
 * into any standalone component, directive, or other service:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * @Component({
 *   selector: 'app-theme-toggle',
 *   template: `
 *     <button (click)="toggleTheme()">
 *       Toggle Theme ({{ themeService.theme() }})
 *     </button>
 *   `
 * })
 * export class ThemeToggleComponent {
 *   constructor(public themeService: ThemeService) {}
 *
 *   toggleTheme() {
 *     this.themeService.toggle();
 *   }
 * }
 * ```
 *
 * ### 2️⃣ Theme persistence
 * - The selected theme is stored in `localStorage` using the key defined in `StorageKeys.THEME`.
 * - When the app loads, the service automatically restores the last used theme.
 *
 * ### 3️⃣ Defining theme variables
 * Create a `variables.scss` file to define global color variables using CSS custom properties.
 * These variables will automatically switch based on the applied theme class.
 *
 * ```scss
 * :root {
 *   // Base colors
 *   --white: #ffffff;
 *   --black: #212121;
 *
 *   // Body
 *   --body-color: var(--white);
 *   --text-color: var(--black);
 *
 *   // Section-specific colors
 *   --navbar-bg: var(--white);
 *   --footer-bg: #f5f5f5;
 *   --button-bg: #007bff;
 *   --button-text: var(--white);
 * }
 *
 * // Dark theme overrides
 * .dark-mode {
 *   --body-color: var(--black);
 *   --text-color: var(--white);
 *
 *   // Section overrides
 *   --navbar-bg: #1e1e1e;
 *   --footer-bg: #121212;
 *   --button-bg: #0d6efd;
 *   --button-text: var(--white);
 * }
 * ```
 *
 * ### 4️⃣ Applying the variables
 * Use these variables in your global `styles.scss` or individual components:
 *
 * ```scss
 * body {
 *   background-color: var(--body-color);
 *   color: var(--text-color);
 * }
 *
 * nav {
 *   background-color: var(--navbar-bg);
 * }
 *
 * footer {
 *   background-color: var(--footer-bg);
 * }
 *
 * button {
 *   background-color: var(--button-bg);
 *   color: var(--button-text);
 * }
 * ```
 *
 * ### 5️⃣ API Summary
 * - `theme: Signal<'light' | 'dark'>` — The current theme value (reactive).
 * - `toggle(): void` — Switches between light and dark themes.
 * - `setTheme(theme: 'light' | 'dark'): void` — Sets a specific theme manually.
 *
 * @example
 * ```ts
 * // Manually setting a dark theme
 * this.themeService.setTheme('dark');
 * ```
 *
 * @remarks
 * - Uses Angular’s `Renderer2` for DOM manipulation.
 * - Fully compatible with zoneless mode and signals.
 * - Ensures consistent theming across reloads and navigation.
 */

@Injectable({providedIn: "root"})
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly rendererFactory2 = inject(RendererFactory2);
    private readonly platformService = inject(PlatFormService);

    private readonly STORAGE_KEY = StorageKeys.THEME;
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
        if (!this.platformService.isBrowser()) return;

        const savedTheme = localStorage.getItem(this.STORAGE_KEY) as "light" | "dark" | null;

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
            if (this.platformService.isBrowser()) {
                localStorage.setItem(this.STORAGE_KEY, currentTheme);
            }
            this.applyTheme(currentTheme);
        });
    }

    private applyTheme(theme: "light" | "dark"): void {
        if (!this.platformService.isBrowser()) return;

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
