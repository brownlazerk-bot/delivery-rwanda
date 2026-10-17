import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { CreditCard, ShieldCheck, Smartphone, ArrowLeft, Banknote } from 'lucide-react-native';
import { supabase } from '../services/supabase';
import FullScreenAdModal from '../components/FullScreenAdModal';

export default function CheckoutScreen({ route, navigation }) {
  const { 
    amount = 2500, 
    orderType = 'Door-to-Door Delivery', 
    pickup = 'Remera, Gasabo, Kigali', 
    dropoff = 'Kigali Heights, Kacyiru',
    receiverName = '',
    receiverPhone = '',
    details = ''
  } = route.params || {};

  const [phone, setPhone] = useState('');
  const [paymentType, setPaymentType] = useState('MOMO_MANUAL'); // 'MOMO_MANUAL' | 'CASH_ON_DELIVERY'
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adData, setAdData] = useState(null);

  // Amakuru y'Ubwishyure aturuka kuri Admin
  const [paymentSettings, setPaymentSettings] = useState({
    momo_number: '0780000000',
    momo_code: '*182*8*1*0780000000#',
    merchant_name: 'Yuskar Delivery Ltd'
  });

  useEffect(() => {
    // 1. Kuzana amamatangazo
    const fetchAd = async () => {
      try {
        const { data } = await supabase
          .from('advertisements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          setAdData(data[0]);
        }
      } catch (e) {
        console.log("Error fetching ads:", e);
      }
    };

    // 2. Kuzana amakuru y'Ubwishyure yavuguruwe na Admin
    const fetchPaymentSettings = async () => {
      try {
        const { data } = await supabase
          .from('payment_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (data) {
          setPaymentSettings(data);
        }
      } catch (e) {
        console.log("Payment settings not found, using default.");
      }
    };

    fetchAd();
    fetchPaymentSettings();
  }, []);

  const handlePaymentSubmit = () => {
    if (paymentType === 'MOMO_MANUAL' && (!phone || !transactionId)) {
      Alert.alert("Ikosa", "Nyamuneka shyiramo nimero yawe ya MoMo na Transaction ID y'ubwishyure!");
      return;
    }

    setLoading(true);

    // Niba hari video y'itangazo, yuzure screen mbere yo kurangiza order
    if (adData) {
      setLoading(false);
      setShowAd(true);
    } else {
      finishCheckout();
    }
  };

  const finishCheckout = async () => {
    setShowAd(false);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            client_name: 'Umukiriya',
            order_type: orderType,
            pickup_location: pickup,
            dropoff_location: dropoff,
            amount: amount,
            status: 'PENDING',
            details: `Uwakira: ${receiverName} (${receiverPhone}) | Ibisobanuro: ${details} | Ubwishyure: ${paymentType === 'MOMO_MANUAL' ? 'MoMo TX: ' + transactionId : 'Cash on Delivery'}`
          }
        ])
        .select();

      setLoading(false);

      if (error) {
        Alert.alert("Ikosa", "Ntibyakunze kwoherereza commande. Ongera ugerageze!");
      } else {
        Alert.alert("Byagenze Neza! 🎉", "Commande yawe yakiriwe neza muri Yuskar Delivery. Shoferi araje mu kanya!");
        navigation.replace('Tracking', { orderId: data ? data[0]?.id : null });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Ikosa", "Habaye shingiro mu kwoherereza data.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#0F172A" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kwisera & Kwishyura</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Inshamake ya Commande</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ubwoko bw'Ikurwa:</Text>
          <Text style={styles.summaryVal}>{orderType}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Aho Paki Ivanwa:</Text>
          <Text style={styles.summaryVal} numberOfLines={1}>{pickup}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Aho Paki Ijya:</Text>
          <Text style={styles.summaryVal} numberOfLines={1}>{dropoff}</Text>
        </View>

        {receiverPhone ? (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Uwakira Ipaki:</Text>
            <Text style={styles.summaryVal}>{receiverName} ({receiverPhone})</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Mwayo Yose (Total):</Text>
          <Text style={styles.totalVal}>{amount} RWF</Text>
        </View>
      </View>

      {/* Hitamo Uburyo bw'Ubwishyure */}
      <Text style={styles.sectionTitle}>Hitamo Uburyo bw'Ubwishyure</Text>
      
      <View style={styles.methodContainer}>
        <TouchableOpacity 
          style={[styles.methodBtn, paymentType === 'MOMO_MANUAL' && styles.methodActive]}
          onPress={() => setPaymentType('MOMO_MANUAL')}
        >
          <Smartphone color={paymentType === 'MOMO_MANUAL' ? '#3B82F6' : '#64748B'} size={22} />
          <Text style={[styles.methodText, paymentType === 'MOMO_MANUAL' && styles.methodTextActive]}>
            Mobile Money (MoMo)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodBtn, paymentType === 'CASH_ON_DELIVERY' && styles.methodActive]}
          onPress={() => setPaymentType('CASH_ON_DELIVERY')}
        >
          <Banknote color={paymentType === 'CASH_ON_DELIVERY' ? '#3B82F6' : '#64748B'} size={22} />
          <Text style={[styles.methodText, paymentType === 'CASH_ON_DELIVERY' && styles.methodTextActive]}>
            Kwishyura Iyo Bagezeho
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs niba hitamo Mobile Money */}
      {paymentType === 'MOMO_MANUAL' && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>📌 Amabwiriza y'Ubwishyure bwa MoMo:</Text>
          <Text style={styles.instructionsText}>
            1. Ohereza <Text style={styles.boldText}>{amount} RWF</Text> kuri MoMo Code: <Text style={styles.boldText}>{paymentSettings.momo_code}</Text> cyangwa Send Money kuri nimero <Text style={styles.boldText}>{paymentSettings.momo_number} ({paymentSettings.merchant_name})</Text>.{'\n'}
            2. Wandike nimero yakoreshejwe n'Icode ya Transaction (ID) yaje muri SMS yo kwishyura.
          </Text>

          <Text style={styles.inputLabel}>Nimero ya Telefone Wishyuriyeho</Text>
          <TextInput 
            style={styles.input} 
            placeholder="078... / 072... / 073..." 
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Transaction ID (Urugero: 28491032)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Shyiramo Transaction ID..." 
            value={transactionId}
            onChangeText={setTransactionId}
          />
        </View>
      )}

      {/* Button yo Kwishyura no Oherereza Commande */}
      <TouchableOpacity 
        style={[styles.payBtn, loading && { backgroundColor: '#93C5FD' }]} 
        onPress={handlePaymentSubmit}
        disabled={loading}
      >
        <ShieldCheck color="#FFFFFF" size={20} />
        <Text style={styles.payText}>
          {loading ? 'Biramaze kwemezwa...' : `Emeza & Oherereza Commande (${amount} RWF)`}
        </Text>
      </TouchableOpacity>

      {/* FULL SCREEN VIDEO AD MODAL */}
      <FullScreenAdModal 
        visible={showAd} 
        adData={adData} 
        onClose={finishCheckout} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 18, paddingTop: 45, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  summaryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, elevation: 1 },
  summaryTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, gap: 8 },
  summaryLabel: { fontSize: 13, color: '#64748B' },
  summaryVal: { fontSize: 13, fontWeight: '600', color: '#0F172A', flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  totalVal: { fontSize: 17, fontWeight: 'bold', color: '#10B981' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  methodContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  methodBtn: { flex: 1, padding: 14, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFFFFF', gap: 6 },
  methodActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  methodText: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center' },
  methodTextActive: { color: '#3B82F6', fontWeight: 'bold' },
  instructionsBox: { backgroundColor: '#FEF3C7', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FCD34D', marginBottom: 20 },
  instructionsTitle: { fontWeight: 'bold', color: '#92400E', fontSize: 13, marginBottom: 6 },
  instructionsText: { fontSize: 12, color: '#78350F', lineHeight: 18, marginBottom: 14 },
  boldText: { fontWeight: 'bold', color: '#000000' },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#78350F', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 13, marginBottom: 10, backgroundColor: '#FFFFFF' },
  payBtn: { backgroundColor: '#3B82F6', height: 52, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
  payText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});