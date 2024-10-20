import { SubscriptionTier } from "@/types/Payment";
import { Bell, MapPin, Truck } from "lucide-react";

export const subscriptionTier: SubscriptionTier = {
    id: 'premium',
    name: 'Premium',
    price: 25,
    features: [
        { icon: <MapPin className="w-5 h-5 text-sky-500" />, text: 'Interactive checkpoint map' },
        { icon: <Bell className="w-5 h-5 text-sky-500" />, text: 'Real-time status updates' },
        { icon: <Truck className="w-5 h-5 text-sky-500" />, text: 'Advanced route planning' },
    ]
}
