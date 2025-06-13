'use strict'

class ProductFactoryStratergy {
    static productRegistry = {}  // 📘 a map of type -> class

    static registerProductType(type, classRef) {
      ProductFactory.productRegistry[type] = classRef  // 🔐 register type
    }
    
    static async createProduct(type, payload) {
      const productClass = ProductFactory.productRegistry[type]  // 🔍 lookup
      if (!productClass) throw new BadRequestError(...)
      return new productClass(payload).createProduct()  // 🏭 create instance dynamically
    }
}

