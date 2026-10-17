import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MapPin, Navigation, Package, ArrowRight, ChevronDown, Check } from 'lucide-react-native';

// Amakuru y'Inzego z'Ubuyobozi bw'u Rwanda (Sample Data)
const RWANDA_DATA = {
  "Kigali City": {
    "Gasabo": {
      "Remera": ["Rukiri I", "Rukiri II", "Nyabisindu"],
      "Kimironko": ["Bibare", "Kibagabaga", "Nyagatovu"],
      "Kacyiru": ["Kamatamu", "Kibaza"]
    },
    "Kicukiro": {
      "Kanombe": ["Kabeza", "Rubirizi", "Karama"],
      "Kicukiro": ["Ngoma", "Kigarama"]
    },
    "Nyarugenge": {
      "Nyamirambo": ["Rwezamenyo", "Tetero", "Kivugiza"],
      "Kiziba": ["City Center", "Nyakabanda"]
    }
  },
  "Amajyaruguru (North)": {
    "Musanze": {
      "Muhoza": ["Ruhengeri", "Kigombe"],
      "Kinigi": ["Kampanga", "Nyonirima"]
    }
  },
  "Ibiyaga / Iburengerazuba (West)": {
    "Rubavu": {
      "Gisenyi": ["Mizingo", "Bugoyi"]
    }
  }
};

