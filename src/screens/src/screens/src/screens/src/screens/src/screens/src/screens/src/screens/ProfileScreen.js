import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { User, Clock, ChevronRight, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const history = [
    { id: '1', title: 'Yuskar Grand Hotel (Brochette)', price: '4,500 RWF', date: 'Yitariki 15 Oct', status: 'Byatwawe' },
    { id: '2', title: 'Ohereza Ipaki (Remera - Town)', price: '2,000 RWF', date: 'Yitariki 12 Oct', status: 'Byatwawe' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User color="#3B82F6" size={36} />
        </View>
        <Text style={styles.userName}>Yuskar Client</Text>
        <Text style={styles.userPhone}>+250 780 000 000</Text>
      </View>

      {/* History Section */}
      <Text style={styles.sectionTitle}>Amateka ya Commande (History)</Text>
      
      {history.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Clock color="#64748B" size={18} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyDate}>{item.date} • <Text style={{color: '#10B981'}}>{item.status}</Text></Text>
            </View>
            <Text style={styles.historyPrice}>{item.price}</Text>
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <LogOut color="#EF4444" size={20} />
        <Text style={styles.logoutText}>Gusohoka (Log Out)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20, paddingTop: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  userPhone: { fontSize: 14, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  historyCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  historyDate: { fontSize: 12, color: '#64748B', marginTop: 4 },
  historyPrice: { fontSize: 14, fontWeight: 'bold', color: '#3B82F6' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginTop: 20, gap: 8 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 }
});