import { supabase } from './supabase';

export const YuskarAPI = {
  // 1. Kurema Order nshya ivuye ku Mukiriya
  createOrder: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          client_name: orderData.clientName || 'Yuskar Client',
          order_type: orderData.type,
          pickup_location: orderData.pickup,
          dropoff_location: orderData.dropoff,
          details: orderData.details,
          amount: orderData.amount || 2500,
          status: 'PENDING'
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  // 2. Kuzana ama-Orders yose muri Admin cyangwa Driver Dashboard
  getOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 3. Shoferi kwakira Order (Update Status to ACCEPTED)
  acceptOrder: async (orderId, driverName) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'ACCEPTED', driver_name: driverName })
      .eq('id', orderId);

    if (error) throw error;
    return data;
  },

  // 4. Listen to Real-time Orders (Kureba orders mu amasegonda nk'uko zije)
  subscribeToOrders: (onNewOrder) => {
    return supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        onNewOrder(payload.new);
      })
      .subscribe();
  }
};