import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import clsx from 'clsx';

type Currency = 'TL' | 'USD' | 'EUR';
type Cycle = 'Monthly' | 'Yearly' | 'Weekly';

export default function EditSubscriptionScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { subscriptions, updateSubscription, removeSubscription } = useSubscriptionStore();

    const [isLoading, setIsLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<Currency>('TL');
    const [billingCycle, setBillingCycle] = useState<Cycle>('Monthly');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hasDuration, setHasDuration] = useState(false);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (id) {
            const sub = subscriptions.find((s) => s.id === id);
            if (sub) {
                setSubscription(sub);
                setName(sub.name);
                setPrice(sub.price.toString());
                setCurrency(sub.currency as Currency);
                setBillingCycle(sub.billingCycle as Cycle);
                setDate(new Date(sub.startDate));
                if (sub.duration) {
                    setHasDuration(true);
                    setDuration(sub.duration.toString());
                } else {
                    setHasDuration(false);
                    setDuration('');
                }
            }
            setIsLoading(false);
        }
    }, [id, subscriptions]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    };

    const handleUpdate = async () => {
        if (!name || !price) {
            Alert.alert('Hata', 'Lütfen isim ve fiyat giriniz.');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            Alert.alert('Hata', 'Geçerli bir fiyat giriniz.');
            return;
        }

        const isoDate = date.toISOString().split('T')[0];

        let durationNum: number | undefined = undefined;
        if (hasDuration && duration) {
            durationNum = parseInt(duration);
            if (isNaN(durationNum) || durationNum <= 0) {
                Alert.alert('Hata', 'Geçerli bir vade süresi giriniz.');
                return;
            }
        }

        if (subscription) {
            await updateSubscription({
                ...subscription,
                name,
                price: priceNum,
                currency,
                billingCycle,
                startDate: isoDate,
                duration: durationNum,
            });
            router.back();
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Aboneliği Sil',
            'Bu aboneliği silmek istediğine emin misin?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        if (typeof id === 'string') {
                            await removeSubscription(id);
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!subscription) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-900">Abonelik bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerTitle: `${name} Düzenle` }} />

            <ScrollView className="flex-1 p-4">
                {/* Name Input (Read Only) */}
                <View className="mb-6">
                    <Text className="text-gray-500 mb-2">Servis Adı</Text>
                    <TextInput
                        className="bg-gray-200 text-gray-500 p-4 rounded-lg text-lg border border-gray-200"
                        value={name}
                        editable={false}
                    />
                </View>

                {/* Price & Currency */}
                <View className="mb-6">
                    <Text className="text-gray-500 mb-2">Tutar</Text>
                    <View className="flex-row gap-2">
                        <TextInput
                            className={clsx(
                                "flex-1 p-4 rounded-lg text-xl font-bold border border-gray-200",
                                subscription?.category === 'Bills'
                                    ? "bg-gray-200 text-gray-500"
                                    : "bg-white text-gray-900"
                            )}
                            placeholder="0.00"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={subscription?.category === 'Bills' ? '0' : price}
                            editable={subscription?.category !== 'Bills'}
                            onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                    setPrice(text);
                                }
                            }}
                        />
                        <View className={clsx(
                            "flex-row rounded-lg p-1 border border-gray-200",
                            subscription?.category === 'Bills' ? "bg-gray-100" : "bg-white"
                        )}>
                            {(['TL', 'USD', 'EUR'] as Currency[]).map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    disabled={subscription?.category === 'Bills'}
                                    onPress={() => setCurrency(c)}
                                    className={clsx(
                                        'px-4 justify-center rounded-md',
                                        currency === c ? 'bg-gray-100' : 'bg-transparent',
                                        subscription?.category === 'Bills' && currency !== c && 'opacity-50'
                                    )}
                                >
                                    <Text className={clsx(
                                        'font-bold',
                                        currency === c ? 'text-gray-900' : 'text-gray-500'
                                    )}>
                                        {c}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {subscription?.category === 'Bills' && (
                        <Text className="text-xs text-gray-500 mt-1 ml-1">
                            * Fatura tutarları değişkendir, bu nedenle 0 TL olarak sabitlenmiştir.
                        </Text>
                    )}
                </View>

                {/* Billing Cycle */}
                <View className="mb-6">
                    <Text className="text-gray-500 mb-2">Ödeme Döngüsü</Text>
                    <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                        {(['Monthly', 'Yearly', 'Weekly'] as Cycle[]).map((c) => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setBillingCycle(c)}
                                className={clsx(
                                    'flex-1 py-3 items-center rounded-md',
                                    billingCycle === c ? 'bg-gray-100' : 'bg-transparent'
                                )}
                            >
                                <Text className={clsx('font-medium', billingCycle === c ? 'text-gray-900' : 'text-gray-500')}>
                                    {c === 'Monthly' ? 'Aylık' : c === 'Weekly' ? 'Haftalık' : 'Yıllık'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Duration Selection (Only for Personal Payments) */}
                {subscription?.category === 'Personal' && (
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-500">Belirli bir süresi var mı?</Text>
                            <TouchableOpacity
                                onPress={() => setHasDuration(!hasDuration)}
                                className={clsx(
                                    'w-12 h-7 rounded-full justify-center px-1',
                                    hasDuration ? 'bg-blue-600' : 'bg-gray-300'
                                )}
                            >
                                <View className={clsx(
                                    'w-5 h-5 rounded-full bg-white shadow-sm',
                                    hasDuration ? 'self-end' : 'self-start'
                                )} />
                            </TouchableOpacity>
                        </View>

                        {hasDuration && (
                            <View>
                                <Text className="text-gray-500 mb-2">
                                    {billingCycle === 'Monthly' ? 'Kaç Ay?' : 'Kaç Hafta?'}
                                </Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                    placeholder="0"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={duration}
                                    onChangeText={(text) => {
                                        if (/^\d*$/.test(text)) {
                                            setDuration(text);
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>
                )}

                {/* Start Date */}
                <View className="mb-8">
                    <Text className="text-gray-500 mb-2">Başlangıç Tarihi</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                        <Text className="text-gray-900 text-lg">{formatDate(date)}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date(2030, 11, 31)}
                            minimumDate={new Date(2020, 0, 1)}
                        />
                    )}
                </View>

                {/* Update Button */}
                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-xl items-center active:bg-blue-700 mb-4 shadow-sm"
                    onPress={handleUpdate}
                >
                    <Text className="text-white font-bold text-lg">Güncelle</Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                    className="bg-red-50 p-4 rounded-xl items-center active:bg-red-100 mb-10 border border-red-200"
                    onPress={handleDelete}
                >
                    <Text className="text-red-600 font-bold text-lg">Aboneliği İptal Ettim</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
