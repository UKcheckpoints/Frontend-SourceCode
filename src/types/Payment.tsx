export type Feature = {
    icon: React.ReactNode;
    text: string;
}

export type SubscriptionTier = {
    id: string;
    name: string;
    price: number;
    features: Feature[];
}
