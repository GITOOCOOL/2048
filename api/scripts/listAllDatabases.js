/**
 * List ALL databases on the MongoDB cluster
 * Run with: node scripts/listAllDatabases.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const listAllDatabases = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...\n");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully!\n");

    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.listDatabases();
    
    console.log("📁 ALL DATABASES ON THIS CLUSTER:\n");
    console.log("═".repeat(60));
    
    for (const db of result.databases) {
      console.log(`\n📂 Database: ${db.name}`);
      console.log(`   Size: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
      
      // Get collections for each database
      const dbInstance = mongoose.connection.client.db(db.name);
      const collections = await dbInstance.listCollections().toArray();
      
      if (collections.length > 0) {
        console.log(`   Collections:`);
        for (const coll of collections) {
          const collInstance = dbInstance.collection(coll.name);
          const count = await collInstance.countDocuments();
          console.log(`     - ${coll.name} (${count} docs)`);
        }
      } else {
        console.log(`   (no collections)`);
      }
    }
    
    console.log("\n" + "═".repeat(60));
    console.log("\n✅ Scan complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

listAllDatabases();
