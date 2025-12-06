import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

export const SummaryCard = () => {
    const { totalMonthlyExpenses, totalAnnualExpenses } = useSubscriptionStore();

    return (
        <View className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-lg">
            <Text className="text-blue-100 text-sm font-medium mb-1">
                Toplam Aylık Gider
            </Text>
            <Text className="text-white text-4xl font-bold mb-4">
                ₺{totalMonthlyExpenses.toFixed(2)}
            </Text>

            <View className="border-t border-blue-400 pt-3 mt-1">
                <View className="flex-row justify-between items-center">
                    <Text className="text-blue-100 text-xs">
                        Yıllık Tahmini Gider
                    </Text>
                    <Text className="text-white text-sm font-semibold">
                        ₺{totalAnnualExpenses.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};
