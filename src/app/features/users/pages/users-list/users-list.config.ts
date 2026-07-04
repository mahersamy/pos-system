import { ColumnConfig } from "../../../../shared/components/data-table/models/colmun-config.model";
import { TableColumnType } from "../../../../shared/components/data-table/enums/colmun-type.enum";
import { ActionConfig } from "../../../../shared/components/data-table/models/actions.mode";
import { FilterFieldType, SelectFilterConfig } from "../../../../shared/components/filter-panel/interface/filter-panel.models";
import { UserRole } from "../../enums/user-role.enum";

export const USERS_TABLE_COLUMNS: ColumnConfig[] = [
    {
        field: "_id",
        header: "USERS.FIELDS.ID",
        type: TableColumnType.ID,
    },
    {
        field: "fullName",
        header: "USERS.FIELDS.NAME",
        type: TableColumnType.USER,
        imageField: "profilePicture",
    },
    {
        field: "email",
        header: "USERS.FIELDS.EMAIL",
        type: TableColumnType.TEXT,
    },
    {
        field: "role",
        header: "USERS.FIELDS.ROLE",
        type: TableColumnType.SELECT,
        options: [
            { label: 'USERS.ROLES.ADMIN', value: UserRole.ADMIN },
            { label: 'USERS.ROLES.MANAGER', value: UserRole.MANAGER },
            { label: 'USERS.ROLES.CASHIER', value: UserRole.CASHIER }
        ]
    },
    // {
    //     field: "phoneNumber",
    //     header: "USERS.FIELDS.PHONE",
    //     type: TableColumnType.TEXT,
    // },
    {
        field: "age",
        header: "USERS.FIELDS.AGE",
        type: TableColumnType.TEXT,
        suffix: " yr",
    },
    {
        field: "createdAt",
        header: "USERS.FIELDS.DATE",
        type: TableColumnType.DATE,
        dateFormat: "d-MMM-y",
    },
];

export const USERS_TABLE_ACTION_META: Omit<ActionConfig, "func">[] = [
    { icon: "fa-solid fa-eye", classes: "preview-button" },
    { icon: "fa-solid fa-trash", classes: "delete-button" },
];

export const USERS_FILTER_CONFIG: SelectFilterConfig[] = [
    {
        type: FilterFieldType.SELECT,
        controlName: "role",
        label: "USERS.FIELDS.ROLE",
        typeSelect: "single",
        select_list: [
            { label: 'USERS.ROLES.ADMIN', value: UserRole.ADMIN },
            { label: 'USERS.ROLES.MANAGER', value: UserRole.MANAGER },
            { label: 'USERS.ROLES.CASHIER', value: UserRole.CASHIER }
        ]
    }
];
