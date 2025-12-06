import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerTitle: 'Ayarlar', headerBackTitle: 'Geri' }} />

            <ScrollView className="flex-1 p-4">
                {/* General Settings Section (Placeholder for future) */}
                <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                    <Text className="text-gray-900 font-bold text-lg mb-4">Genel</Text>
                    <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                                <FontAwesome name="bell" size={16} color="#2563EB" />
                            </View>
                            <Text className="text-gray-700 text-base">Bildirimler</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-3">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                                <FontAwesome name="star" size={16} color="#059669" />
                            </View>
                            <Text className="text-gray-700 text-base">Uygulamayı Değerlendir</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Legal & Info Section */}
                <View className="mb-10">
                    <Text className="text-gray-500 text-sm font-medium mb-2 uppercase ml-1">Hakkında</Text>

                    <View className="bg-white rounded-xl p-4 border border-gray-200">
                        <Text className="text-gray-600 text-sm leading-6 mb-4">
                            Bu uygulamada kullanılan Netflix, Spotify, YouTube ve diğer tüm marka isimleri ve logoları, ilgili hak sahiplerinin mülkiyetindedir. Bu markaların kullanımı yalnızca tanımlama ve referans amaçlıdır ('Nominative Fair Use'). Abonelik Takipçisi uygulamasının bu markalarla herhangi bir resmi bağı, ortaklığı veya sponsorluk ilişkisi bulunmamaktadır.
                        </Text>

                        <View className="items-center mt-4 pt-4 border-t border-gray-100">
                            <Text className="text-gray-400 text-xs">Versiyon 1.0.0</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
