import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { POPULAR_SERVICES } from '@/constants/services';
import { LOGO_MAP } from '@/constants/logos';
import clsx from 'clsx';
import DateTimePicker from '@react-native-community/datetimepicker';

type Tab = 'popular' | 'other';
type Currency = 'TL' | 'USD' | 'EUR';
type Cycle = 'Monthly' | 'Yearly' | 'Weekly';

const OTHER_SERVICES = [
    { id: 'rent', name: 'Kira', logoKey: 'rent' },
    { id: 'bank', name: 'Banka/Kredi', logoKey: 'bank' },
    { id: 'bus', name: 'Ulaşım', logoKey: 'bus' },
    { id: 'bills', name: 'Faturalar', logoKey: 'bills' },
    { id: 'personal', name: 'Kişisel Ödemeler', logoKey: 'personal' },
    { id: 'education', name: 'Eğitim', logoKey: 'education' },
];

const BANKS = [
    "Garanti BBVA", "QNB Finansbank", "Vakıfbank", "Ziraat Bankası",
    "Halkbank", "KuveytTürk", "Albaraka", "DenizBank",
    "TEB", "İşbankası", "Akbank", "ING"
];

export default function AddSubscriptionScreen() {
    const router = useRouter();
    const addSubscription = useSubscriptionStore((state) => state.addSubscription);

    const [activeTab, setActiveTab] = useState<Tab>('popular');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<Currency>('TL');
    const [billingCycle, setBillingCycle] = useState<Cycle>('Monthly');

    // Date state
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedLogoKey, setSelectedLogoKey] = useState<string>('default');
    const [showForm, setShowForm] = useState(false);

    // Rent Modal State
    const [rentModalVisible, setRentModalVisible] = useState(false);
    const [rentType, setRentType] = useState<'Ev' | 'Dükkan'>('Ev');
    const [rentAmount, setRentAmount] = useState('');
    const [rentDate, setRentDate] = useState(new Date());
    const [showRentDatePicker, setShowRentDatePicker] = useState(false);

    // Bills Modal State
    const [billModalVisible, setBillModalVisible] = useState(false);
    const [billType, setBillType] = useState<'Elektrik' | 'Su' | 'Doğalgaz'>('Elektrik');
    const [billDate, setBillDate] = useState(new Date());
    const [showBillDatePicker, setShowBillDatePicker] = useState(false);

    // Bank Modal State
    const [bankModalVisible, setBankModalVisible] = useState(false);
    const [bankProductType, setBankProductType] = useState<'Card' | 'Loan'>('Card');
    const [selectedBank, setSelectedBank] = useState<string>(BANKS[0]);
    const [isBankListOpen, setIsBankListOpen] = useState(false);
    const [loanAmount, setLoanAmount] = useState('');
    const [bankDate, setBankDate] = useState(new Date());
    const [showBankDatePicker, setShowBankDatePicker] = useState(false);

    // Transport Modal State
    const [transportModalVisible, setTransportModalVisible] = useState(false);
    const [transportPrice, setTransportPrice] = useState('');
    const [lastLoadDate, setLastLoadDate] = useState(new Date());
    const [showTransportDatePicker, setShowTransportDatePicker] = useState(false);

    // Personal Modal State
    const [personalModalVisible, setPersonalModalVisible] = useState(false);
    const [personalName, setPersonalName] = useState('');
    const [personalPrice, setPersonalPrice] = useState('');
    const [personalCycle, setPersonalCycle] = useState<'Monthly' | 'Weekly'>('Monthly');
    const [personalDate, setPersonalDate] = useState(new Date());
    const [showPersonalDatePicker, setShowPersonalDatePicker] = useState(false);
    const [hasDuration, setHasDuration] = useState(false);
    const [duration, setDuration] = useState('');

    // Education Modal State
    const [educationModalVisible, setEducationModalVisible] = useState(false);
    const [eduType, setEduType] = useState<'School' | 'Bus' | 'Food' | 'PrivateLesson' | 'Course' | 'Other'>('School');
    const [eduName, setEduName] = useState('');
    const [eduPrice, setEduPrice] = useState('');
    const [eduCycle, setEduCycle] = useState<'Monthly' | 'Weekly' | 'Yearly'>('Monthly');
    const [eduDuration, setEduDuration] = useState('');
    const [eduDate, setEduDate] = useState(new Date());
    const [showEduDatePicker, setShowEduDatePicker] = useState(false);
    const [hasEduDuration, setHasEduDuration] = useState(false);


    const handleServiceSelect = (service: typeof POPULAR_SERVICES[0]) => {
        setName(service.name);
        setSelectedLogoKey(service.logoKey);
        setShowForm(true);
    };

    const handleOtherServiceSelect = (service: typeof OTHER_SERVICES[0]) => {
        if (service.id === 'rent') {
            setRentModalVisible(true);
        } else if (service.id === 'bills') {
            setBillModalVisible(true);
        } else if (service.id === 'bank') {
            setBankModalVisible(true);
        } else if (service.id === 'bus') {
            setTransportModalVisible(true);
        } else if (service.id === 'personal') {
            setPersonalModalVisible(true);
        } else if (service.id === 'education') {
            setEducationModalVisible(true);
        } else {
            console.log("Seçildi: " + service.name);
        }
    };

    const handleBackToSelection = () => {
        setShowForm(false);
        setName('');
        setPrice('');
        setSelectedLogoKey('default');
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onRentDateChange = (event: any, selectedDate?: Date) => {
        setShowRentDatePicker(false);
        if (selectedDate) {
            setRentDate(selectedDate);
        }
    };

    const onBillDateChange = (event: any, selectedDate?: Date) => {
        setShowBillDatePicker(false);
        if (selectedDate) {
            setBillDate(selectedDate);
        }
    };

    const onBankDateChange = (event: any, selectedDate?: Date) => {
        setShowBankDatePicker(false);
        if (selectedDate) {
            setBankDate(selectedDate);
        }
    };

    const onTransportDateChange = (event: any, selectedDate?: Date) => {
        setShowTransportDatePicker(false);
        if (selectedDate) {
            setLastLoadDate(selectedDate);
        }
    };

    const onPersonalDateChange = (event: any, selectedDate?: Date) => {
        setShowPersonalDatePicker(false);
        if (selectedDate) {
            setPersonalDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    };

    const handleSave = async () => {
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

        await addSubscription({
            id: Date.now().toString(),
            name,
            price: priceNum,
            currency,
            billingCycle,
            startDate: isoDate,
            category: 'Entertainment',
            image: activeTab === 'popular' ? selectedLogoKey : 'default',
        });

        router.back();
    };

    const handleSaveRent = async () => {
        if (!rentAmount) {
            Alert.alert('Hata', 'Lütfen kira tutarını giriniz.');
            return;
        }

        const priceNum = parseFloat(rentAmount);
        if (isNaN(priceNum)) {
            Alert.alert('Hata', 'Geçerli bir tutar giriniz.');
            return;
        }

        const isoDate = rentDate.toISOString().split('T')[0];

        await addSubscription({
            id: Date.now().toString(),
            name: rentType === 'Ev' ? 'Ev Kirası' : 'Dükkan Kirası',
            price: priceNum,
            currency: 'TL',
            billingCycle: 'Monthly',
            startDate: isoDate,
            category: 'Rent',
            image: 'rent',
        });

        setRentModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSaveBill = async () => {
        const isoDate = billDate.toISOString().split('T')[0];
        let name = 'Fatura';
        if (billType === 'Elektrik') name = 'Elektrik Faturası';
        if (billType === 'Su') name = 'Su Faturası';
        if (billType === 'Doğalgaz') name = 'Doğalgaz Faturası';

        await addSubscription({
            id: Date.now().toString(),
            name: name,
            price: 0,
            currency: 'TL',
            billingCycle: 'Monthly',
            startDate: isoDate,
            category: 'Bills',
            image: 'bills',
        });

        setBillModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSaveBank = async () => {
        const isoDate = bankDate.toISOString().split('T')[0];
        const name = `${selectedBank} - ${bankProductType === 'Card' ? 'Kredi Kartı' : 'Kredi'}`;

        let finalPrice = 0;
        if (bankProductType === 'Loan') {
            if (!loanAmount) {
                Alert.alert('Hata', 'Lütfen taksit tutarını giriniz.');
                return;
            }
            finalPrice = parseFloat(loanAmount);
            if (isNaN(finalPrice)) {
                Alert.alert('Hata', 'Geçerli bir tutar giriniz.');
                return;
            }
        }

        await addSubscription({
            id: Date.now().toString(),
            name: name,
            price: finalPrice,
            currency: 'TL',
            billingCycle: 'Monthly',
            startDate: isoDate,
            category: 'Bank',
            image: 'bank',
        });

        setBankModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSaveTransport = async () => {
        if (!transportPrice) {
            Alert.alert('Hata', 'Lütfen abonman ücretini giriniz.');
            return;
        }

        const priceNum = parseFloat(transportPrice);
        if (isNaN(priceNum)) {
            Alert.alert('Hata', 'Geçerli bir tutar giriniz.');
            return;
        }

        const isoDate = lastLoadDate.toISOString().split('T')[0];

        await addSubscription({
            id: Date.now().toString(),
            name: 'Ulaşım Kartı',
            price: priceNum,
            currency: 'TL',
            billingCycle: 'Monthly',
            startDate: isoDate,
            category: 'Transport',
            image: 'bus',
        });

        setTransportModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const onEduDateChange = (event: any, selectedDate?: Date) => {
        setShowEduDatePicker(false);
        if (selectedDate) {
            setEduDate(selectedDate);
        }
    };

    const handleSaveEducation = async () => {
        if (!eduName || !eduPrice) {
            Alert.alert('Hata', 'Lütfen kurum/kişi adı ve tutar giriniz.');
            return;
        }

        const priceNum = parseFloat(eduPrice);
        if (isNaN(priceNum)) {
            Alert.alert('Hata', 'Geçerli bir tutar giriniz.');
            return;
        }

        let durationNum: number | undefined = undefined;
        if (hasEduDuration && eduDuration) {
            durationNum = parseInt(eduDuration);
            if (isNaN(durationNum) || durationNum <= 0) {
                Alert.alert('Hata', 'Geçerli bir vade süresi giriniz.');
                return;
            }
        }

        const isoDate = eduDate.toISOString().split('T')[0];

        let typeLabel = '';
        switch (eduType) {
            case 'School': typeLabel = 'Okul Taksidi'; break;
            case 'Bus': typeLabel = 'Servis'; break;
            case 'Food': typeLabel = 'Yemek'; break;
            case 'PrivateLesson': typeLabel = 'Özel Ders'; break;
            case 'Course': typeLabel = 'Kurs/Aktivite'; break;
            case 'Other': typeLabel = 'Diğer'; break;
        }

        await addSubscription({
            id: Date.now().toString(),
            name: `${eduName} - ${typeLabel}`,
            price: priceNum,
            currency: 'TL',
            billingCycle: eduCycle,
            startDate: isoDate,
            category: 'Education',
            image: 'education',
            duration: durationNum,
        });

        setEducationModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSavePersonal = async () => {
        if (!personalName || !personalPrice) {
            Alert.alert('Hata', 'Lütfen ödeme yeri ve tutar giriniz.');
            return;
        }

        const priceNum = parseFloat(personalPrice);
        if (isNaN(priceNum)) {
            Alert.alert('Hata', 'Geçerli bir tutar giriniz.');
            return;
        }

        const isoDate = personalDate.toISOString().split('T')[0];

        let durationNum: number | undefined = undefined;
        if (hasDuration && duration) {
            durationNum = parseInt(duration);
            if (isNaN(durationNum) || durationNum <= 0) {
                Alert.alert('Hata', 'Geçerli bir vade süresi giriniz.');
                return;
            }
        }

        await addSubscription({
            id: Date.now().toString(),
            name: personalName,
            price: priceNum,
            currency: 'TL',
            billingCycle: personalCycle,
            startDate: isoDate,
            category: 'Personal',
            image: 'personal',
            duration: durationNum,
        });

        setPersonalModalVisible(false);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <View className="flex-1 bg-gray-50 relative">
            {/* Tabs */}
            <View className="flex-row p-4 pb-0">
                <TouchableOpacity
                    onPress={() => {
                        setActiveTab('popular');
                        setShowForm(false);
                    }}
                    className={clsx(
                        'flex-1 py-3 items-center border-b-2',
                        activeTab === 'popular' ? 'border-blue-600' : 'border-transparent'
                    )}
                >
                    <Text className={clsx('font-bold', activeTab === 'popular' ? 'text-blue-600' : 'text-gray-500')}>
                        Popüler Servisler
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setActiveTab('other');
                        setShowForm(false);
                    }}
                    className={clsx(
                        'flex-1 py-3 items-center border-b-2',
                        activeTab === 'other' ? 'border-blue-600' : 'border-transparent'
                    )}
                >
                    <Text className={clsx('font-bold', activeTab === 'other' ? 'text-blue-600' : 'text-gray-500')}>
                        Diğer Servisler
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Popular Services Grid */}
                {activeTab === 'popular' && !showForm && (
                    <View className="flex-row flex-wrap justify-start gap-x-[4%] gap-y-4 mb-6">
                        {POPULAR_SERVICES.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() => handleServiceSelect(service)}
                                className={clsx(
                                    'w-[22%] aspect-square rounded-3xl items-center justify-center bg-white border border-gray-200 shadow-sm overflow-hidden'
                                )}
                            >
                                <Image
                                    source={LOGO_MAP[service.logoKey]}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Other Services Grid */}
                {activeTab === 'other' && !showForm && (
                    <View className="flex-row flex-wrap justify-between mb-6">
                        {OTHER_SERVICES.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() => handleOtherServiceSelect(service)}
                                className={clsx(
                                    'w-[30%] aspect-square mb-4 rounded-xl items-center justify-center bg-white border border-gray-200 shadow-sm'
                                )}
                            >
                                <Image
                                    source={LOGO_MAP[service.logoKey]}
                                    className="w-12 h-12 mb-2"
                                    resizeMode="contain"
                                />
                                <Text className="text-gray-900 text-xs font-medium text-center">{service.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Form - Only for Popular Tab */}
                {activeTab === 'popular' && showForm && (
                    <>
                        <TouchableOpacity
                            onPress={handleBackToSelection}
                            className="mb-4 flex-row items-center"
                        >
                            <Text className="text-blue-600 font-medium">← Farklı Servis Seç</Text>
                        </TouchableOpacity>

                        {name && (
                            <View className="mb-6 items-center">
                                <View className="w-24 h-24 rounded-3xl bg-white border border-gray-200 shadow-sm items-center justify-center overflow-hidden mb-4">
                                    <Image
                                        source={LOGO_MAP[selectedLogoKey]}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text className="text-gray-900 text-2xl font-bold">{name}</Text>
                            </View>
                        )}

                        <View className="mb-6">
                            <Text className="text-gray-500 mb-2">Tutar</Text>
                            <View className="flex-row gap-2">
                                <TextInput
                                    className="flex-1 bg-white text-gray-900 p-4 rounded-lg text-xl font-bold border border-gray-200"
                                    placeholder="0.00"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={(text) => {
                                        if (/^\d*\.?\d*$/.test(text)) {
                                            setPrice(text);
                                        }
                                    }}
                                />
                                <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                                    {(['TL', 'USD', 'EUR'] as Currency[]).map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            onPress={() => setCurrency(c)}
                                            className={clsx(
                                                'px-4 justify-center rounded-md',
                                                currency === c ? 'bg-gray-100' : 'bg-transparent'
                                            )}
                                        >
                                            <Text className={clsx('font-bold', currency === c ? 'text-gray-900' : 'text-gray-500')}>
                                                {c}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-500 mb-2">Ödeme Döngüsü</Text>
                            <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                                {(['Monthly', 'Yearly'] as Cycle[]).map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setBillingCycle(c)}
                                        className={clsx(
                                            'flex-1 py-3 items-center rounded-md',
                                            billingCycle === c ? 'bg-gray-100' : 'bg-transparent'
                                        )}
                                    >
                                        <Text className={clsx('font-medium', billingCycle === c ? 'text-gray-900' : 'text-gray-500')}>
                                            {c === 'Monthly' ? 'Aylık' : 'Yıllık'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

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

                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-xl items-center active:bg-blue-700 mb-10 shadow-sm"
                            onPress={handleSave}
                        >
                            <Text className="text-white font-bold text-lg">Kaydet</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Rent Modal Overlay */}
            {rentModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[70%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Kira Ekle</Text>
                            <TouchableOpacity onPress={() => setRentModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("Switching to Ev");
                                        setRentType('Ev');
                                    }}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        rentType === 'Ev' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', rentType === 'Ev' ? 'text-gray-900' : 'text-gray-500')}>
                                        🏠 Ev Kirası
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("Switching to Dükkan");
                                        setRentType('Dükkan');
                                    }}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        rentType === 'Dükkan' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', rentType === 'Dükkan' ? 'text-gray-900' : 'text-gray-500')}>
                                        🏢 Dükkan Kirası
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">Tutar (TL)</Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                    placeholder="0"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={rentAmount}
                                    onChangeText={setRentAmount}
                                />
                            </View>

                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Ödeme Günü</Text>
                                <TouchableOpacity
                                    onPress={() => setShowRentDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        Her ayın {rentDate.getDate()}'i
                                    </Text>
                                </TouchableOpacity>
                                {showRentDatePicker && (
                                    <DateTimePicker
                                        value={rentDate}
                                        mode="date"
                                        display="default"
                                        onChange={onRentDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSaveRent}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setRentModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Bills Modal Overlay */}
            {billModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[70%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Fatura Takibi Ekle</Text>
                            <TouchableOpacity onPress={() => setBillModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-6 bg-gray-100 p-2 rounded-xl">
                                {(['Elektrik', 'Su', 'Doğalgaz'] as const).map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setBillType(type)}
                                        className={clsx(
                                            'py-3 px-4 rounded-lg mb-1 flex-row items-center',
                                            billType === type ? 'bg-white' : 'bg-transparent'
                                        )}
                                    >
                                        <Text className="text-xl mr-3">
                                            {type === 'Elektrik' ? '⚡' : type === 'Su' ? '💧' : '🔥'}
                                        </Text>
                                        <Text className={clsx('font-bold text-lg', billType === type ? 'text-gray-900' : 'text-gray-500')}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <Text className="text-blue-800 text-sm">
                                    ℹ️ Fatura tutarları değişken olduğu için tutar girilmez. Sadece tarih hatırlatılır.
                                </Text>
                            </View>

                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Son Ödeme Günü</Text>
                                <TouchableOpacity
                                    onPress={() => setShowBillDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        Her ayın {billDate.getDate()}'i
                                    </Text>
                                </TouchableOpacity>
                                {showBillDatePicker && (
                                    <DateTimePicker
                                        value={billDate}
                                        mode="date"
                                        display="default"
                                        onChange={onBillDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSaveBill}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setBillModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Bank Modal Overlay */}
            {bankModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[85%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Banka/Kredi Ekle</Text>
                            <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Type Selection */}
                            <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
                                <TouchableOpacity
                                    onPress={() => setBankProductType('Card')}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        bankProductType === 'Card' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', bankProductType === 'Card' ? 'text-gray-900' : 'text-gray-500')}>
                                        💳 Kredi Kartı
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setBankProductType('Loan')}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        bankProductType === 'Loan' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', bankProductType === 'Loan' ? 'text-gray-900' : 'text-gray-500')}>
                                        💰 Kredi Borcu
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bank Selection Dropdown */}
                            <Text className="text-gray-500 mb-2">Banka Seçimi</Text>
                            <View className="mb-6 z-50">
                                <TouchableOpacity
                                    onPress={() => setIsBankListOpen(!isBankListOpen)}
                                    className="bg-white border border-gray-200 p-4 rounded-xl flex-row justify-between items-center"
                                >
                                    <Text className="text-gray-900 text-lg font-medium">{selectedBank}</Text>
                                    <Text className="text-gray-500">▼</Text>
                                </TouchableOpacity>

                                {isBankListOpen && (
                                    <View className="bg-white border border-gray-200 rounded-xl mt-2 max-h-60">
                                        <ScrollView nestedScrollEnabled={true} className="max-h-60">
                                            {BANKS.map((bank, index) => (
                                                <TouchableOpacity
                                                    key={bank}
                                                    onPress={() => {
                                                        setSelectedBank(bank);
                                                        setIsBankListOpen(false);
                                                    }}
                                                    className={clsx(
                                                        'p-4 border-b border-gray-100',
                                                        index === BANKS.length - 1 ? 'border-b-0' : ''
                                                    )}
                                                >
                                                    <Text className={clsx(
                                                        'text-lg',
                                                        selectedBank === bank ? 'text-blue-600 font-bold' : 'text-gray-900'
                                                    )}>
                                                        {bank}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Conditional Input */}
                            {bankProductType === 'Loan' ? (
                                <View className="mb-6">
                                    <Text className="text-gray-500 mb-2">Taksit Tutarı (TL)</Text>
                                    <TextInput
                                        className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                        placeholder="0"
                                        placeholderTextColor="#ccc"
                                        keyboardType="numeric"
                                        value={loanAmount}
                                        onChangeText={setLoanAmount}
                                    />
                                </View>
                            ) : (
                                <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <Text className="text-blue-800 text-sm">
                                        ℹ️ Ekstre tutarı değişken olduğu için sadece tarih hatırlatılır.
                                    </Text>
                                </View>
                            )}

                            {/* Date Selection */}
                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Son Ödeme Günü</Text>
                                <TouchableOpacity
                                    onPress={() => setShowBankDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        Her ayın {bankDate.getDate()}'i
                                    </Text>
                                </TouchableOpacity>
                                {showBankDatePicker && (
                                    <DateTimePicker
                                        value={bankDate}
                                        mode="date"
                                        display="default"
                                        onChange={onBankDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            {/* Buttons */}
                            <View className="gap-3 mb-6">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSaveBank}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setBankModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Transport Modal Overlay */}
            {transportModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[60%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Ulaşım Kartı / Abonman</Text>
                            <TouchableOpacity onPress={() => setTransportModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <Text className="text-blue-800 text-sm">
                                    ℹ️ Aylık abonman ücretini ve en son yükleme yaptığınız tarihi girin. Uygulama her ay hatırlatacak.
                                </Text>
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">Aylık Tutar (TL)</Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                    placeholder="0"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={transportPrice}
                                    onChangeText={setTransportPrice}
                                />
                            </View>

                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Son Yükleme Tarihi</Text>
                                <TouchableOpacity
                                    onPress={() => setShowTransportDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        Her ayın {lastLoadDate.getDate()}'i
                                    </Text>
                                </TouchableOpacity>
                                {showTransportDatePicker && (
                                    <DateTimePicker
                                        value={lastLoadDate}
                                        mode="date"
                                        display="default"
                                        onChange={onTransportDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSaveTransport}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setTransportModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Personal Modal Overlay */}
            {personalModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[75%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Kişisel Ödeme Ekle</Text>
                            <TouchableOpacity onPress={() => setPersonalModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">Ödeme Yapılacak Yer / Kişi</Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-lg border border-gray-200"
                                    placeholder="Örn: Harçlık, Aidat vb."
                                    placeholderTextColor="#ccc"
                                    value={personalName}
                                    onChangeText={setPersonalName}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">Tutar (TL)</Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                    placeholder="0"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={personalPrice}
                                    onChangeText={setPersonalPrice}
                                />
                            </View>

                            {/* Cycle Selection */}
                            <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
                                <TouchableOpacity
                                    onPress={() => setPersonalCycle('Monthly')}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        personalCycle === 'Monthly' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', personalCycle === 'Monthly' ? 'text-gray-900' : 'text-gray-500')}>
                                        📅 Aylık
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setPersonalCycle('Weekly')}
                                    className={clsx(
                                        'flex-1 py-3 rounded-lg items-center',
                                        personalCycle === 'Weekly' ? 'bg-white' : 'bg-transparent'
                                    )}
                                >
                                    <Text className={clsx('font-bold', personalCycle === 'Weekly' ? 'text-gray-900' : 'text-gray-500')}>
                                        🔄 Haftalık
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Duration Selection */}
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
                                            {personalCycle === 'Monthly' ? 'Kaç Ay?' : 'Kaç Hafta?'}
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

                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Başlangıç Tarihi</Text>
                                <TouchableOpacity
                                    onPress={() => setShowPersonalDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        {formatDate(personalDate)}
                                    </Text>
                                </TouchableOpacity>
                                {showPersonalDatePicker && (
                                    <DateTimePicker
                                        value={personalDate}
                                        mode="date"
                                        display="default"
                                        onChange={onPersonalDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSavePersonal}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setPersonalModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
            {/* Education Modal Overlay */}
            {educationModalVisible && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[85%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Eğitim Harcaması Ekle</Text>
                            <TouchableOpacity onPress={() => setEducationModalVisible(false)}>
                                <Text className="text-gray-500 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Sub-Category Selection */}
                            <Text className="text-gray-500 mb-2">Harcama Türü</Text>
                            <View className="flex-row flex-wrap justify-between mb-6">
                                {[
                                    { id: 'School', label: 'Okul Taksidi', icon: '🏫' },
                                    { id: 'Bus', label: 'Servis', icon: '🚌' },
                                    { id: 'Food', label: 'Yemek', icon: '🍽️' },
                                    { id: 'PrivateLesson', label: 'Özel Ders', icon: '👨‍🏫' },
                                    { id: 'Course', label: 'Kurs/Aktivite', icon: '🏊' },
                                    { id: 'Other', label: 'Online/Diğer', icon: '💻' },
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => setEduType(item.id as any)}
                                        className={clsx(
                                            'w-[31%] aspect-square mb-3 rounded-xl items-center justify-center border',
                                            eduType === item.id ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'
                                        )}
                                    >
                                        <Text className="text-3xl mb-1">{item.icon}</Text>
                                        <Text className={clsx(
                                            "text-xs font-medium text-center",
                                            eduType === item.id ? 'text-blue-700' : 'text-gray-600'
                                        )}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">
                                    {eduType === 'School' ? 'Okul Adı' :
                                        eduType === 'Bus' ? 'Servis Firması / Şoför' :
                                            eduType === 'PrivateLesson' ? 'Öğretmen Adı' : 'Kurum / Kişi Adı'}
                                </Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-lg border border-gray-200"
                                    placeholder="Örn: Doğa Koleji"
                                    placeholderTextColor="#ccc"
                                    value={eduName}
                                    onChangeText={setEduName}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-500 mb-2">Tutar (TL)</Text>
                                <TextInput
                                    className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                    placeholder="0"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={eduPrice}
                                    onChangeText={setEduPrice}
                                />
                            </View>

                            {/* Cycle Selection */}
                            <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
                                {(['Monthly', 'Weekly', 'Yearly'] as const).map((cycle) => (
                                    <TouchableOpacity
                                        key={cycle}
                                        onPress={() => setEduCycle(cycle)}
                                        className={clsx(
                                            'flex-1 py-3 rounded-lg items-center',
                                            eduCycle === cycle ? 'bg-white' : 'bg-transparent'
                                        )}
                                    >
                                        <Text className={clsx('font-bold text-xs', eduCycle === cycle ? 'text-gray-900' : 'text-gray-500')}>
                                            {cycle === 'Monthly' ? 'Aylık' : cycle === 'Weekly' ? 'Haftalık' : 'Yıllık'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Duration Selection */}
                            <View className="mb-6">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-500">Belirli bir süresi var mı?</Text>
                                    <TouchableOpacity
                                        onPress={() => setHasEduDuration(!hasEduDuration)}
                                        className={clsx(
                                            'w-12 h-7 rounded-full justify-center px-1',
                                            hasEduDuration ? 'bg-blue-600' : 'bg-gray-300'
                                        )}
                                    >
                                        <View className={clsx(
                                            'w-5 h-5 rounded-full bg-white shadow-sm',
                                            hasEduDuration ? 'self-end' : 'self-start'
                                        )} />
                                    </TouchableOpacity>
                                </View>

                                {hasEduDuration && (
                                    <View>
                                        <Text className="text-gray-500 mb-2">
                                            {eduCycle === 'Monthly' ? 'Kaç Ay?' : eduCycle === 'Weekly' ? 'Kaç Hafta?' : 'Kaç Yıl?'}
                                        </Text>
                                        <TextInput
                                            className="bg-gray-50 text-gray-900 p-4 rounded-xl text-2xl font-bold border border-gray-200"
                                            placeholder="Örn: 9"
                                            placeholderTextColor="#ccc"
                                            keyboardType="numeric"
                                            value={eduDuration}
                                            onChangeText={(text) => {
                                                if (/^\d*$/.test(text)) {
                                                    setEduDuration(text);
                                                }
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            <View className="mb-8">
                                <Text className="text-gray-500 mb-2">Ödeme Günü</Text>
                                <TouchableOpacity
                                    onPress={() => setShowEduDatePicker(true)}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                >
                                    <Text className="text-gray-900 text-lg">
                                        {formatDate(eduDate)}
                                    </Text>
                                </TouchableOpacity>
                                {showEduDatePicker && (
                                    <DateTimePicker
                                        value={eduDate}
                                        mode="date"
                                        display="default"
                                        onChange={onEduDateChange}
                                        maximumDate={new Date(2030, 11, 31)}
                                        minimumDate={new Date(2020, 0, 1)}
                                    />
                                )}
                            </View>

                            <View className="gap-3 mb-6">
                                <TouchableOpacity
                                    className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200"
                                    onPress={handleSaveEducation}
                                >
                                    <Text className="text-white font-bold text-lg">Kaydet</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 p-4 rounded-xl items-center"
                                    onPress={() => setEducationModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-bold text-lg">İptal</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}
