export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: 'TL' | 'USD' | 'EUR';
    billingCycle: 'Monthly' | 'Yearly' | 'Weekly';
    startDate: string;
    category: string;
    image?: string;
    duration?: number;
}
