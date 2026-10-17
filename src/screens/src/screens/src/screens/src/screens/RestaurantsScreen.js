import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Utensils, Star, ShoppingCart, Plus } from 'lucide-react-native';

export default function RestaurantsScreen() {
  const [cart, setCart] = useState([]);

  // Urutonde rw'Ama-Restaurant n'ibiribwa byayo
  const restaurants = [
    {
      id: '1',
      name: 'Yuskar Grand Hotel',
      category: 'Amafunguro n\'Ibyo Kunywa',
      time: '20-30 min',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
      menu: [
        { id: 'm1', name: 'Brochette ya Inkoko & Fries', price: '4,500 RWF' },
        { id: 'm2', name: 'Tilapia Fish & Rice', price: '7,000 RWF' },
        { id: 'm3', name: 'Fresh Juice (Passion/Mango)', price: '1,500 RWF' },
      ]
    },
    {
      id: '2',
      name: 'Kigali Fast Food & Cafe',
      category: 'Burgers & Pizza',
      time: '15-25 min',
      rating: '4.6',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
      menu: [
        { id: 'm4', name: 'Yuskar Special Burger', price: '5,000 RWF' },
        { id: 'm5', name: 'Chicken Pizza (Medium)', price: '8,500 RWF' },
      ]
    }
  ];

  const addToCart = (item, restaurantName) => {
    setCart([...cart, { ...item, restaurantName }]);
    Alert.alert("Byongewe mu Kagari", `Wongereye: ${item.name} (${item.price})`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Hotels & Restaurants</Text>
        <View style={styles.cartBadge}>
          <ShoppingCart color="#0F172A" size={22} />
          {cart.length > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Urutonde rw'Ama-Restaurant */}
      {restaurants.map((rest) => (
        <View key={rest.id} style={styles.restaurantCard}>
          <Image source={{ uri: rest.image }} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <View style={styles.row}>
              <Text style={styles.restaurantName}>{rest.name}</Text>
              <View style={styles.ratingBox}>
                <Star color="#F59E0B" size={14} fill="#F59E0B" />
                <Text style={styles.ratingText}>{rest.rating}</Text>
              </View>
            </View>
            <Text style={styles.categoryText}>{rest.category} • {rest.time}</Text>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Menu Yihariye:</Text>
              {rest.menu.map((dish) => (
                <View key={dish.id} style={styles.dishRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>{dish.price}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addToCart(dish, rest.name)}
                  >
                    <Plus color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  cartBadge: { padding: 8, backgroundColor: '#E2E8F0', borderRadius: 50, position: 'relative' },
  badgeCount: { position: 'absolute', right: -2, top: -2, backgroundColor: '#EF4444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  restaurantCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  restaurantImage: { width: '100%', height: 150 },
  restaurantInfo: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: 'bold', color: '#B45309' },
  categoryText: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 12 },
  menuContainer: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8 },
  dishRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dishName: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  dishPrice: { fontSize: 13, color: '#3B82F6', fontWeight: '600', marginTop: 2 },
  addButton: { backgroundColor: '#10B981', padding: 8, borderRadius: 8 }
});