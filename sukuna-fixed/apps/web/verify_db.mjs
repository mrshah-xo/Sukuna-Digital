import mongoose from 'mongoose';

async function verifyDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect('mongodb://127.0.0.1:27017/sukuna');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log("Collections:", collectionNames);
    
    const examsExist = collectionNames.includes('exams');
    const examResultsExist = collectionNames.includes('examresults');
    
    console.log(`Exam collection created: ${examsExist}`);
    console.log(`ExamResult collection created: ${examResultsExist}`);
    
    if (examsExist) {
        const examIndexes = await mongoose.connection.db.collection('exams').indexes();
        console.log("Exam Indexes:", examIndexes.map(i => i.key));
    }
    
    if (examResultsExist) {
        const erIndexes = await mongoose.connection.db.collection('examresults').indexes();
        console.log("ExamResult Indexes:", erIndexes.map(i => i.key));
    }
    
    const auditIndexes = await mongoose.connection.db.collection('auditlogs').indexes();
    console.log("AuditLog Indexes:", auditIndexes.map(i => i.key));
    
  } catch (e) {
    console.error("DB Verification Error:", e);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

verifyDB();
