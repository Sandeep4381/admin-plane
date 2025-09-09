export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    totalRentals: number;
    cancellations: number;
    lifetimeSpend: number;
    status: 'active' | 'inactive' | 'blocked';
    walletBalance: number;
    lastLogin: string;
    loyalty: 'Gold' | 'Silver' | 'Bronze' | null;
    profilePhotoUrl: string;
};
