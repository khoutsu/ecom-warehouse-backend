const { getFirestore } = require('../config/firebase');

class InventoryModel {
  constructor() {
    this.db = getFirestore();
    this.collection = 'inventory';
  }

  // Create inventory record
  async create(inventoryData) {
    try {
      const docRef = await this.db.collection(this.collection).add({
        ...inventoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...inventoryData };
    } catch (error) {
      throw new Error(`Error creating inventory record: ${error.message}`);
    }
  }

  // Get all inventory items
  async getAll() {
    try {
      const snapshot = await this.db.collection(this.collection).get();
      const inventory = [];
      snapshot.forEach(doc => {
        inventory.push({ id: doc.id, ...doc.data() });
      });
      return inventory;
    } catch (error) {
      throw new Error(`Error fetching inventory: ${error.message}`);
    }
  }

  // Get inventory by product ID
  async getByProductId(productId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('productId', '==', productId)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error fetching inventory: ${error.message}`);
    }
  }

  // Update inventory quantity
  async updateQuantity(productId, newQuantity) {
    try {
      const inventoryItem = await this.getByProductId(productId);
      if (!inventoryItem) {
        throw new Error('Inventory item not found');
      }

      await this.db.collection(this.collection).doc(inventoryItem.id).update({
        quantity: newQuantity,
        updatedAt: new Date()
      });

      return await this.getByProductId(productId);
    } catch (error) {
      throw new Error(`Error updating inventory: ${error.message}`);
    }
  }

  // Get low stock items
  async getLowStock(threshold = 10) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('quantity', '<=', threshold)
        .get();
      
      const lowStockItems = [];
      snapshot.forEach(doc => {
        lowStockItems.push({ id: doc.id, ...doc.data() });
      });
      return lowStockItems;
    } catch (error) {
      throw new Error(`Error fetching low stock items: ${error.message}`);
    }
  }

  // Delete inventory record
  async delete(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return { success: true, message: 'Inventory record deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting inventory record: ${error.message}`);
    }
  }
}

module.exports = new InventoryModel();
