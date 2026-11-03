import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { EVO_PRICING } from './src/data/evoPricing.ts';
import { CANONICAL_TOMES } from './src/data/evoCatalog.ts';

// Initialize Firebase Admin
let adminApp;
let projectId = 'gen-lang-client-0109963225';
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    projectId = serviceAccount.project_id || projectId;
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId,
      storageBucket: `${projectId}.firebasestorage.app`,
    });
  } else {
    adminApp = initializeApp({
      projectId,
      storageBucket: `${projectId}.firebasestorage.app`,
    });
  }
} catch (e) {
  console.error('Firebase admin init error:', e);
}

const db = getFirestore(adminApp, 'ai-studio-magazineevolabs-eba26dde-e6cc-480f-ae84-3c4091de114d');
const adminAuth = getAuth(adminApp);

async function startServer() {
  console.log("--- EVO LABS DIAGNÓSTICO FIREBASE ADMIN ---");
  console.log("ADMIN PROJECT ID:", adminApp?.options?.projectId || 'unknown');
  console.log("DATABASE ID:", 'ai-studio-magazineevolabs-eba26dde-e6cc-480f-ae84-3c4091de114d');
  console.log("APPLICATION CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'YES' : 'NO');
  console.log("CREDENTIAL TYPE:", process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'custom path' : 'default/adc');

  try {
    await db.collection('_evo_admin_test').doc('write-test').set({
      ok: true,
      timestamp: new Date().toISOString()
    });
    console.log("SERVER WRITE TEST: PASS");
  } catch (err: any) {
    console.log("SERVER WRITE TEST: FAIL");
    console.log("ERROR CODE:", err.code);
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR DETAILS:", err.details);
  }

  const app = express();
  app.use(express.json());

  // Static serving for magazines directory with proper PDF headers
  const magazinesDir = path.resolve(process.cwd(), 'public/magazines');
  app.use('/magazines', express.static(magazinesDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="EVO-LABS-TOMO-01-CONOCE-TU-PC.pdf"');
      }
    }
  }));

  // Direct download endpoint for Tomo 01 PDF
  app.get(['/api/pdf/tomo01', '/api/pdf/tomo-01', '/api/download/tomo01', '/api/download/tomo-01'], (req, res) => {
    const pdfPath = path.resolve(process.cwd(), 'public/magazines/tomo01/EVO-LABS-TOMO-01-CONOCE-TU-PC.pdf');
    if (fs.existsSync(pdfPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="EVO-LABS-TOMO-01-CONOCE-TU-PC.pdf"');
      return res.sendFile(pdfPath);
    }
    return res.status(404).json({ error: 'PDF file not found' });
  });

  // API: Create Checkout Order
  app.post('/api/checkout/create', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing token' });
      }
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      const uid = decodedToken.uid;

      const { productId, selectedItems } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'Missing productId' });
      }

      // Find product in canonical EVO_PRICING
      const product = Object.values(EVO_PRICING).find((p) => p.id === productId);
      if (!product) {
        return res.status(400).json({ error: 'Invalid productId' });
      }

      // Validate selection rule (e.g. PACK 3 / PACK 5)
      const cleanedItems = Array.isArray(selectedItems) ? selectedItems : [];
      if (product.selectionRule) {
        if (product.selectionRule.type === 'TOMES') {
          const exactCount = product.selectionRule.exact;
          if (cleanedItems.length !== exactCount) {
            return res.status(400).json({ error: `DENIED: Product requires exactly ${exactCount} items` });
          }
          // Validate all items exist in CANONICAL_TOMES
          const validTomeIds = CANONICAL_TOMES.map((t) => t.id);
          for (const item of cleanedItems) {
            if (!validTomeIds.includes(item)) {
              return res.status(400).json({ error: `DENIED: Invalid tome id ${item}` });
            }
          }
          // Check duplicates
          const uniqueItems = new Set(cleanedItems);
          if (uniqueItems.size !== cleanedItems.length) {
            return res.status(400).json({ error: 'DENIED: Duplicate items not allowed' });
          }
        }
      }

      // Server price authority (ignore client price)
      const amount = product.price;
      const currency = product.currency || 'ARS';

      const orderRef = db.collection('orders').doc();
      const orderId = orderRef.id;

      const baseUrl = process.env.PUBLIC_BASE_URL;
      if (!baseUrl || baseUrl.trim() === '' || baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        return res.status(500).json({ error: 'PUBLIC_BASE_URL missing' });
      }

      if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
        return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN is not configured' });
      }

      const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          items: [
            {
              title: product.name,
              quantity: 1,
              unit_price: Number(amount),
              currency_id: currency
            }
          ],
          external_reference: orderId,
          back_urls: {
            success: `${baseUrl}/payment/success`,
            failure: `${baseUrl}/payment/failure`,
            pending: `${baseUrl}/payment/pending`
          },
          auto_return: 'approved'
        })
      });

      const mpData = await mpRes.json();
      if (!mpRes.ok) {
        console.error('MercadoPago error:', mpData);
        return res.status(500).json({ error: mpData.message || 'Failed to create MercadoPago preference' });
      }

      const preferenceId = mpData.id;
      const initPoint = mpData.init_point || mpData.sandbox_init_point;

      const orderData = {
        orderId,
        uid,
        productId: product.id,
        productName: product.name,
        selectedItems: cleanedItems,
        amount,
        currency,
        provider: 'mercadopago',
        status: 'PENDING',
        providerPreferenceId: preferenceId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await orderRef.set(orderData);

      return res.json({
        success: true,
        orderId,
        checkout_url: initPoint,
        amount,
        currency,
      });
    } catch (err: any) {
      console.error('Checkout create error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // API: Mercado Pago Webhook / Approval
  app.post('/api/webhook/mercadopago', async (req, res) => {
    try {
      const { orderId, status } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: 'Missing orderId' });
      }

      const orderRef = db.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();
      if (!orderSnap.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderSnap.data()!;
      if (order.status === 'APPROVED') {
        // Idempotency check: already approved
        return res.json({ success: true, message: 'Already approved (idempotent)' });
      }

      const newStatus = status === 'rejected' ? 'REJECTED' : 'APPROVED';
      await orderRef.update({
        status: newStatus,
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (newStatus === 'APPROVED') {
        const uid = order.uid;
        const productId = order.productId;
        const selectedItems = order.selectedItems || [];

        const product = Object.values(EVO_PRICING).find((p) => p.id === productId);
        const entitlementType = product?.entitlementType || 'TOMO';

        const batch = db.batch();

        if (entitlementType === 'TOMO_PACK' || entitlementType === 'TOMO') {
          for (const tomeId of selectedItems) {
            const entRef = db.collection('entitlements').doc(`${uid}_TOMO_${tomeId}`);
            batch.set(entRef, {
              uid,
              type: 'TOMO',
              targetId: tomeId,
              source: 'mercadopago',
              orderId,
              status: 'active',
              grantedAt: FieldValue.serverTimestamp(),
            }, { merge: true });
          }
        } else if (entitlementType === 'PLAN_FULL' || entitlementType === 'LIFETIME') {
          const entRef = db.collection('entitlements').doc(`${uid}_${entitlementType}`);
          batch.set(entRef, {
            uid,
            type: entitlementType,
            source: 'mercadopago',
            orderId,
            status: 'active',
            grantedAt: FieldValue.serverTimestamp(),
          }, { merge: true });
        }

        await batch.commit();
      }

      return res.json({ success: true, status: newStatus });
    } catch (err: any) {
      console.error('Webhook error:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // API: Get Order Status
  app.get('/api/orders/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const orderSnap = await db.collection('orders').doc(orderId).get();
      if (!orderSnap.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(orderSnap.data());
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  const PORT = process.env.PORT || 3000;
  const httpServer = http.createServer(app);

  // Frontend serving: static assets in production, Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    const fs = await import('fs');
    const staticDir = fs.existsSync(path.resolve(process.cwd(), 'dist'))
      ? path.resolve(process.cwd(), 'dist')
      : path.resolve(process.cwd(), 'build');
    app.use(express.static(staticDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.resolve(staticDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    // Ensure requests to /components/* are properly routed to Vite's /src/components/*
    app.use('/components', (req, res, next) => {
      req.url = '/src/components' + req.url;
      vite.middlewares(req, res, next);
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`EVO LABS Commerce Core running on http://localhost:${PORT}`);
  });
}

startServer();
