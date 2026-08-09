import {Component, inject, signal} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {ConfirmationService} from "../../../core/services/confirmation/confirmation";
import {Loading} from "../../directives/loading/loading";
import {ConfirmationOptions} from "../../../core/interfaces/confirmation-options";

@Component({
    selector: "app-confirmation",
    imports: [Loading, FormsModule, TranslateModule, Select],
    templateUrl: "./confirm-pop.html",
    styleUrl: "./confirm-pop.scss",
})
export class ConfirmPop {
    private readonly _config = inject(DynamicDialogConfig);
    private readonly _confirmationService = inject(ConfirmationService);
    private readonly _sanitizer = inject(DomSanitizer);
    private readonly _ref = inject(DynamicDialogRef);
    private readonly _translateService = inject(TranslateService);

    data: ConfirmationOptions = this._config.data || {};
    selectedReason = signal("");
    rejectionDescription = signal("");

    isBtn1Loading = this._confirmationService.isBtn1Loading;
    isBtn2Loading = this._confirmationService.isBtn2Loading;

    constructor() {
        this._confirmationService.setRef(this._ref);
    }

    /**
     * Handles changes in the rejection reason dropdown.
     * @param {string} value The selected reason ID.
     */
    onReasonChange(value: string): void {
        this.data.onRejectionChange?.(value);
    }

    /**
     * Handles changes in the rejection description text area.
     * @param {string} value The entered description.
     */
    onDescriptionChange(value: string): void {
        this.data.onDescriptionChange?.(value);
    }

    /**
     * Triggers the primary action configured for this confirmation popup.
     * Pre-checks validation if the action requires a reason or description.
     */
    onBtn1Click() {
        if (!this.isBtn1Enabled()) return;
        this.data.btn1Action?.();
    }

    /**
     * Triggers the secondary action (typically cancellation) and closes the modal.
     */
    onBtn2Click() {
        this.data.btn2Action?.();
        this._ref.close();
    }

    /**
     * Checks whether the primary button should be enabled based on form validation.
     * @returns {boolean} True if enabled, false otherwise.
     */
    isBtn1Enabled(): boolean {
        if (!this.data.showRejectionDropdown) return true;
        return !!this.selectedReason() && this.rejectionDescription().trim().length > 0;
    }

    /**
     * Helper to dynamically retrieve the font-awesome icon class based on type.
     * @returns {string} The appropriate fa-icon CSS class.
     */
    getIcon(): string {
        switch (this.data.type) {
            case "delete":
                return "fas fa-trash-can";
            case "discard":
                return "fas fa-triangle-exclamation";
            default:
                return "fas fa-circle-info";
        }
    }

    /**
     * Helper to dynamically configure the icon's background and border container class.
     * @returns {string} The CSS class for the visual wrapper.
     */
    getIconContainerClass(): string {
        switch (this.data.type) {
            case "delete":
                return "icon-delete";
            case "discard":
                return "icon-info";
            default:
                return "icon-info";
        }
    }

    /**
     * Helper to assign correct button styling (colors/fills) based on standard action types.
     * @returns {string} The CSS class sequence for the primary button.
     */
    getButtonClass(): string {
        let baseClass = "btn";
        if (this.data.type === "delete") {
            baseClass += " btn-delete";
        } else {
            baseClass += " btn-primary";
        }

        if (this.data.btn1Class) {
            baseClass += " " + this.data.btn1Class;
        }

        if (!this.data.btn2Text) {
            baseClass += " btn-full-width";
        }

        return baseClass;
    }

    /**
     * Sanitizes configured HTML strings to safely bind innerHTML to the UI without XSS risks.
     * @returns {SafeHtml} The trusted HTML string.
     */
    getSafeMessage(): SafeHtml {
        const translatedMessage = this._translateService.instant(this.data.message || "");
        return this._sanitizer.bypassSecurityTrustHtml(translatedMessage);
    }
}
