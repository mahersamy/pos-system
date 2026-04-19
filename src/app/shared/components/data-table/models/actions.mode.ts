export interface ActionConfig {
    icon: string;
    color?: string;
    classes?: string;
    func: (data: any) => void;
}

export interface BulkActionConfig {
    label: string;
    icon?: string;
    color?: string;
    classes?: string;
    func: (selectedItems: any[]) => void;
}
