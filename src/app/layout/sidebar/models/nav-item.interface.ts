/**
 * Represents a single item in the sidebar navigation list.
 *
 * `iconWidth` and `iconHeight` are required by Angular's `NgOptimizedImage`
 * directive to prevent layout shift — they must match the intrinsic pixel
 * dimensions of the image file.
 */
export interface NavItem {
    /** Display text shown next to the icon */
    label: string;

    /** Absolute path to the icon image */
    src: string;

    /** Intrinsic pixel width of the icon — required by NgOptimizedImage */
    iconWidth: number;

    /** Intrinsic pixel height of the icon — required by NgOptimizedImage */
    iconHeight: number;

    /** Alt text for the icon (usually label lowercased) */
    alt: string;

    /** Absolute router path this item navigates to (e.g. /main/staff) */
    route: string;
}
