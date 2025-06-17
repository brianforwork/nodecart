// repositories/attribute.repo.js
import { connectDB } from "../../database/init.mongodb.js"
import { ObjectId } from 'mongodb'

// Map product types to their respective attribute collection names
const attributeCollectionMap = {
    Clothing: 'ClothingAttributes',
    Electronics: 'ElectronicsAttributes',
    Furniture: 'FurnitureAttributes'
  }

export const updateAttributesByProductType = async ({ productType, attrId, updates }) => {
    const db = await connectDB()
    const collectionName = attributeCollectionMap[productType]
  
    if (!collectionName) {
      throw new Error(`Unsupported product type: ${productType}`)
    }
  
    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(attrId) },
      { $set: updates },
      { returnDocument: 'after' }
    )

    
  
    return result
}

