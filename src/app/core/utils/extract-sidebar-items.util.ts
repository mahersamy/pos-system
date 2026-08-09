import { Routes } from "@angular/router";
import { NavItem } from "../../layout/sidebar/models/nav-item.interface";

/**
 * Recursively walks the Angular route tree and collects every route
 * whose `data.sidebar === true` into a flat `NavItem[]`.
 *
 * Works with both inline `children` arrays and the spread-into-parent
 * pattern used by feature route files (e.g. `...staffRoutes` inside
 * `main.children`).
 *
 * @param routes   Top-level `Routes` array from `app.routes.ts`
 * @returns        Ordered list of sidebar navigation items
 */
export function extractSidebarItems(routes: Routes): NavItem[] {
    const items: NavItem[] = [];

    function walk(routeList: Routes, parentPath = ""): void {
        for (const route of routeList) {
            const segment = route.path ?? "";

            // Build the full absolute path, collapsing duplicate slashes
            const fullPath = `${parentPath}/${segment}`.replace(/\/+/g, "/");

            if (route.data?.["sidebar"] === true) {
                items.push({
                    label:      route.data["label"]       ?? segment,
                    src:        route.data["icon"]        ?? "",
                    iconWidth:  route.data["iconWidth"]   ?? 16,
                    iconHeight: route.data["iconHeight"]  ?? 16,
                    alt:        route.data["label"]?.toLowerCase() ?? segment,
                    route:      fullPath,
                });
            }

            // Descend into static children (covers the spread-route pattern)
            if (route.children?.length) {
                walk(route.children as Routes, fullPath);
            }
        }
    }

    walk(routes);
    return items;
}
