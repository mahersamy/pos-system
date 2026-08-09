export interface ModulePermission {
    key: string;
    label: string;
    icon: string;
    read: boolean;
    write: boolean;
    delete: boolean;
}

export interface ModuleMeta {
    label: string;
    icon: string;
}
