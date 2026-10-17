import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Send, User } from 'lucide-react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'driver', text: 'Muraho! Ngeze mu Remera ntegereje ipaki yawe.' },
    { id: '2', sender: 'client', text: 'Yego Bosco, umuntu araje ayiguhe mu minota 2.' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'client', text: inputText }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      {/* Header Driver Info */}
      <View style={styles.chatHeader}>
        <View style={styles.avatar}>
          <User color="#3B82F6" size={20} />
        </View>
        <View>
          <Text style={styles.driverName}>Jean Bosco (Shoferi)</Text>
          <Text style={styles.statusText}>● Online</Text>
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.msgBubble, 
              msg.sender === 'client' ? styles.myMsg : styles.theirMsg
            ]}
          >
            <Text style={[styles.msgText, msg.sender === 'client' ? styles.myMsgText : styles.theirMsgText]}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputArea}>
        <TextInput 
          style={styles.textInput}
          placeholder="Andika ubutumwa aha..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Send color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingTop: 40, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  driverName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  statusText: { fontSize: 12, color: '#10B981', fontWeight: '500' },
  messagesContainer: { flex: 1, padding: 16 },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#3B82F6', borderBottomRightRadius: 2 },
  theirMsg: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 14 },
  myMsgText: { color: '#FFFFFF' },
  theirMsgText: { color: '#0F172A' },
  inputArea: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center', gap: 8 },
  textInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, height: 44, fontSize: 14 },
  sendBtn: { backgroundColor: '#3B82F6', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});