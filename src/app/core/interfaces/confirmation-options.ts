/**
 * @interface ConfirmationOptions
 * @description
 * Defines the configuration options for displaying a **confirmation dialog**.
 * This interface is typically used when opening a confirmation modal using a dialog service.
 *
 * ### Properties
 *
 * | Property       | Type            | Description                                                                                     | Optional |
 * |----------------|----------------|-------------------------------------------------------------------------------------------------|----------|
 * | `message`      | `string`        | The main message or question displayed in the confirmation dialog.                              | No       |
 * | `btn1Text`     | `string`        | Text for the primary button (e.g., "Yes", "Confirm").                                           | Yes      |
 * | `btn2Text`     | `string`        | Text for the secondary button (e.g., "No", "Cancel").                                           | Yes      |
 * | `btn1Action`   | `() => void`    | Callback function executed when the primary button is clicked.                                   | Yes      |
 * | `btn2Action`   | `() => void`    | Callback function executed when the secondary button is clicked.                                 | Yes      |
 * | `header`       | `string`        | Optional header/title displayed at the top of the confirmation dialog.                          | Yes      |
 * | `width`        | `string`        | Optional CSS width for the dialog (e.g., "400px", "50%").                                       | Yes      |
 *
 * ### Example Usage
 *
 * ```ts
 * const options: ConfirmationOptions = {
 *   message: 'Are you sure you want to delete this item?',
 *   btn1Text: 'Yes, delete',
 *   btn2Text: 'Cancel',
 *   btn1Action: () => this.deleteItem(item.id),
 *   btn2Action: () => console.log('Deletion cancelled'),
 *   header: 'Confirm Deletion',
 *   width: '400px'
 * };
 *
 * this.dialogService.open(ConfirmationComponent, { data: options });
 * ```
 *
 * ### Notes
 * - `btn1Action` and `btn2Action` are optional. If not provided, the buttons will simply close the dialog.
 * - `width` and `header` allow customization of the dialog appearance.
 */
export interface ConfirmationOptions {
    message: string;
    btn1Text?: string;
    btn2Text?: string;
    btn1Class?: string;
    btn2Class?: string;
    btn1Action?: () => void;
    btn2Action?: () => void;
    header?: string;
    width?: string;
    type?: "discard" | "delete";
    showRejectionDropdown?: boolean;
    rejectionReasons?: Array<{label: string; value: string}>;
    onRejectionChange?: (reasonId: string) => void;
    onDescriptionChange?: (description: string) => void;
    isFormValid?: () => boolean;
}
