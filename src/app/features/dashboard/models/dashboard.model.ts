export interface MonthlyOverviewItem {
    name: string;
    dineInSales: number;
    totalRevenue: number;
}

export interface PopularDishItem {
    _id: string;
    name: string;
    price: number;
    stock: string;
    image?: {
        public_id: string;
        secure_url: string;
    };
    totalOrdered: number;
}

export interface LowStockItem {
    _id: string;
    name: string;
    quantity: number;
    stock: string;
    price: number;
    image?: {
        public_id: string;
        secure_url: string;
    };
}

export interface DashboardStats {
    dailySales: number;
    monthlyRevenue: number;
}
