import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Subscription } from '@/types';
import { LOGO_MAP } from '@/constants/logos';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SubscriptionItemProps {
    subscription: Subscription;
}

export const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
    const router = useRouter();
    const { name, price, currency, startDate, billingCycle } = subscription;

    const calculateDaysLeft = (start: string, cycle: 'Monthly' | 'Yearly' | 'Weekly') => {
        const today = new Date();
        const startDateObj = new Date(start);
        let nextPaymentDate = new Date(startDateObj);

        // Adjust next payment date to be in the future
        while (nextPaymentDate <= today) {
            if (cycle === 'Monthly') {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            } else if (cycle === 'Weekly') {
                nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
            } else {
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            }
        }

        const diffTime = Math.abs(nextPaymentDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysLeft = calculateDaysLeft(startDate, billingCycle);
    const isUrgent = daysLeft <= 3;

    return (
        <TouchableOpacity
            onPress={() => router.push(`/subscription/${subscription.id}`)}
            activeOpacity={0.7}
            className="flex-row items-center bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
        >
            {/* Icon */}
            <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-4 overflow-hidden border border-gray-100">
                {subscription.image && subscription.image !== 'default' && LOGO_MAP[subscription.image] ? (
                    <Image
                        source={LOGO_MAP[subscription.image]}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                ) : (
                    <Text className="text-gray-900 font-bold text-lg">
                        {name.charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">{name}</Text>
                <Text className={`${isUrgent ? 'text-red-500' : 'text-gray-500'} text-xs`}>
                    {daysLeft} gün kaldı
                </Text>
            </View>

            {/* Price */}
            <View className="items-end">
                <Text className="text-gray-900 font-bold text-base">
                    {price} {currency}
                </Text>
                <Text className="text-gray-500 text-xs">
                    {billingCycle === 'Monthly' ? 'Aylık' : billingCycle === 'Weekly' ? 'Haftalık' : 'Yıllık'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
