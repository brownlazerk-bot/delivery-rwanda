import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Phone, Lock, LogIn, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react-native';
import { supabase } from '../services/supabase';

export default function AuthScreen({ navigation }) {
  const [role, setRole] = useState('client'); // 'client' | 'driver' | 'admin'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('LOGIN'); // 'LOGIN' | 'OTP' | 'CREATE_PASSWORD'
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentRider, setCurrentRider] = useState(null);

  const handleAuth = async () => {
    if (!phone) {
      Alert.alert("Ikosa", "Nyamuneka input nimero ya telefone!");
      return;
    }

    // 1. ADMIN LOGIN
    if (role === 'admin') {
      if (phone === '0780000000' && password === 'admin123') {
        navigation.replace('Admin');
      } else {
        Alert.alert("Ntibyemewe", "Nimero cyangwa password ya Admin sibyo!");
      }
      return;
    }

    // 2. RIDER LOGIN & SECURITY FLOW
    if (role === 'driver') {
      try {
        const { data: driverData, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('phone', phone)
          .single();

        if (error || !driverData) {
          Alert.alert("Ntibyemewe", "Iyi nimero ntiri mu zemejwe na Admin. Vugana n'umuyobozi!");
          return;
        }

        setCurrentRider(driverData);

        // A. Niba Rider atarakora Password: Mwoherereze OTP
        if (!driverData.password) {
          const fakeOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(fakeOtp);
          setStep('OTP');
          Alert.alert("🔑 OTP SMS", `Code yawe yo kwemeza telefone ni: ${fakeOtp}`);
          return;
        }

        // B. Niba afite Password: Mureke yinjire na Password
        if (password !== driverData.password) {
          Alert.alert("Ikosa", "Password/PIN wanditse ntabwo ari yo!");
          return;
        }

        Alert.alert("Murakaza neza", `Murakaza neza Rider ${driverData.full_name} (${driverData.rider_code})!`);
        navigation.replace('Driver', { 
          driverId: driverData.id, 
          driverName: driverData.full_name,
          riderCode: driverData.rider_code 
        });

      } catch (err) {
        Alert.alert("Ikosa", "System Error mu guhuza na database.");
      }
      return;
    }

    // 3. CLIENT LOGIN
    navigation.replace('Home');
  };

  // Emeza OTP
  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setStep('CREATE_PASSWORD');
    } else {
      Alert.alert("Ikosa", "OTP Code wanditse ntabwo ari yo!");
    }
  };

  // Rema Password Nshya muri Database
  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      Alert.alert("Ikosa", "Password igomba kuba ifite nibura imenyetso 4!");
      return;
    }

    const { error } = await supabase
      .from('drivers')
      .update({ password: newPassword, is_verified: true })
      .eq('id', currentRider.id);

    if (error) {
      Alert.alert("Ikosa", "Ntibyakunze kubika password!");
    } else {
      Alert.alert("Byakunze!", `Password yawe yabitswe neza. Code yawe ni ${currentRider.rider_code}`);
      navigation.replace('Driver', { 
        driverId: currentRider.id, 
        driverName: currentRider.full_name,
        riderCode: currentRider.rider_code 
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <ShieldCheck color="#3B82F6" size={55} />
        <Text style={styles.title}>Yuskar Delivery</Text>
        <Text style={styles.subtitle}>Umutekano n'Ihuriro rya Rider Security</Text>
      </View>

      {/* Role Selector */}
      {step === 'LOGIN' && (
        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleBtn, role === 'client' && styles.roleActive]} onPress={() => setRole('client')}>
            <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Umukiriya</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, role === 'driver' && styles.roleActive]} onPress={() => setRole('driver')}>
            <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Rider (Shoferi)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, role === 'admin' && styles.roleActive]} onPress={() => setRole('admin')}>
            <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 1: NORMAL LOGIN */}
      {step === 'LOGIN' && (
        <View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nimero ya Telefone</Text>
            <View style={styles.inputWrapper}>
              <Phone color="#64748B" size={20} />
              <TextInput style={styles.input} placeholder="078..." keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>
          </View>

          {(role === 'admin' || (role === 'driver' && currentRider?.password)) && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password / PIN</Text>
              <View style={styles.inputWrapper}>
                <Lock color="#64748B" size={20} />
                <TextInput style={styles.input} placeholder="******" secureTextEntry value={password} onChangeText={setPassword} />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleAuth}>
            <LogIn color="#FFFFFF" size={20} />
            <Text style={styles.submitText}>Kwinjira (Login)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: OTP VERIFICATION */}
      {step === 'OTP' && (
        <View style={styles.cardBox}>
          <KeyRound color="#3B82F6" size={40} style={{ alignSelf: 'center', marginBottom: 10 }} />
          <Text style={styles.boxTitle}>Emeza Nimero ya Telefone (OTP)</Text>
          <Text style={styles.boxSub}>Shyiramo code twakoherereje kuri SMS</Text>

          <TextInput style={styles.otpInput} placeholder="1234" keyboardType="number-pad" value={otpInput} onChangeText={setOtpInput} maxLength={4} />

          <TouchableOpacity style={styles.submitBtn} onPress={handleVerifyOtp}>
            <CheckCircle2 color="#FFFFFF" size={20} />
            <Text style={styles.submitText}>Emeza OTP Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 3: CREATE PASSWORD */}
      {step === 'CREATE_PASSWORD' && (
        <View style={styles.cardBox}>
          <Lock color="#10B981" size={40} style={{ alignSelf: 'center', marginBottom: 10 }} />
          <Text style={styles.boxTitle}>Rema Password/PIN Nshya</Text>
          <Text style={styles.boxSub}>Iyi ni yo uzajya ukoresha winjira muri Yuskar Delivery</Text>

          <TextInput style={styles.otpInput} placeholder="Password nshya" secureTextEntry value={newPassword} onChangeText={setNewPassword} />

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#10B981' }]} onPress={handleSavePassword}>
            <Text style={styles.submitText}>Bika Password & Injira</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 20, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center' },
  roleContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFFFF' },
  roleActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  roleText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  roleTextActive: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#FFFFFF', height: 50, gap: 10 },
  input: { flex: 1, fontSize: 14, color: '#0F172A' },
  submitBtn: { backgroundColor: '#3B82F6', height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 8 },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cardBox: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 10 },
  boxTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', textAlign: 'center' },
  boxSub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 15 },
  otpInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, height: 50, fontSize: 18, textAlign: 'center', backgroundColor: '#F8FAFC', marginBottom: 10, fontWeight: 'bold' }
});