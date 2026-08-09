import {
    Component,
    input,
    output,
    OnInit,
    signal,
    effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Permission, UserPermissions } from '../../model/user.model';
import { ModulePermission } from '../../model/permission-editor.model';
import {
    DEFAULT_MODULE_ICON,
    formatLabel,
    MODULE_META,
} from './permission-editor.config';

export * from '../../model/permission-editor.model';
export * from './permission-editor.config';

@Component({
    selector: 'app-permission-editor',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './permission-editor.html',
    styleUrl: './permission-editor.scss',
})
export class PermissionEditor implements OnInit {
    /** Permissions object from the backend — keys drive the module list */
    initialPermissions = input<UserPermissions | undefined>(undefined);

    /** Emits the full updated permissions map on any toggle */
    permissionsChange = output<UserPermissions>();

    modules = signal<ModulePermission[]>([]);

    constructor() {
        /** Reactive rebuild whenever initialPermissions changes */
        effect(() => {
            this._buildModules(this.initialPermissions());
        });
    }

    ngOnInit(): void {
        // Safety net in case initialPermissions was ready before constructor effect hook
        if (this.modules().length === 0) {
            this._buildModules(this.initialPermissions());
        }
    }

    /** Derives module rows purely from backend permission keys and cosmetic lookup */
    private _buildModules(perms: UserPermissions | undefined): void {
        const allKeys = new Set(Object.keys(MODULE_META));

        if (perms) {
            Object.keys(perms).forEach(key => allKeys.add(key));
        }

        const rows: ModulePermission[] = Array.from(allKeys).map(key => {
            const meta = MODULE_META[key];
            const perm = perms?.[key];
            return {
                key,
                label: meta?.label ?? formatLabel(key),
                icon: meta?.icon ?? DEFAULT_MODULE_ICON,
                read: perm?.read ?? false,
                write: perm?.write ?? false,
                delete: perm?.delete ?? false,
            };
        });

        this.modules.set(rows);
    }

    // ─── Module Level Toggles ────────────────────────────────────────────────

    toggle(mod: ModulePermission, action: keyof Permission): void {
        const updated = this.modules().map(m =>
            m.key === mod.key ? { ...m, [action]: !m[action] } : m
        );
        this.modules.set(updated);
        this._emit();
    }

    toggleAll(mod: ModulePermission): void {
        const allOn = this.isAllOn(mod);
        const updated = this.modules().map(m =>
            m.key === mod.key
                ? { ...m, read: !allOn, write: !allOn, delete: !allOn }
                : m
        );
        this.modules.set(updated);
        this._emit();
    }

    isAllOn(mod: ModulePermission): boolean {
        return mod.read && mod.write && mod.delete;
    }

    isPartial(mod: ModulePermission): boolean {
        const count = [mod.read, mod.write, mod.delete].filter(Boolean).length;
        return count > 0 && count < 3;
    }

    // ─── Global Select All ───────────────────────────────────────────────────

    get globalAllOn(): boolean {
        const currentModules = this.modules();
        return currentModules.length > 0 && currentModules.every(m => this.isAllOn(m));
    }

    get globalPartial(): boolean {
        const currentModules = this.modules();
        const total = currentModules.length * 3;
        const activeCount = currentModules.reduce(
            (acc, m) => acc + (m.read ? 1 : 0) + (m.write ? 1 : 0) + (m.delete ? 1 : 0),
            0
        );
        return activeCount > 0 && activeCount < total;
    }

    toggleGlobalAll(): void {
        const allOn = this.globalAllOn;
        const updated = this.modules().map(m => ({
            ...m,
            read: !allOn,
            write: !allOn,
            delete: !allOn,
        }));
        this.modules.set(updated);
        this._emit();
    }

    // ─── Component Helpers & Emits ───────────────────────────────────────────

    get isEmpty(): boolean {
        return this.modules().length === 0;
    }

    getCurrentPermissions(): UserPermissions {
        const perms: UserPermissions = {};
        this.modules().forEach(m => {
            perms[m.key] = { read: m.read, write: m.write, delete: m.delete };
        });
        return perms;
    }

    private _emit(): void {
        this.permissionsChange.emit(this.getCurrentPermissions());
    }
}
