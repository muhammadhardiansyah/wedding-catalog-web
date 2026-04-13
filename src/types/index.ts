export interface Category {
    id: number;
    name: string;
    slug: string;
    designs_count?: number;
}

export interface Tag {
    id: number;
    name: string;
    designs_count?: number;
}

export interface Design {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string;
    canva_embed_url: string;
    canva_public_url: string;
    category: Category;
    tags: Tag[];
    is_featured: boolean;
    is_active: boolean;
    price_type: "free" | "premium";
    price: number | null;
    view_count: number;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
