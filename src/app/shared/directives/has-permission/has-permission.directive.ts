import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { PermissionsService } from "../../../core/services/permissions/permissions";
import { PermissionModule, PermissionAction } from "../../../core/constants/permission-module.enum";

export interface PermissionConfig {
    module: PermissionModule;
    action: PermissionAction;
}

/**
 * Structural directive that conditionally renders an element based on the user's permissions.
 *
 * Usage:
 * ```html
 * <button *hasPermission="{ module: PermissionModule.STAFF, action: 'write' }">Create</button>
 * ```
 *
 * - Admin users always see the element.
 * - Element is completely removed from the DOM when permission is denied.
 */
@Directive({
    selector: "[hasPermission]",
    standalone: true,
})
export class HasPermissionDirective {
    private readonly _templateRef     = inject(TemplateRef<any>);
    private readonly _viewContainer   = inject(ViewContainerRef);
    private readonly _permissionsService = inject(PermissionsService);

    private _config: PermissionConfig | null = null;

    @Input()
    set hasPermission(config: PermissionConfig) {
        this._config = config;
        this._updateView();
    }

    constructor() {
        // Re-evaluate whenever permissions signal changes (e.g. on login/logout)
        effect(() => {
            // Touch the signal so Angular tracks it
            this._permissionsService.permissions();
            this._permissionsService.isAdmin();
            this._updateView();
        });
    }

    private _updateView(): void {
        if (!this._config) return;

        const hasAccess = this._permissionsService.can(this._config.module, this._config.action);

        if (hasAccess) {
            if (this._viewContainer.length === 0) {
                this._viewContainer.createEmbeddedView(this._templateRef);
            }
        } else {
            this._viewContainer.clear();
        }
    }
}
