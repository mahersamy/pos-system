export interface Permission {
    read: boolean;
    write: boolean;
}

export interface UserPermissions {
    [module: string]: Permission;
}

export interface User {
    _id?: string;
    uid?: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phoneNumber: string;
    role: string | null;
    profilePicture?: string;
    permissions?: UserPermissions;
}
