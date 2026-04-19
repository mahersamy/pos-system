import {inject, Injectable, signal} from "@angular/core";
import {ConfirmationOptions} from "../../interfaces/confirmation-options";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmPop} from "../../../shared/components/confirm-pop/confirm-pop";

/**
 * @service ConfirmationService
 * @description
 * Service for displaying confirmation dialogs in the application.
 * This service provides a centralized way to show confirmation dialogs with customizable
 * messages, actions, and button configurations.
 *
 * ### Features
 * - Opens modal confirmation dialogs
 * - Tracks loading states for primary and secondary buttons
 * - Closes confirmation dialogs programmatically
 * - Supports custom header, message, and button configurations
 *
 * ### Usage Example
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ConfirmationService } from './core/services/confirmation/confirmation';
 *
 * @Component({
 *   selector: 'app-user-management',
 *   template: `<button (click)="deleteUser(123)">Delete User</button>`
 * })
 * export class UserManagementComponent {
 *   constructor(private confirmationService: ConfirmationService) {}
 *
 *   deleteUser(userId: number): void {
 *     this.confirmationService.confirm({
 *       header: 'Delete User',
 *       message: 'Are you sure you want to delete this user? This action cannot be undone.',
 *       type: 'discard',
 *       btn1Text: 'Delete',
 *       btn2Text: 'Cancel',
 *       btn1Action: () => {
 *         this.confirmationService.isBtn1Loading.set(true);
 *         // Perform async delete operation
 *         this.userService.delete(userId).subscribe({
 *           next: () => {
 *             this.confirmationService.isBtn1Loading.set(false);
 *             this.confirmationService.close();
 *             this.showSuccess('User deleted successfully');
 *           },
 *           error: () => {
 *             this.confirmationService.isBtn1Loading.set(false);
 *           }
 *         });
 *       },
 *       btn2Action: () => this.confirmationService.close()
 *     });
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
@Injectable({
    providedIn: "root",
})
export class ConfirmationService {
    /** @ignore */
    private readonly _dialogService = inject(DialogService);
    /** @ignore */
    private ref: DynamicDialogRef | null = null;

    setRef(ref: DynamicDialogRef<any>) {
        this.ref = ref;
        if (ref) {
            const subscription = ref.onClose.subscribe(() => {
                this.ref = null;
                this.isBtn1Loading.set(false);
                this.isBtn2Loading.set(false);
                subscription.unsubscribe();
            });
        }
    }

    /**
     * @description Signal that tracks the loading state of the primary button (btn1)
     * @type {Signal<boolean>}
     * @example
     * // Enable loading state
     * this.confirmationService.isBtn1Loading.set(true);
     *
     * // Disable loading state
     * this.confirmationService.isBtn1Loading.set(false);
     */
    isBtn1Loading = signal(false);

    /**
     * @description Signal that tracks the loading state of the secondary button (btn2)
     * @type {Signal<boolean>}
     * @example
     * // Enable loading state
     * this.confirmationService.isBtn2Loading.set(true);
     *
     * // Disable loading state
     * this.confirmationService.isBtn2Loading.set(false);
     */
    isBtn2Loading = signal(false);

    /**
     * @method confirm
     * @description Opens a confirmation dialog with the provided options
     *
     * This method is the primary way to display a confirmation dialog in the application.
     * It accepts configuration options that define the dialog's appearance and behavior.
     *
     * @param {ConfirmationOptions} options - Configuration options for the confirmation dialog
     * @returns {void}
     *
     * @example
     * ```ts
     * this.confirmationService.confirm({
     *   header: 'Confirm Action',
     *   message: 'Are you sure you want to proceed?',
     *   type: 'toggle',
     *   btn1Text: 'Yes',
     *   btn2Text: 'Cancel',
     *   btn1Action: () => {
     *     this.performAction();
     *     this.confirmationService.close();
     *   },
     *   btn2Action: () => {
     *     this.confirmationService.close();
     *   }
     * });
     * ```
     */
    confirm(options: ConfirmationOptions): void {
        this.isBtn1Loading.set(false);
        this.isBtn2Loading.set(false);
        this.ref = this._dialogService.open(ConfirmPop, {
            // width: options.width || '34rem',
            modal: true,
            showHeader: false,
            contentStyle: {
                padding: "0",
            },
            data: {
                header: options.header,
                message: options.message,
                type: options.type,
                btn1Text: options.btn1Text,
                btn2Text: options.btn2Text,
                btn1Class: options.btn1Class,
                btn1Action: () => {
                    options.btn1Action?.();
                },
                btn2Action: () => {
                    options.btn2Action?.();
                },
                showRejectionDropdown: options.showRejectionDropdown,
                rejectionReasons: options.rejectionReasons,
                onRejectionChange: options.onRejectionChange,
                onDescriptionChange: options.onDescriptionChange,
            },
        });
    }

    /**
     * @method close
     * @description Closes the currently open confirmation dialog
     *
     * This method programmatically closes the confirmation dialog. It should be called
     * after completing the primary action or when the user cancels the operation.
     *
     * @returns {void}
     *
     * @example
     * ```ts
     * // Close after successful operation
     * this.confirmationService.isBtn1Loading.set(true);
     * this.dataService.delete(id).subscribe({
     *   next: () => {
     *     this.confirmationService.isBtn1Loading.set(false);
     *     this.confirmationService.close(); // Close the dialog
     *   }
     * });
     *
     * // Close on cancel button click
     * btn2Action: () => {
     *   this.confirmationService.close(); // Close the dialog
     * }
     * ```
     */
    close(): void {
        this.ref?.close();
    }
}
