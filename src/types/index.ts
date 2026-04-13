export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum PricingType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM'
}

export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
    BLOCKED = 'BLOCKED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
    STRIPE = 'STRIPE',
    SSLCOMMERZ = 'SSLCOMMERZ',
    WALLET = 'WALLET'
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    PAUSED = 'PAUSED'
}

export enum SubscriptionTierName {
    FREE = 'FREE',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM',
    VIP = 'VIP'
}

export enum AccessType {
    RENTAL = 'RENTAL',
    STREAMING = 'STREAMING'
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: Role;
    status: UserStatus;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date | null;
    isDeleted: boolean;
}

export interface Movie {
    id: string;
    title: string;
    slug: string | null;
    description: string;
    genre: string[];
    releaseYear: number;
    director: string;
    cast: string[];
    platform: string;
    language: string[];
    pricing: PricingType;
    price: number | null;
    youtubeLink: string | null;
    posterUrl: string | null;
    trailerUrl: string | null;
    duration: number | null;
    averageRating: number | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date | null;
    isDeleted: boolean;
}

export interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    content?: string;
    tags?: string[];
    status: ReviewStatus;
    containsSpoiler: boolean;
    spoiler?: boolean;
    likesCount?: number;
    _count?: {
        likes?: number;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    userId: string;
    movieId: string;
    user?: User;
    movie?: Movie;
}

export interface Watchlist {
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    userId: string;
    movieId: string;
    movie?: Movie;
}

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId: string;
    userId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
