import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Package, Utensils, MapPin, User, Search, PlayCircle } from 'lucide-react-native';
import { supabase } from '../services/supabase';

export default function HomeScreen({ navigation }) {
  const [activeAd, setActiveAd] = useState(null);

  // Kuzana video y'itangazo iri active
  useEffect(() => {
    const fetchActiveAd = async () => {
      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setActiveAd(data[0]);
      }
    };

    fetchActiveAd();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Muraho! 👋</Text>
          <Text style={styles.headerTitle}>Yuskar Delivery App</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <User color="#3B82F6" size={20} />
        </TouchableOpacity>
      </View>

      {/* AGACE K'ITANGAZO RYA VIDEO (VIDEO ADVERTISEMENT PLAYER BANNER) */}
      {activeAd && (
        <View style={styles.adBanner}>
          <View style={styles.videoPlaceholder}>
            <PlayCircle color="#FFFFFF" size={48} />
            <Text style={styles.videoPlayText}>Kanda hano urebe Video y'Itangazo</Text>
          </View>
          <View style={styles.adContent}>
            <Text style={styles.adBadge}>📢 WAMAMAZA / PROMO</Text>
            <Text style={styles.adTitle}>{activeAd.title}</Text>
            <Text style={styles.adDesc}>{activeAd.description}</Text>
          </View>
        </View>
      )}

      {/* Main Services Selection */}
      <Text style={styles.sectionTitle}>Hitamo Serivisi Wifuza</Text>
      
      <View style={styles.servicesGrid}>
        <TouchableOpacity 
          style={[styles.serviceCard, { backgroundColor: '#EFF6FF' }]}
          onPress={() => navigation.navigate('PackageDelivery')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#3B82F6' }]}>
            <Package color="#FFFFFF" size={26} />
          </View>
          <Text style={styles.serviceTitle}>Ohereza Ipaki</Text>
          <Text style={styles.serviceSub}>Ibyuma, Impapuro & Amapaki</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.serviceCard, { backgroundColor: '#ECFDF5' }]}
          onPress={() => navigation.navigate('Restaurants')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#10B981' }]}>
            <Utensils color="#FFFFFF" size={26} />
          </View>
          <Text style={styles.serviceTitle}>Ibireka / Food</Text>
          <Text style={styles.serviceSub}>Hotels & Restaurants</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Tracking Button */}
      <TouchableOpacity 
        style={styles.trackingCard}
        onPress={() => navigation.navigate('Tracking')}
      >
        <MapPin color="#3B82F6" size={22} />
        <View style={{ flex: 1 }}>
          <Text style={styles.trackingTitle}>Gukurikirana Shoferi (Live Tracking)</Text>
          <Text style={styles.trackingSub}>Reba aho umunyamoto ageze mu rugendo</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 18, paddingTop: 45, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, color: '#64748B' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  profileBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  
  // Video Advertising Banner Styles
  adBanner: { backgroundColor: '#1E293B', borderRadius: 16, overflow: 'hidden', marginBottom: 24, elevation: 3 },
  videoPlaceholder: { height: 150, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  videoPlayText: { color: '#94A3B8', fontSize: 12, marginTop: 6 },
  adContent: { padding: 14 },
  adBadge: { fontSize: 10, color: '#F59E0B', fontWeight: 'bold', marginBottom: 4 },
  adTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  adDesc: { fontSize: 12, color: '#CBD5E1', marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  servicesGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  serviceCard: { flex: 1, padding: 16, borderRadius: 16, borderHeight: 1, gap: 8 },
  iconBox: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  serviceTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  serviceSub: { fontSize: 11, color: '#64748B' },
  trackingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 }
});