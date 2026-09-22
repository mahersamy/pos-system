import { PermissionAction, PermissionModule } from "../../../../core/constants/permission-module.enum";

export interface ActionConfig {
    icon: string;
    color?: string;
    classes?: string;
    /** When set, this action is only shown if the user has the required permission */
    permission?: { module: PermissionModule; action: PermissionAction };
    func: (data: any) => void;
}

export interface BulkActionConfig {
    label: string;
    icon?: string;
    color?: string;
    classes?: string;
    /** When set, this bulk action is only shown if the user has the required permission */
    permission?: { module: PermissionModule; action: PermissionAction };
    func: (selectedItems: any[]) => void;
}
