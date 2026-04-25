import {Component, output, input} from "@angular/core";

@Component({
    selector: "app-error-state",
    imports: [],
    templateUrl: "./error-state.html",
    styleUrl: "./error-state.scss",
})
export class ErrorState {
    /** Primary error heading text */
    title = input<string>("System Interruption");

    /** Informative description explains the failure context */
    message = input<string>(
        "We experienced a technical hitch while gathering your records. Please try reconnecting or refresh the view."
    );

    /** Text context for the actionable retry trigger */
    btnText = input<string>("Retry Connection");

    /** Event broadcasting the user interaction intent to re-trigger the data fetch */
    retry = output<void>();

    /**
     * Emits the actionable intent back to the parent consumer
     */
    onRetry() {
        this.retry.emit();
    }
}
