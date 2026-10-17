import { Alert } from 'react-native';

export const NotificationService = {
  // Send notification for new orders
  notifyDriverNewOrder: (orderId, amount) => {
    Alert.alert(
      "🔔 Commande Nshya!",
      `Ufite Commande nshya (#${orderId}) y'amafaranga ${amount} RWF. Fungura urebe!`,
      [{ text: "Reba Commande" }]
    );
  },

  // Send notification when driver accepts
  notifyClientDriverAssigned: (driverName) => {
    Alert.alert(
      "🛵 Shoferi Ari Mu Nzira!",
      `Shoferi ${driverName} wamaze kwemeza commande yawe. Ari mu nzira aje.`,
      [{ text: "Sawa" }]
    );
  }
};