export default function PackageDeliveryScreen({ navigation }) {
  // Mode selection: 'SEARCH' cyangwa 'ADMIN_DROPDOWN'
  const [pickupMode, setPickupMode] = useState('SEARCH'); // 'SEARCH' | 'ADMIN'
  const [dropoffMode, setDropoffMode] = useState('SEARCH');

  // Input states yo gushakisha no kuzuza
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');

  // Dropdown states - Pickup
  const [pProvince, setPProvince] = useState('');
  const [pDistrict, setPDistrict] = useState('');
  const [pSector, setPSector] = useState('');
  const [pCell, setPCell] = useState('');
  const [pVillage, setPVillage] = useState('');

  // Dropdown states - Dropoff
  const [dProvince, setDProvince] = useState('');
  const [dDistrict, setDDistrict] = useState('');
  const [dSector, setDSector] = useState('');
  const [dCell, setDCell] = useState('');
  const [dVillage, setDVillage] = useState('');

  // Details y'ipaki
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [packageDetails, setPackageDetails] = useState('');

  // Gutunganya Aho Paki Ivanwa (Final Pickup String)
  const getFinalPickup = () => {
    if (pickupMode === 'SEARCH') return pickupSearch;
    return `${pProvince}, ${pDistrict}, ${pSector}, ${pCell}, ${pVillage}`.replace(/^[,\s]+|[,\s]+$/g, '');
  };

  // Gutunganya Aho Paki Ijya (Final Dropoff String)
  const getFinalDropoff = () => {
    if (dropoffMode === 'SEARCH') return dropoffSearch;
    return `${dProvince}, ${dDistrict}, ${dSector}, ${dCell}, ${dVillage}`.replace(/^[,\s]+|[,\s]+$/g, '');
  };

  const handleProceedToCheckout = () => {
    const finalPickup = getFinalPickup();
    const finalDropoff = getFinalDropoff();

    if (!finalPickup || !finalDropoff || !receiverPhone) {
      Alert.alert("Ikosa", "Nyamuneka uzuze aho paki ivanwa, aho ijya, na telefone y'uwakira!");
      return;
    }

    navigation.navigate('Checkout', {
      amount: 2500,
      orderType: 'Door-to-Door Delivery',
      pickup: finalPickup,
      dropoff: finalDropoff,
      receiverName: receiverName,
      receiverPhone: receiverPhone,
      details: packageDetails
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Ohereza Ipaki (Door-to-Door)</Text>
      <Text style={styles.subtitle}>Hitamo gukoresha GPS, kwandika ahantu, cyangwa guhitamo mu nzego z'ubuyobozi.</Text>

      {/* 1. AHO PAKI IVANWA (PICKUP LOCATION) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin color="#EF4444" size={20} />
          <Text style={styles.cardTitle}>1. Aho Paki Ivanwa (Pickup)</Text>
        </View>

        {/* Mode Selector Buttons */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabBtn, pickupMode === 'SEARCH' && styles.tabActive]}
            onPress={() => setPickupMode('SEARCH')}
          >
            <Text style={[styles.tabText, pickupMode === 'SEARCH' && styles.tabTextActive]}>Kwandika / GPS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, pickupMode === 'ADMIN' && styles.tabActive]}
            onPress={() => setPickupMode('ADMIN')}
          >
            <Text style={[styles.tabText, pickupMode === 'ADMIN' && styles.tabTextActive]}>Hitamo mu Nzego</Text>
          </TouchableOpacity>
        </View>

        {pickupMode === 'SEARCH' ? (
          <View>
            <TouchableOpacity 
              style={styles.gpsBtn} 
              onPress={() => setPickupSearch("Aho mperereye ubu (GPS Current Location)")}
            >
              <Navigation color="#3B82F6" size={16} />
              <Text style={styles.gpsText}>Koresha GPS y'aho uri ubu</Text>
            </TouchableOpacity>
            <TextInput 
              style={styles.input} 
              placeholder="Urugero: Kigali Heights, KG 7 Ave..." 
              value={pickupSearch}
              onChangeText={setPickupSearch}
            />
          </View>
        ) : (
          /* CASCADING DROPDOWN PICKER FOR PICKUP */
          <View style={styles.dropdownBox}>
            <TextInput style={styles.inputSmall} placeholder="Intara (e.g. Kigali City)" value={pProvince} onChangeText={setPProvince} />
            <TextInput style={styles.inputSmall} placeholder="Akarere (e.g. Gasabo)" value={pDistrict} onChangeText={setPDistrict} />
            <TextInput style={styles.inputSmall} placeholder="Umurenge (e.g. Remera)" value={pSector} onChangeText={setPSector} />
            <TextInput style={styles.inputSmall} placeholder="Akagari (e.g. Rukiri I)" value={pCell} onChangeText={setPCell} />
            <TextInput style={styles.inputSmall} placeholder="Umudugudu / Isibo / Inzu" value={pVillage} onChangeText={setPVillage} />
          </View>
        )}
      </View>

      {/* 2. AHO PAKI IJYA (DROPOFF LOCATION) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin color="#10B981" size={20} />
          <Text style={styles.cardTitle}>2. Aho Paki Ijya (Dropoff)</Text>
        </View>

        {/* Mode Selector Buttons */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabBtn, dropoffMode === 'SEARCH' && styles.tabActive]}
            onPress={() => setDropoffMode('SEARCH')}
          >
            <Text style={[styles.tabText, dropoffMode === 'SEARCH' && styles.tabTextActive]}>Kwandika Ahantu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, dropoffMode === 'ADMIN' && styles.tabActive]}
            onPress={() => setDropoffMode('ADMIN')}
          >
            <Text style={[styles.tabText, dropoffMode === 'ADMIN' && styles.tabTextActive]}>Hitamo mu Nzego</Text>
          </TouchableOpacity>
        </View>

        {dropoffMode === 'SEARCH' ? (
          <TextInput 
            style={styles.input} 
            placeholder="Urugero: Nyabugogo Bus Park, KK 15 Rd..." 
            value={dropoffSearch}
            onChangeText={setDropoffSearch}
          />
        ) : (
          /* CASCADING DROPDOWN PICKER FOR DROPOFF */
          <View style={styles.dropdownBox}>
            <TextInput style={styles.inputSmall} placeholder="Intara (e.g. Amajyaruguru)" value={dProvince} onChangeText={setDProvince} />
            <TextInput style={styles.inputSmall} placeholder="Akarere (e.g. Musanze)" value={dDistrict} onChangeText={setDDistrict} />
            <TextInput style={styles.inputSmall} placeholder="Umurenge (e.g. Muhoza)" value={dSector} onChangeText={setDSector} />
            <TextInput style={styles.inputSmall} placeholder="Akagari" value={dCell} onChangeText={setDCell} />
            <TextInput style={styles.inputSmall} placeholder="Umudugudu / Isibo / Inzu" value={dVillage} onChangeText={setDVillage} />
          </View>
        )}

        <Text style={styles.label}>Amakuru y'Uwakira Ipaki:</Text>
        <TextInput style={styles.input} placeholder="Izina ry'Uwakira (Urugero: Alice)" value={receiverName} onChangeText={setReceiverName} />
        <TextInput style={styles.input} placeholder="Nimero ya Telefone y'Uwakira (078...)" keyboardType="phone-pad" value={receiverPhone} onChangeText={setReceiverPhone} />
      </View>

      {/* 3. IBISOBANURO BY'IPAKI */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Package color="#8B5CF6" size={20} />
          <Text style={styles.cardTitle}>3. Ibisobanuro bw'Ipaki</Text>
        </View>
        <TextInput 
          style={[styles.input, { height: 70, textAlignVertical: 'top' }]} 
          placeholder="Ibyuma, impapuro, envelop, igikapu..." 
          multiline
          value={packageDetails}
          onChangeText={setPackageDetails}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleProceedToCheckout}>
        <Text style={styles.submitText}>Komeza Urugero rwa Kwishyura</Text>
        <ArrowRight color="#FFFFFF" size={18} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 18, paddingTop: 45, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 3, marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#FFFFFF', elevation: 1 },
  tabText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#3B82F6', fontWeight: 'bold' },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 10, borderRadius: 8, gap: 6, marginBottom: 10 },
  gpsText: { color: '#3B82F6', fontSize: 12, fontWeight: 'bold' },
  dropdownBox: { gap: 8, marginBottom: 10 },
  inputSmall: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 12, backgroundColor: '#F8FAFC' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 46, fontSize: 13, marginBottom: 10, backgroundColor: '#F8FAFC' },
  submitBtn: { backgroundColor: '#3B82F6', height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 8 },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});