import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

let credentialsStatus = 'NO';
let projectId = 'gen-lang-client-0109963225';
let databaseId = 'ai-studio-magazineevolabs-eba26dde-e6cc-480f-ae84-3c4091de114d';

let adminApp;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    projectId = serviceAccount.project_id || projectId;
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId,
      storageBucket: `${projectId}.firebasestorage.app`,
    });
    credentialsStatus = 'YES';
  } else {
    adminApp = initializeApp({
      projectId,
    });
  }
} catch (e: any) {
  credentialsStatus = 'NO';
  console.error("Init error:", e.message);
}

const db = getFirestore(adminApp, databaseId);

async function runTest() {
  console.log(`APPLICATION CREDENTIALS: ${credentialsStatus}`);
  console.log(`ADMIN PROJECT ID: ${projectId}`);
  console.log(`DATABASE ID: ${databaseId}`);
  try {
    await db.collection('_evo_admin_test').doc('write-test').set({
      ok: true,
      timestamp: new Date().toISOString()
    });
    console.log(`SERVER WRITE TEST: PASS`);
    console.log(`ERROR CODE: N/A`);
    console.log(`ERROR MESSAGE: N/A`);
  } catch (err: any) {
    console.log(`SERVER WRITE TEST: FAIL`);
    console.log(`ERROR CODE: ${err.code || 'UNKNOWN'}`);
    console.log(`ERROR MESSAGE: ${err.message || err}`);
    if (err.details) {
      console.log(`ERROR DETAILS: ${err.details}`);
    }
  }
}

runTest();
