import { Route } from "@angular/router";
import { AppRouteData } from "./app-route-data.interface";

/**
 * Extends Angular's built-in `Route` type to enforce typed `data` metadata.
 * Use this instead of `Route` when defining feature routes that carry sidebar
 * or title metadata.
 */
export interface AppRoute extends Route {
    data?: AppRouteData;
    children?: AppRoute[];
}
