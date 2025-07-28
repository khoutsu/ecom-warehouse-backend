const { getFirestore } = require('../config/firebase');

class OrderModel {
  constructor() {
    this.db = getFirestore();
    this.collection = 'orders';
  }

  // Create a new order
  async create(orderData) {
    try {
      const docRef = await this.db.collection(this.collection).add({
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders
  async getAll() {
    try {
      const snapshot = await this.db.collection(this.collection)
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Get order by ID
  async getById(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Update order status
  async updateStatus(id, status) {
    try {
      await this.db.collection(this.collection).doc(id).update({
        status: status,
        updatedAt: new Date()
      });
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Get orders by user ID
  async getByUserId(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching user orders: ${error.message}`);
    }
  }

  // Get orders by status
  async getByStatus(status) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('status', '==', status)
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders by status: ${error.message}`);
    }
  }

  // Delete order
  async delete(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }
}

module.exports = new OrderModel();
