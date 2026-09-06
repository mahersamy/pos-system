export interface Category {
    _id: string;
    name: string;
    description?: string;
    menu: string;
    image?: {
        secure_url: string;
    };
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryPayload {
    name: string;
    description?: string;
    menu: string;
    isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}
