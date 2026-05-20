import {Directive, ElementRef, inject, Input, Renderer2, effect, signal} from "@angular/core";

/**
 * @directive Loading
 * @description
 * The `Loading` directive allows you to display a **spinner inside a button** while a process is running.
 * It automatically disables the button, shows a loading spinner, and restores the original content when done.
 *
 * ✅ This directive works **only on `<button>` elements**.
 *
 * ### Features:
 * - Captures the original button width and preserves it while loading.
 * - Disables the button while loading.
 * - Replaces button content with a spinner.
 * - Restores original content and state when loading ends.
 *
 * ### Usage
 *
 * #### 1️⃣ Import the directive in your standalone component or module:
 * ```ts
 * import { Loading } from './path/to/loading.directive';
 *
 * @Component({
 *   selector: 'app-example',
 *   imports: [Loading],
 *   templateUrl: './example.component.html',
 * })
 * export class ExampleComponent {}
 * ```
 *
 * #### 2️⃣ Use the directive in your template on a button:
 * ```html
 * <button [loading]="isLoading" (click)="doSomething()">
 *   Submit
 * </button>
 * ```
 *
 * #### 3️⃣ In your component class:
 * ```ts
 * isLoading = false;
 *
 * doSomething() {
 *   this.isLoading = true;
 *   someAsyncOperation().finally(() => {
 *     this.isLoading = false;
 *   });
 * }
 * ```
 *
 * ### Notes:
 * - The directive automatically restores the original button content.
 * - Works only for `<button>` elements.
 */

@Directive({
    selector: "button[loading]",
    standalone: true,
})
export class Loading {
    private readonly _el = inject(ElementRef<HTMLButtonElement>);
    private readonly _renderer = inject(Renderer2);
    private _originalNodes: Node[] = [];
    private _spinner: HTMLElement | null = null;
    private _wasDisabledByDirective = false;
    private readonly _loading = signal(false);
    private _originalWidth: string | null = null;

    @Input({required: true})
    set loading(value: boolean) {
        this._loading.set(value);
    }

    constructor() {
        effect(() => {
            const isLoading = this._loading();
            const button = this._el.nativeElement;

            if (isLoading) {
                // Capture current width
                if (!this._originalWidth) {
                    const computedStyle = window.getComputedStyle(button);
                    this._originalWidth = computedStyle.width;
                    this._renderer.setStyle(button, "width", this._originalWidth);
                }

                // Disable
                if (!button.disabled) {
                    this._renderer.setProperty(button, "disabled", true);
                    this._wasDisabledByDirective = true;
                }

                // Capture and remove ALL current nodes (preserves Angular bindings)
                this._originalNodes = Array.from(button.childNodes);
                this._originalNodes.forEach((node) => this._renderer.removeChild(button, node));

                // Create and add spinner only if it doesn't exist
                if (!this._spinner) {
                    this._spinner = this._renderer.createElement("span");
                    this._spinner?.classList.add("app-loading-spinner");
                    this._spinner!.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>
`;
                    this._renderer.appendChild(button, this._spinner);
                }
            } else {
                // Remove spinner
                if (this._spinner) {
                    this._renderer.removeChild(button, this._spinner);
                    this._spinner = null;
                }

                // Restore original nodes (bindings still intact!)
                if (this._originalNodes.length > 0) {
                    this._originalNodes.forEach((node) => this._renderer.appendChild(button, node));
                    this._originalNodes = [];
                }

                // Re-enable ONLY if it wasn't disabled before we started
                if (this._wasDisabledByDirective) {
                    // Check if there's a [disabled] binding that should still be active
                    // We can't easily check that, so we just set it to false if WE disabled it.
                    // But wait, if the user has [disabled]="!hasMore()", Angular will re-evaluate it anyway.
                    this._renderer.setProperty(button, "disabled", false);
                    this._wasDisabledByDirective = false;
                }

                // Reset width
                if (this._originalWidth) {
                    this._renderer.removeStyle(button, "width");
                    this._originalWidth = null;
                }
            }
        });
    }
}
