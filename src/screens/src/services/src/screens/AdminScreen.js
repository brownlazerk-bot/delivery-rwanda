import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ShieldAlert, LogOut, Video, UserPlus, CreditCard, Trash2 } from 'lucide-react-native';
import { supabase } from '../services/supabase';

export default function AdminScreen({ navigation }) {
  // States z'abanyamotari
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driversList, setDriversList] = useState([]);

  // States z'Amamatangazo (Ads)
  const [adTitle, setAdTitle] = useState('');
  const [adDesc, setAdDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [adsList, setAdsList] = useState([]);

  // States z'Ubwishyure (Payment Settings)
  const [momoNumber, setMomoNumber] = useState('');
  const [momoCode, setMomoCode] = useState('');
  const [merchantName, setMerchantName] = useState('');

  // Kuzana amakuru yose muri Database
  const fetchData = async () => {
    // Drivers
    const { data: drivers } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    if (drivers) setDriversList(drivers);

    // Ads
    const { data: ads } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
    if (ads) setAdsList(ads);

    // Payment Settings
    const { data: pay } = await supabase.from('payment_settings').select('*').eq('id', 1).single();
    if (pay) {
      setMomoNumber(pay.momo_number);
      setMomoCode(pay.momo_code);
      setMerchantName(pay.merchant_name);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Admin Kuvugurura Nimero y'Ubwishyure (Update Payment Info)
  const handleUpdatePayment = async () => {
    if (!momoNumber || !momoCode || !merchantName) {
      Alert.alert("Ikosa", "Nyamuneka yuzuza amakuru yose y'ubwishyure!");
      return;
    }

    const { error } = await supabase
      .from('payment_settings')
      .upsert({ id: 1, momo_number: momoNumber, momo_code: momoCode, merchant_name: merchantName });

    if (error) {
      Alert.alert("Ikosa", "Ntibyakunze kuvugurura amakuru y'ubwishyure!");
    } else {
      Alert.alert("Byagenze Neza", "Amakuru y'ubwishyure yavuguruwe neza kuri App y'abakiriya!");
      fetchData();
    }
  };

  // Admin Kongeraho Rider
  const handleAddDriver = async () => {
    if (!fullName || !phone || !plateNumber) {
      Alert.alert("Ikosa", "Nyamuneka yuzuza amakuru yose ya Rider!");
      return;
    }

    const generatedCode = 'YK-' + Math.floor(1000 + Math.random() * 9000);

    const { error } = await supabase.from('drivers').insert([
      { full_name: fullName, phone: phone, plate_number: plateNumber, rider_code: generatedCode, status: 'AVAILABLE' }
    ]);

    if (error) {
      Alert.alert("Ikosa", "Iyi telefone cyangwa plaque yaranditswe!");
    } else {
      Alert.alert("Byagenze Neza", `Rider yongeweho! Code: ${generatedCode}`);
      setFullName(''); setPhone(''); setPlateNumber('');
      fetchData();
    }
  };

  // Admin Kongeraho Video y'Itangazo
  const handleAddAd = async () => {
    if (!adTitle || !videoUrl) {
      Alert.alert("Ikosa", "Shyiramo umutwe w'itangazo no link ya video!");
      return;
    }

    const { error } = await supabase.from('advertisements').insert([
      { title: adTitle, description: adDesc, video_url: videoUrl, is_active: true }
    ]);

    if (error) {
      Alert.alert("Ikosa", "Ntibyakunze gushyiramo itangazo!");
    } else {
      Alert.alert("Byagenze Neza", "Video y'itangazo yaguzwe neza!");
      setAdTitle(''); setAdDesc(''); setVideoUrl('');
      fetchData();
    }
  };

  const handleDeleteAd = async (id) => {
    await supabase.from('advertisements').delete().eq('id', id);
    fetchData();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleArea}>
          <ShieldAlert color="#EF4444" size={28} />
          <Text style={styles.title}>Admin Control Panel</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Auth')}>
          <LogOut color="#EF4444" size={16} />
          <Text style={styles.logoutText}>Sohoka</Text>
        </TouchableOpacity>
      </View>

      {/* 1. AGACE K'UBWISHYURE (PAYMENT SETTINGS MANAGER) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <CreditCard color="#10B981" size={20} />
          <Text style={styles.cardTitle}>Guhindura Nimero y'Ubwishyure (MoMo Pay)</Text>
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="Izina ry'Ikigo (Urugero: Yuskar Delivery Ltd)" 
          value={merchantName}
          onChangeText={setMerchantName}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Nimero ya MoMo (Urugero: 0780000000)" 
          keyboardType="phone-pad"
          value={momoNumber}
          onChangeText={setMomoNumber}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Code ya MoMo Pay (Urugero: *182*8*1*0780000000#)" 
          value={momoCode}
          onChangeText={setMomoCode}
        />

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#10B981' }]} onPress={handleUpdatePayment}>
          <Text style={styles.submitText}>Bika Amakuru y'Ubwishyure</Text>
        </TouchableOpacity>
      </View>

      {/* 2. AGACE K'AMAMATANGAZO (VIDEO ADS MANAGER) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Video color="#8B5CF6" size={20} />
          <Text style={styles.cardTitle}>Gushyiramo Video y'Itangazo (Video Ad)</Text>
        </View>

        <TextInput style={styles.input} placeholder="Umutwe w'Itangazo" value={adTitle} onChangeText={setAdTitle} />
        <TextInput style={styles.input} placeholder="Ibisobanuro mu magambo make..." value={adDesc} onChangeText={setAdDesc} />
        <TextInput style={styles.input} placeholder="Link ya Video (Direct MP4 URL)" value={videoUrl} onChangeText={setVideoUrl} />

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#8B5CF6' }]} onPress={handleAddAd}>
          <Text style={styles.submitText}>Tangaza Video Kuri Client App</Text>
        </TouchableOpacity>
      </View>

      {/* 3. FORM YO KONGERAHO RIDER */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <UserPlus color="#3B82F6" size={20} />
          <Text style={styles.cardTitle}>Ongeraho Rider Mushya</Text>
        </View>

        <TextInput style={styles.input} placeholder="Amazina yombi" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Nimero ya Telefone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Plaque ya Moto" value={plateNumber} onChangeText={setPlateNumber} />

        <TouchableOpacity style={styles.submitBtn} onPress={handleAddDriver}>
          <Text style={styles.submitText}>Kora Rider ID Code & Emeza</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 18, paddingTop: 40, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitleArea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 13, marginBottom: 10, backgroundColor: '#F8FAFC' },
  submitBtn: { backgroundColor: '#3B82F6', height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#FCA5A5', gap: 4 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 12 }
});