import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { clearDatabase } from '@/lib/db';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { SubscriptionItem } from '@/features/dashboard/components/SubscriptionItem';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DashboardScreen() {
    const router = useRouter();
    const { subscriptions, loadSubscriptions } = useSubscriptionStore();

    useEffect(() => {
        // clearDatabase(); // Uncomment to wipe data once, then comment out
        loadSubscriptions();
    }, []);

    // Sort subscriptions: nearest payment date first
    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB; // Simplified sorting for now, ideally should calculate next payment date
    });

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-4 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-gray-500 text-sm font-medium">Toplam Harcama</Text>
                        <Text className="text-gray-900 text-2xl font-bold">Abonelikler</Text>
                    </View>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => router.push('/add')}
                            className="bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm border border-gray-200"
                        >
                            <FontAwesome name="plus" size={20} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/settings')}
                            className="bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm border border-gray-200"
                        >
                            <FontAwesome name="cog" size={20} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={sortedSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <SubscriptionItem subscription={item} />}
                    ListHeaderComponent={<SummaryCard />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <Text className="text-gray-500">Henüz abonelik eklenmedi.</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
