/**
 * Database Inspection Script
 * Run with: node scripts/inspectDb.js
 * 
 * This will show you:
 * - All collections in your database
 * - Sample documents from each collection
 * - Document structure/fields
 */

require("dotenv").config();
const mongoose = require("mongoose");

const inspectDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...\n");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully!\n");

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📁 Database: ${dbName}\n`);

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📂 Found ${collections.length} collection(s):\n`);

    for (const collection of collections) {
      console.log("═".repeat(50));
      console.log(`📋 Collection: ${collection.name}`);
      console.log("═".repeat(50));

      const coll = db.collection(collection.name);
      const count = await coll.countDocuments();
      console.log(`   Documents: ${count}`);

      // Get sample document
      const sample = await coll.findOne();
      if (sample) {
        console.log(`   Sample document fields:`);
        const fields = Object.keys(sample);
        fields.forEach(field => {
          const value = sample[field];
          const type = typeof value;
          const preview = type === 'object' 
            ? (value instanceof Date ? value.toISOString() : JSON.stringify(value).substring(0, 50))
            : String(value).substring(0, 50);
          console.log(`     - ${field}: (${type}) ${preview}`);
        });
      } else {
        console.log(`   (empty collection)`);
      }
      console.log("");
    }

    console.log("═".repeat(50));
    console.log("✅ Inspection complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

inspectDatabase();
