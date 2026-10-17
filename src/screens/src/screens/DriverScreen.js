import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, FlatList, Switch } from 'react-native';
import { Bike, CheckCircle, Clock, MapPin, Phone, ShieldCheck, Navigation, LogOut } from 'lucide-react-native';
import { supabase } from '../services/supabase';

export default function DriverScreen({ route, navigation }) {
  // Amakuru aturuka muri AuthScreen biyandikishijemo/binjiriyeho
  const { driverId, driverName, riderCode } = route.params || { 
    driverId: '1', 
    driverName: 'Jean Bosco', 
    riderCode: 'YK-1001' 
  };

  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState([]);
  const [myTrip, setMyTrip] = useState(null);

  // Kuzana ama-orders yose akeneye shoferi muri Supabase
  const fetchPendingOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or('status.eq.PENDING,driver_code.eq.' + riderCode)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
      // Kureba niba afite trip irimo gukorwa
      const activeTrip = data.find(o => o.status === 'ACCEPTED' && o.driver_code === riderCode);
      setMyTrip(activeTrip || null);
    }
  };

  useEffect(() => {
    fetchPendingOrders();

    // Listener ya real-time kuri ama-orders mashya
    const orderSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchPendingOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, []);

  // 1. Switche yo guhindura status (Online / Offline)
  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    await supabase
      .from('drivers')
      .update({ status: newStatus ? 'AVAILABLE' : 'OFFLINE' })
      .eq('id', driverId);
  };

  // 2. Shoferi Emerewe Kwemeza Order (Accept Order) na Rider Code
  const handleAcceptOrder = async (orderId) => {
    if (!isOnline) {
      Alert.alert("Ntibyemewe", "Banza ufungure status yawe ube Online (Uru ku kazi)!");
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'ACCEPTED', 
        driver_name: driverName,
        driver_code: riderCode // Bika Rider Code ku Order muri Database
      })
      .eq('id', orderId);

    if (error) {
      Alert.alert("Ikosa", "Ntibyakunze kwemeza iyi order!");
    } else {
      Alert.alert("Byagenze Neza", `Wamaze kwemeza iyi order ukaragaza Code yawe: ${riderCode}`);
      fetchPendingOrders();
    }
  };

  // 3. Shoferi Arangije Geza Ipaki (Complete Order)
  const handleCompleteOrder = async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'DELIVERED' })
      .eq('id', orderId);

    if (error) {
      Alert.alert("Ikosa", "Ntibyakunze gusoza ulu rugendo!");
    } else {
      Alert.alert("Warakoze!", "Urugendo rwarangiye neza kandi wagereje umukiriya ipaki ye!");
      setMyTrip(null);
      fetchPendingOrders();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Driver Header Profile Info */}
      <View style={styles.driverProfileCard}>
        <View style={styles.avatarBox}>
          <Bike color="#3B82F6" size={28} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.driverTitle}>{driverName}</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{riderCode}</Text>
            </View>
          </View>
          <Text style={styles.statusSub}>
            Status: {isOnline ? '🟢 Uraza ku kazi (Online)' : '🔴 Ntiwri ku kazi (Offline)'}
          </Text>
        </View>
        <Switch 
          value={isOnline} 
          onValueChange={toggleOnlineStatus}
          trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
          thumbColor={isOnline ? '#3B82F6' : '#94A3B8'}
        />
      </View>

      {/* Active Trip Banner niba arimo gukora order */}
      {myTrip && (
        <View style={styles.activeTripCard}>
          <View style={styles.activeHeader}>
            <Navigation color="#FFFFFF" size={20} />
            <Text style={styles.activeTitle}>URUGENDO RW'UBU (Active Trip)</Text>
          </View>
          <Text style={styles.activeClient}>Umukiriya: {myTrip.client_name}</Text>
          <Text style={styles.activeLocation}>📍 Aho Kuvana: {myTrip.pickup_location}</Text>
          <Text style={styles.activeLocation}>🏁 Aho Kujyana: {myTrip.dropoff_location}</Text>
          <Text style={styles.activeAmount}>💰 Amafaranga: {myTrip.amount} RWF</Text>

          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Chat', { orderId: myTrip.id, clientName: myTrip.client_name })}
          >
            <Phone color="#3B82F6" size={16} />
            <Text style={styles.chatBtnText}>Kwandikiranira / Guhamagara Umukiriya</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.completeBtn}
            onPress={() => handleCompleteOrder(myTrip.id)}
          >
            <CheckCircle color="#FFFFFF" size={18} />
            <Text style={styles.completeBtnText}>Emeza Ko Ipaki Yageze Yo (Complete)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Title y'ama Orders Akenewe */}
      <Text style={styles.sectionTitle}>
        Ama-Orders Akeneye Shoferi ({orders.filter(o => o.status === 'PENDING').length})
      </Text>

      {/* Lisiti y'ama-Orders Akenewe */}
      {orders.filter(o => o.status === 'PENDING').length === 0 ? (
        <View style={styles.emptyBox}>
          <Clock color="#94A3B8" size={40} />
          <Text style={styles.emptyText}>Nta order nshya iraza ubu. Tegereza kidogo!</Text>
        </View>
      ) : (
        orders.filter(o => o.status === 'PENDING').map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderType}>📦 {order.order_type}</Text>
              <Text style={styles.orderPrice}>{order.amount} RWF</Text>
            </View>

            <View style={styles.locationRow}>
              <MapPin color="#EF4444" size={16} />
              <Text style={styles.locationText}>Aho Kuvana: <Text style={styles.boldText}>{order.pickup_location}</Text></Text>
            </View>

            <View style={styles.locationRow}>
              <MapPin color="#10B981" size={16} />
              <Text style={styles.locationText}>Aho Kugeza: <Text style={styles.boldText}>{order.dropoff_location}</Text></Text>
            </View>

            {order.details && <Text style={styles.detailsText}>💬 Ibisobanuro: {order.details}</Text>}

            <TouchableOpacity 
              style={styles.acceptBtn}
              onPress={() => handleAcceptOrder(order.id)}
            >
              <CheckCircle color="#FFFFFF" size={18} />
              <Text style={styles.acceptText}>Emerewe Kujyana Iyi Order</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Button yo Gusohoka */}
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => navigation.replace('Auth')}
      >
        <LogOut color="#EF4444" size={18} />
        <Text style={styles.logoutText}>Gusohoka Muri Driver Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 18, paddingTop: 45, paddingBottom: 40 },
  driverProfileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, gap: 12, elevation: 1 },
  avatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  driverTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  codeBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  codeBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#1E40AF' },
  statusSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  emptyBox: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', gap: 8 },
  emptyText: { color: '#64748B', fontSize: 13, textAlign: 'center' },
  orderCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14, elevation: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderType: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  orderPrice: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  locationText: { fontSize: 13, color: '#475569' },
  boldText: { fontWeight: 'bold', color: '#0F172A' },
  detailsText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 4, marginBottom: 10 },
  acceptBtn: { backgroundColor: '#3B82F6', height: 46, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 8 },
  acceptText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  activeTripCard: { backgroundColor: '#1E293B', padding: 18, borderRadius: 16, marginBottom: 20 },
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  activeTitle: { color: '#38BDF8', fontWeight: 'bold', fontSize: 13 },
  activeClient: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  activeLocation: { color: '#CBD5E1', fontSize: 13, marginBottom: 4 },
  activeAmount: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', marginTop: 6, marginBottom: 12 },
  chatBtn: { backgroundColor: '#FFFFFF', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 8 },
  chatBtnText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 13 },
  completeBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  completeBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, marginTop: 15, backgroundColor: '#FEF2F2', borderRadius: 10, borderWidth: 1, borderColor: '#FCA5A5', gap: 8 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 }
});