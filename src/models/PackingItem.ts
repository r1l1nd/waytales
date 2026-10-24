export interface PackingItem {
    id: string;
    name: string;
    isChecked: boolean;
}

export interface PackingCategory {
    categoryName: string;
    items: PackingItem[];
}