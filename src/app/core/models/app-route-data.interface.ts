export interface AppRouteData {
    /** Display label shown in the sidebar and page title */
    label?: string;

    /** Absolute path to the nav icon image (e.g. /images/sidebar/staff.avif) */
    icon?: string;

    /** Intrinsic width of the icon in pixels — required by NgOptimizedImage */
    iconWidth?: number;

    /** Intrinsic height of the icon in pixels — required by NgOptimizedImage */
    iconHeight?: number;

    /** When true, this route's root path is included in the sidebar */
    sidebar?: boolean;

    /** Browser tab / page header title */
    title?: string;
}
