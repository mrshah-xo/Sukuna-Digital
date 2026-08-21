import mongoose from 'mongoose';

// Connect to MongoDB
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const MONGO_URI = process.env.MONGODB_URI;

async function seedUser() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    const db = mongoose.connection.db;

    // 1. Ensure a School exists
    let schoolId;
    const existingSchool = await db.collection('schools').findOne({ schoolCode: 'SUKUNA01' });
    if (existingSchool) {
      schoolId = existingSchool._id;
      console.log("School found:", schoolId);
    } else {
      const result = await db.collection('schools').insertOne({
        schoolName: 'Sukuna Test School',
        schoolCode: 'SUKUNA01',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: { planType: 'ENTERPRISE', status: 'ACTIVE' }
      });
      schoolId = result.insertedId;
      console.log("Created test school:", schoolId);
    }

    // 2. Create the Admin User with the requested phone number
    const targetPhone = '9816348390';
    const existingUser = await db.collection('users').findOne({ phone: targetPhone });

    if (existingUser) {
      console.log(`User with phone ${targetPhone} already exists! Updating role to ADMIN...`);
      await db.collection('users').updateOne(
        { phone: targetPhone },
        { $set: { role: 'ADMIN', status: 'ACTIVE', schoolId: schoolId } }
      );
      console.log("User updated successfully.");
    } else {
      const userResult = await db.collection('users').insertOne({
        schoolId: schoolId,
        name: 'Admin Raj',
        phone: targetPhone,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Created Admin User:", userResult.insertedId);
    }

    console.log("\n✅ SUCCESS: You can now log in with the phone number 9816348390");

  } catch (error) {
    console.error("Error seeding user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedUser();
