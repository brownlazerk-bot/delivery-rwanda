import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { X, Volume2, PlayCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function FullScreenAdModal({ visible, adData, onClose }) {
  const [countdown, setCountdown] = useState(5); // Amasegonda 5 mbere yo kumpa Close Button
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    let timer;
    if (visible) {
      setCountdown(5);
      setCanClose(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [visible]);

  if (!adData) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Header - Close Button & Countdown */}
        <View style={styles.topBar}>
          <Text style={styles.adTag}>📢 Advert</Text>
          {canClose ? (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X color="#FFFFFF" size={20} />
              <Text style={styles.closeText}>Funga</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>Funga muri {countdown}s</Text>
            </View>
          )}
        </View>

        {/* Video Player Area (Full-Screen Simulation) */}
        <View style={styles.videoArea}>
          <PlayCircle color="#3B82F6" size={80} />
          <Text style={styles.videoSimText}>PLAYING AD VIDEO...</Text>
          <Text style={styles.videoUrlText}>{adData.video_url}</Text>
        </View>

        {/* Bottom Banner Details */}
        <View style={styles.bottomContent}>
          <Text style={styles.adTitle}>{adData.title}</Text>
          <Text style={styles.adDesc}>{adData.description}</Text>
          
          <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
            <Text style={styles.actionBtnText}>Reba Byinshi / Kanda Hano</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 },
  adTag: { color: '#F59E0B', fontWeight: 'bold', fontSize: 13, backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timerBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timerText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  closeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  closeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  videoArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  videoSimText: { color: '#60A5FA', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  videoUrlText: { color: '#64748B', fontSize: 11, fontStyle: 'italic', paddingHorizontal: 30, textAlign: 'center' },
  bottomContent: { padding: 24, backgroundColor: '#1E293B', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  adTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  adDesc: { color: '#94A3B8', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  actionBtn: { backgroundColor: '#3B82F6', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});