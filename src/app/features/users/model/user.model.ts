import { UserRole } from "../enums/user-role.enum";

export interface Permission {
    read: boolean;
    write: boolean;
    delete: boolean;
}

export interface UserPermissions {
    [module: string]: Permission;
}

export interface User {
    _id: string;
    id?: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    role: UserRole;
    age?: number;
    phoneNumber: string;
    isActive?: boolean;
    createdAt?: string;
    profilePicture?: { secure_url: string; public_id?: string };
    address?: string;
    permissions?: UserPermissions;
}
