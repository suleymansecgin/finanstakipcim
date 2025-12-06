import { create } from 'zustand';
import { Subscription } from '@/types';
import { addSubscriptionToDB, deleteSubscriptionFromDB, getSubscriptionsFromDB, updateSubscriptionInDB } from '@/lib/db';

interface SubscriptionState {
    subscriptions: Subscription[];
    totalMonthlyExpenses: number;
    totalAnnualExpenses: number;
    loadSubscriptions: () => void;
    addSubscription: (subscription: Subscription) => void;
    updateSubscription: (subscription: Subscription) => void;
    removeSubscription: (id: string) => void;
}

const calculateMonthlyExpense = (subscription: Subscription): number => {
    let amount = subscription.price;

    // Currency conversion
    if (subscription.currency === 'USD') {
        amount *= 34;
    } else if (subscription.currency === 'EUR') {
        amount *= 36;
    }

    // Billing cycle adjustment
    if (subscription.billingCycle === 'Yearly') {
        amount /= 12;
    } else if (subscription.billingCycle === 'Weekly') {
        amount *= 4;
    }

    return amount;
};

const calculateAnnualExpense = (subscription: Subscription): number => {
    let amount = subscription.price;

    // Currency conversion
    if (subscription.currency === 'USD') {
        amount *= 34;
    } else if (subscription.currency === 'EUR') {
        amount *= 36;
    }

    // If duration is set, calculate based on duration
    if (subscription.duration) {
        if (subscription.billingCycle === 'Monthly') {
            return amount * subscription.duration;
        } else if (subscription.billingCycle === 'Weekly') {
            return amount * subscription.duration;
        }
    }

    // If no duration (continuous)
    if (subscription.billingCycle === 'Monthly') {
        return amount * 12;
    } else if (subscription.billingCycle === 'Weekly') {
        return amount * 52;
    } else { // Yearly
        return amount;
    }
};

const calculateTotalExpenses = (subscriptions: Subscription[]) => {
    const monthly = subscriptions.reduce((total, sub) => total + calculateMonthlyExpense(sub), 0);
    const annual = subscriptions.reduce((total, sub) => total + calculateAnnualExpense(sub), 0);
    return { monthly, annual };
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    subscriptions: [],
    totalMonthlyExpenses: 0,
    totalAnnualExpenses: 0,

    loadSubscriptions: () => {
        const subscriptions = getSubscriptionsFromDB();
        const { monthly, annual } = calculateTotalExpenses(subscriptions);
        set({ subscriptions, totalMonthlyExpenses: monthly, totalAnnualExpenses: annual });
    },

    addSubscription: (subscription) => {
        try {
            addSubscriptionToDB(subscription);
            const currentSubscriptions = get().subscriptions;
            const updatedSubscriptions = [...currentSubscriptions, subscription];
            const { monthly, annual } = calculateTotalExpenses(updatedSubscriptions);
            set({ subscriptions: updatedSubscriptions, totalMonthlyExpenses: monthly, totalAnnualExpenses: annual });
        } catch (error) {
            console.error('Failed to add subscription to store:', error);
        }
    },

    updateSubscription: (subscription) => {
        try {
            updateSubscriptionInDB(subscription);
            const currentSubscriptions = get().subscriptions;
            const updatedSubscriptions = currentSubscriptions.map((sub) =>
                sub.id === subscription.id ? subscription : sub
            );
            const { monthly, annual } = calculateTotalExpenses(updatedSubscriptions);
            set({ subscriptions: updatedSubscriptions, totalMonthlyExpenses: monthly, totalAnnualExpenses: annual });
        } catch (error) {
            console.error('Failed to update subscription in store:', error);
        }
    },

    removeSubscription: (id) => {
        try {
            deleteSubscriptionFromDB(id);
            const currentSubscriptions = get().subscriptions;
            const updatedSubscriptions = currentSubscriptions.filter((sub) => sub.id !== id);
            const { monthly, annual } = calculateTotalExpenses(updatedSubscriptions);
            set({ subscriptions: updatedSubscriptions, totalMonthlyExpenses: monthly, totalAnnualExpenses: annual });
        } catch (error) {
            console.error('Failed to remove subscription from store:', error);
        }
    },
}));
