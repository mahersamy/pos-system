export interface Menu {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMenuPayload {
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateMenuPayload extends Partial<CreateMenuPayload> {}
