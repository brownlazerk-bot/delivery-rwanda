import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { CreditCard, Phone, CheckCircle2 } from 'lucide-react-native';

export default function CheckoutScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');

  const handleConfirmOrder = () => {
    if (!phoneNumber) {
      Alert.alert("Ikosa", "Banza wandike nimero ya telefone yo kwishyiraho!");
      return;
    }
    Alert.alert(
      "Byagenze Neza! 🎉", 
      "Commande yawe yakiriwe na Yuskar Delivery. Shoferi agiye kugenda!",
      [{ text: "OK", onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Genzura no Kwishyura (Checkout)</Text>

      {/* Summary Box */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Incamake ya Commande</Text>
        <View style={styles.row}>
          <Text style={styles.itemText}>Igiteranyo cy'ibyo uguze</Text>
          <Text style={styles.priceText}>6,000 RWF</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemText}>Amafaranga y'Ubutumwa (Delivery)</Text>
          <Text style={styles.priceText}>1,500 RWF</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Amafaranga Yose hamwe</Text>
          <Text style={styles.totalPrice}>7,500 RWF</Text>
        </View>
      </View>

      {/* Payment Options */}
      <Text style={styles.sectionTitle}>Hitamo Uburyo bwo Kwishyura</Text>
      
      <TouchableOpacity 
        style={[styles.payOption, paymentMethod === 'momo' && styles.activePay]}
        onPress={() => setPaymentMethod('momo')}
      >
        <Phone color={paymentMethod === 'momo' ? '#3B82F6' : '#64748B'} size={24} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.payTitle}>MTN Mobile Money / Airtel Money</Text>
          <Text style={styles.paySub}>Kwishyura ukoresha telefone yawe</Text>
        </View>
      </TouchableOpacity>

      {/* Phone Number Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nimero ya Telefone yo Kwishyuriraho</Text>
        <TextInput 
          style={styles.input}
          placeholder="078... / 073..."
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.btn} onPress={handleConfirmOrder}>
        <CheckCircle2 color="#FFFFFF" size={20} />
        <Text style={styles.btnText}>Emeza Commande (Place Order)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  summaryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemText: { fontSize: 14, color: '#64748B' },
  priceText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 4 },
  totalText: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  payOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  activePay: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  payTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  paySub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, height: 50, backgroundColor: '#FFFFFF', fontSize: 15 },
  btn: { backgroundColor: '#10B981', height: 52, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});