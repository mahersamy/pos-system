import {Injectable, inject, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

/**
 * A lightweight service that detects the current Angular rendering platform
 * (browser or server) using Angular’s dependency injection system.
 *
 * This service is especially useful for apps that need to safely execute
 * browser-only APIs — such as `window`, `document`, or `localStorage` —
 * without breaking Angular Universal or SSR builds.
 *
 * @usageNotes
 *
 * ### 1️⃣ Purpose
 * - Prevents runtime errors when accessing browser-specific APIs on the server.
 * - Helps conditionally run code depending on the platform context.
 *
 * ### 2️⃣ Example usage
 *
 * ```ts
 * import { Component, inject } from '@angular/core';
 * import { PlatFormService } from 'src/app/core/services/platform/platform.service';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 * @if(isBrowser) {
 *     <p>Running in Browser</p>
 * } @else {
 *     <p>Running on Server</p>
 * }
 *   `
 * })
 * export class ExampleComponent {
 *   private readonly platformService = inject(PlatFormService);
 *   isBrowser = this.platformService.isBrowser();
 * }
 * ```
 *
 * ### 3️⃣ When to use
 * Use this service whenever you need to:
 * - Access browser globals like `window`, `document`, or `localStorage`.
 * - Conditionally load third-party scripts or libraries.
 * - Guard DOM manipulations during SSR or prerendering.
 *
 * ### 4️⃣ API Summary
 * - `isBrowser(): boolean` — Returns `true` if running in a browser environment,
 *   or `false` when on the server.
 *
 * @example
 * ```ts
 * if (this.platformService.isBrowser()) {
 *   localStorage.setItem('key', 'value');
 * }
 * ```
 *
 * @remarks
 * - Uses Angular’s `PLATFORM_ID` token and `isPlatformBrowser` helper.
 * - Provided in root — no need to import it in feature modules.
 * - Designed to work seamlessly with SSR, signals, and zoneless Angular.
 */

@Injectable({providedIn: "root"})
export class PlatFormService {
    private readonly _platformId = inject(PLATFORM_ID);

    /**
     * Identifies if the application logic is running inside a browser environment cleanly
     * @returns {boolean} True if the system matches the physical frontend structure
     */
    isBrowser(): boolean {
        return isPlatformBrowser(this._platformId);
    }
}
