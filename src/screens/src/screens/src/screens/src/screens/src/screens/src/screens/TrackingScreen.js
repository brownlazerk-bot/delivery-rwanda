import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Bike, PhoneCall, ShieldCheck, MapPin } from 'lucide-react-native';

export default function TrackingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Simulation ya Map */}
      <View style={styles.mapContainer}>
        <View style={styles.simulatedMap}>
          <Bike color="#3B82F6" size={48} />
          <Text style={styles.mapText}>Shoferi ari mu nzira... (Arakwegera)</Text>
        </View>
      </View>

      {/* Driver Info Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.driverName}>Jean Bosco</Text>
            <Text style={styles.bikeInfo}>Moto: RA 456 B • Yamaha</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <PhoneCall color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusBox}>
          <MapPin color="#10B981" size={20} />
          <Text style={styles.statusText}>Asigaje iminota 5 ngo akugereho</Text>
        </View>

        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeBtnText}>Subira Ahatangirira (Home)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2E8F0' },
  simulatedMap: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  mapText: { fontSize: 15, fontWeight: '600', color: '#475569' },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  driverName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  bikeInfo: { fontSize: 13, color: '#64748B', marginTop: 2 },
  callBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 50 },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 16, gap: 10 },
  statusText: { fontSize: 14, fontWeight: '500', color: '#334155' },
  homeBtn: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});