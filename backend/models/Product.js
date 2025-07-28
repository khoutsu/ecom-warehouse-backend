const { getFirestore } = require('../config/firebase');

class ProductModel {
  constructor() {
    this.db = getFirestore();
    this.collection = 'products';
  }

  // Create a new product
  async create(productData) {
    try {
      const docRef = await this.db.collection(this.collection).add({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  // Get all products
  async getAll() {
    try {
      const snapshot = await this.db.collection(this.collection).get();
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  async getById(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Update product
  async update(id, updateData) {
    try {
      await this.db.collection(this.collection).doc(id).update({
        ...updateData,
        updatedAt: new Date()
      });
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  // Delete product
  async delete(id) {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  // Search products by name or category
  async search(query) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .get();
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

module.exports = new ProductModel();
