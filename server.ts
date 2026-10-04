import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE_PATH = path.resolve(DATA_DIR, 'central_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Sample Data for the Centralized Shared Database
const defaultInitialDb = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  data: {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    companyProfile: {
      name: 'মেসার্স ভাই ভাই এন্টারপ্রাইজ (Vai Vai Enterprise)',
      tagline: 'হোলসেল ও রিটেইল ট্রেডার্স এবং সাপ্লাইয়ার্স',
      phone: '+880 1711-234567',
      email: 'info@vaivaienterprise.com',
      address: 'দোকান নং ১২, নিউ মার্কেট রোড, ঢাকা-১২০৫',
      currency: '৳',
      vatNumber: 'BIN-12345678901',
      vatRate: 5,
      adminPin: '1234',
    },
    customers: [
      {
        id: 'CUST-001',
        name: 'আলমগীর স্টোর (Alamgir Store)',
        phone: '01819-876543',
        email: 'alamgir@gmail.com',
        address: 'চকবাজার, ঢাকা',
        photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23059669"/><circle cx="50" cy="38" r="20" fill="%23fcd34d"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%23047857"/></svg>',
        openingBalance: 5000,
        creditLimit: 50000,
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'CUST-002',
        name: 'রফিক ভ্যারাইটিজ (Rafiq Varieties)',
        phone: '01712-334455',
        address: 'মিরপুর ১০, ঢাকা',
        photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232563eb"/><circle cx="50" cy="38" r="20" fill="%23fed7aa"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%231d4ed8"/></svg>',
        openingBalance: 0,
        creditLimit: 30000,
        createdAt: '2026-03-05T11:00:00Z',
        updatedAt: '2026-03-05T11:00:00Z',
      },
      {
        id: 'CUST-003',
        name: 'মডার্ন সুপার শপ (Modern Super Shop)',
        phone: '01911-998877',
        address: 'উত্তরা সেক্টর ৭, ঢাকা',
        photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%237c3aed"/><circle cx="50" cy="38" r="20" fill="%23fef08a"/><path d="M20 90c0-18 14-30 30-30s30 12 30 30" fill="%236d28d9"/></svg>',
        openingBalance: 12000,
        creditLimit: 100000,
        createdAt: '2026-03-10T09:30:00Z',
        updatedAt: '2026-03-10T09:30:00Z',
      },
    ],
    suppliers: [
      {
        id: 'SUPP-001',
        name: 'মেঘনা কনজিউমার্স লিঃ (Meghna Consumers Ltd)',
        phone: '01700-112233',
        email: 'supply@meghnagroup.biz',
        address: 'মতিঝিল বা/এ, ঢাকা',
        openingBalance: 15000,
        creditLimit: 200000,
        createdAt: '2026-02-15T09:00:00Z',
        updatedAt: '2026-02-15T09:00:00Z',
      },
      {
        id: 'SUPP-002',
        name: 'প্রাণ-আরএফএল সাপ্লাইয়ার্স (PRAN-RFL)',
        phone: '01800-445566',
        email: 'order@pranrfl.com',
        address: 'বাড্ডা, ঢাকা',
        openingBalance: 0,
        creditLimit: 150000,
        createdAt: '2026-02-20T10:00:00Z',
        updatedAt: '2026-02-20T10:00:00Z',
      },
      {
        id: 'SUPP-003',
        name: 'আকিজ এসেনশিয়ালস ট্রেডিং',
        phone: '01900-778899',
        address: 'তেজগাঁও শিল্প এলাকা, ঢাকা',
        openingBalance: 25000,
        creditLimit: 300000,
        createdAt: '2026-02-25T11:30:00Z',
        updatedAt: '2026-02-25T11:30:00Z',
      },
    ],
    products: [
      {
        id: 'PROD-001',
        name: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
        sku: 'OIL-SOY-5L',
        category: 'ভোজ্যতেল (Edible Oil)',
        unit: 'ltr',
        purchaseRate: 850,
        saleRate: 920,
        currentStock: 45,
        minStockAlert: 10,
        taxPercent: 0,
        discount: 0,
        warehouse: 'Main Warehouse',
        photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fef3c7"/><rect x="30" y="30" width="40" height="55" rx="8" fill="%23f59e0b"/><rect x="42" y="15" width="16" height="15" rx="3" fill="%23d97706"/><circle cx="50" cy="55" r="10" fill="%23fbbf24"/></svg>',
        createdAt: '2026-03-01T09:00:00Z',
        updatedAt: '2026-03-01T09:00:00Z',
      },
      {
        id: 'PROD-002',
        name: 'প্রিমিয়াম বাসমতি চাল ২৫ কেজি (Basmati Rice 25kg)',
        sku: 'RICE-BAS-25K',
        category: 'চাল ও খাদ্যশস্য (Grains)',
        unit: 'bag',
        purchaseRate: 2400,
        saleRate: 2650,
        currentStock: 28,
        minStockAlert: 8,
        taxPercent: 0,
        discount: 0,
        warehouse: 'Main Warehouse',
        photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ecfdf5"/><path d="M25 85 L35 30 L65 30 L75 85 Z" fill="%2310b981"/><rect x="32" y="45" width="36" height="25" fill="%23ffffff" rx="4"/><circle cx="50" cy="57" r="6" fill="%23059669"/></svg>',
        createdAt: '2026-03-01T09:15:00Z',
        updatedAt: '2026-03-01T09:15:00Z',
      },
      {
        id: 'PROD-003',
        name: 'চিনি ৫০ কেজি বস্তা (White Sugar 50kg)',
        sku: 'SUGAR-W-50K',
        category: 'চিনি ও মশলা (Sugar & Spices)',
        unit: 'bag',
        purchaseRate: 6400,
        saleRate: 6750,
        currentStock: 5,
        minStockAlert: 10,
        taxPercent: 0,
        discount: 0,
        warehouse: 'Main Warehouse',
        createdAt: '2026-03-01T09:30:00Z',
        updatedAt: '2026-03-01T09:30:00Z',
      },
      {
        id: 'PROD-004',
        name: 'মসুর ডাল (Red Lentils - Bulk)',
        sku: 'LENT-RED-KG',
        category: 'ডাল ও শস্য (Pulses)',
        unit: 'kg',
        purchaseRate: 130,
        saleRate: 145,
        currentStock: 350,
        minStockAlert: 50,
        taxPercent: 0,
        discount: 0,
        warehouse: 'Main Warehouse',
        createdAt: '2026-03-01T09:45:00Z',
        updatedAt: '2026-03-01T09:45:00Z',
      },
    ],
    invoices: [
      {
        id: 'INV-1001',
        invoiceNo: 'INV-2026-001',
        type: 'invoice',
        customerId: 'CUST-001',
        customerName: 'আলমগীর স্টোর (Alamgir Store)',
        date: '2026-03-25',
        time: '11:30:00',
        items: [
          {
            productId: 'PROD-001',
            productName: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
            unit: 'ltr',
            qty: 10,
            rate: 920,
            purchaseRate: 850,
            discount: 0,
            taxPercent: 0,
            total: 9200,
            batchNo: 'B-202603',
          },
          {
            productId: 'PROD-002',
            productName: 'প্রিমিয়াম বাসমতি চাল ২৫ কেজি (Basmati Rice 25kg)',
            unit: 'bag',
            qty: 2,
            rate: 2650,
            purchaseRate: 2400,
            discount: 100,
            taxPercent: 0,
            total: 5200,
          },
        ],
        subtotal: 14400,
        discountAmount: 400,
        taxAmount: 0,
        deliveryCharge: 200,
        grandTotal: 14200,
        paidAmount: 10000,
        dueAmount: 4200,
        paymentMethod: 'cash',
        warehouse: 'Main Warehouse',
        salesman: 'ব্যবসা অ্যাডমিন',
        status: 'confirmed',
        createdAt: '2026-03-25T11:30:00Z',
        updatedAt: '2026-03-25T11:30:00Z',
      },
    ],
    purchases: [
      {
        id: 'PUR-2001',
        billNo: 'BILL-2026-001',
        type: 'bill',
        supplierId: 'SUPP-001',
        supplierName: 'মেঘনা কনজিউমার্স লিঃ (Meghna Consumers Ltd)',
        date: '2026-03-20',
        time: '10:00:00',
        items: [
          {
            productId: 'PROD-001',
            productName: 'সয়াবিন তেল ৫ লিটার (Soybean Oil 5L)',
            unit: 'ltr',
            qty: 20,
            rate: 850,
            discount: 0,
            taxPercent: 0,
            total: 17000,
            batchNo: 'B-202603',
          },
        ],
        subtotal: 17000,
        discountAmount: 500,
        taxAmount: 0,
        additionalCharge: 200,
        grandTotal: 16700,
        paidAmount: 10000,
        dueAmount: 6700,
        paymentMethod: 'bank',
        warehouse: 'Main Warehouse',
        status: 'received',
        createdAt: '2026-03-20T10:00:00Z',
        updatedAt: '2026-03-20T10:00:00Z',
      },
    ],
    expenses: [
      {
        id: 'EXP-3001',
        expenseNo: 'EXP-2026-001',
        category: 'দোকান ভাড়া (Shop Rent)',
        description: 'মার্চ মাসের দোকান ও গোডাউন ভাড়া প্রদান',
        amount: 12000,
        date: '2026-03-05',
        paymentMethod: 'bank',
        paidBy: 'Company Cash',
        createdAt: '2026-03-05T12:00:00Z',
        updatedAt: '2026-03-05T12:00:00Z',
      },
      {
        id: 'EXP-3002',
        expenseNo: 'EXP-2026-002',
        category: 'বিদ্যুৎ ও ইউটিলিটি (Electricity & Utility)',
        description: 'পল্লী বিদ্যুৎ বিল পরিশোধ',
        amount: 3200,
        date: '2026-03-15',
        paymentMethod: 'mobile_banking',
        paidBy: 'Company Cash',
        createdAt: '2026-03-15T15:00:00Z',
        updatedAt: '2026-03-15T15:00:00Z',
      },
    ],
    payments: [
      {
        id: 'PAY-4001',
        paymentNo: 'PAY-IN-001',
        type: 'in',
        partyType: 'customer',
        partyId: 'CUST-001',
        partyName: 'আলমগীর স্টোর (Alamgir Store)',
        amount: 3000,
        paymentMethod: 'cash',
        referenceNo: 'INV-2026-001',
        date: '2026-03-27',
        notes: 'বকেয়া থেকে নগদ কালেকশন',
        createdAt: '2026-03-27T14:00:00Z',
        updatedAt: '2026-03-27T14:00:00Z',
      },
      {
        id: 'PAY-4002',
        paymentNo: 'PAY-OUT-001',
        type: 'out',
        partyType: 'supplier',
        partyId: 'SUPP-001',
        partyName: 'মেঘনা কনজিউমার্স লিঃ',
        amount: 5000,
        paymentMethod: 'bank',
        referenceNo: 'BILL-2026-001',
        date: '2026-03-24',
        notes: 'মেঘনা গ্রুপে চেক ক্লিয়ারেন্স',
        createdAt: '2026-03-24T16:00:00Z',
        updatedAt: '2026-03-24T16:00:00Z',
      },
    ],
    stockAdjustments: [],
    employees: [
      {
        id: 'EMP-001',
        employeeId: 'EMP-101',
        name: 'জাকির হোসেন',
        phone: '01755-123456',
        designation: 'সিনিয়র সেলস এক্সিকিউটিভ',
        department: 'Sales',
        salary: 22000,
        address: 'ধানমন্ডি, ঢাকা',
        joiningDate: '2025-01-15',
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'EMP-002',
        employeeId: 'EMP-102',
        name: 'সোহেল রানা',
        phone: '01866-987654',
        designation: 'গোডাউন ইন-চার্জ ও লজিস্টিক',
        department: 'Warehouse',
        salary: 18000,
        address: 'মিরপুর ২, ঢাকা',
        joiningDate: '2025-06-01',
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
    attendances: [],
    payrolls: [],
    manufacturingOrders: [],
    deliveries: [
      {
        id: 'DEL-5001',
        challanNo: 'CHL-2026-001',
        invoiceId: 'INV-1001',
        invoiceNo: 'INV-2026-001',
        customerName: 'আলমগীর স্টোর (Alamgir Store)',
        phone: '01819-876543',
        address: 'চকবাজার, ঢাকা',
        deliveryPerson: 'সোহেল রানা',
        deliveryDate: '2026-03-25',
        route: 'চকবাজার - লালবাগ রুট',
        status: 'delivered',
        notes: 'পণ্য নিরাপদে পৌঁছানো হয়েছে',
        createdAt: '2026-03-25T12:00:00Z',
        updatedAt: '2026-03-25T14:30:00Z',
      },
    ],
    auditLogs: [
      {
        id: 'LOG-001',
        timestamp: '2026-03-25 11:30:00',
        user: 'ADMIN',
        role: 'admin',
        module: 'Sales',
        action: 'CREATE',
        recordId: 'INV-2026-001',
        summary: 'নতুন ইনভয়েস তৈরি: ৳14,200 (আলমগীর স্টোর)',
      },
      {
        id: 'LOG-002',
        timestamp: '2026-03-27 14:00:00',
        user: 'ACCOUNTANT',
        role: 'accountant',
        module: 'Payments',
        action: 'CREATE',
        recordId: 'PAY-IN-001',
        summary: 'বকেয়া কালেকশন জমা: ৳3,000 (আলমগীর স্টোর)',
      },
    ],
    approvals: [],
    cashierShifts: [
      {
        id: 'SHIFT-01',
        cashierName: 'ব্যবসা অ্যাডমিন (Owner)',
        startTime: '2026-03-29 09:00:00',
        openingCash: 5000,
        totalSales: 14200,
        status: 'open',
      },
    ],
  },
};

// In-memory Database Store
let centralDb = { ...defaultInitialDb };

// Load database from file if exists
const loadDatabaseFromFile = () => {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (parsed && parsed.data && parsed.version) {
        centralDb = parsed;
        console.log(`[Central DB] Loaded version ${centralDb.version} from ${DB_FILE_PATH}`);
        return;
      }
    }
  } catch (err) {
    console.error('[Central DB] Error reading DB file, using default seed:', err);
  }

  // Save default initial DB
  saveDatabaseToFile();
};

// Atomic Save to file
let isSaving = false;
let pendingSave = false;

const saveDatabaseToFile = () => {
  if (isSaving) {
    pendingSave = true;
    return;
  }
  isSaving = true;
  try {
    const tempFilePath = `${DB_FILE_PATH}.tmp`;
    fs.writeFileSync(tempFilePath, JSON.stringify(centralDb, null, 2), 'utf-8');
    fs.renameSync(tempFilePath, DB_FILE_PATH);
  } catch (err) {
    console.error('[Central DB] Error saving to file:', err);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      saveDatabaseToFile();
    }
  }
};

// Initialize DB on startup
loadDatabaseFromFile();

// Connected SSE Clients for Live Synchronization
const sseClients = new Set<Response>();

const broadcastSyncUpdate = (senderClientId?: string) => {
  const payload = JSON.stringify({
    type: 'sync_update',
    version: centralDb.version,
    lastUpdated: centralDb.lastUpdated,
    data: centralDb.data,
    senderClientId: senderClientId || null,
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      sseClients.delete(client);
    }
  }
};

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // Shared Backend Synchronization Endpoints
  // ==========================================

  // 1. Get entire shared database
  app.get('/api/sync', (req: Request, res: Response) => {
    res.json({
      success: true,
      version: centralDb.version,
      lastUpdated: centralDb.lastUpdated,
      data: centralDb.data,
    });
  });

  // 2. Fast version check endpoint
  app.get('/api/sync/version', (req: Request, res: Response) => {
    res.json({
      success: true,
      version: centralDb.version,
      lastUpdated: centralDb.lastUpdated,
    });
  });

  // 3. Update shared database
  app.post('/api/sync', (req: Request, res: Response) => {
    try {
      const { data, clientId } = req.body;
      if (!data) {
        return res.status(400).json({ success: false, error: 'Data payload is required' });
      }

      centralDb.version += 1;
      centralDb.lastUpdated = new Date().toISOString();
      centralDb.data = {
        ...data,
        exportedAt: centralDb.lastUpdated,
      };

      saveDatabaseToFile();
      broadcastSyncUpdate(clientId);

      console.log(`[Central DB] Synchronized v${centralDb.version} from client ${clientId || 'unknown'}`);
      return res.json({
        success: true,
        version: centralDb.version,
        lastUpdated: centralDb.lastUpdated,
      });
    } catch (err: any) {
      console.error('[Central DB] Sync error:', err);
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // 4. Real-time Server-Sent Events (SSE) stream
  app.get('/api/sync/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial ping and current state info
    res.write(`data: ${JSON.stringify({ type: 'connected', version: centralDb.version, lastUpdated: centralDb.lastUpdated })}\n\n`);

    sseClients.add(res);

    // Keep connection alive with periodic comment heartbeat
    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch (err) {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // 5. Reset to clean sample data
  app.post('/api/sync/reset', (req: Request, res: Response) => {
    centralDb = {
      version: centralDb.version + 1,
      lastUpdated: new Date().toISOString(),
      data: defaultInitialDb.data,
    };
    saveDatabaseToFile();
    broadcastSyncUpdate();
    res.json({ success: true, version: centralDb.version, message: 'Central database reset to initial seed data' });
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString(), version: centralDb.version });
  });

  // ==========================================
  // Vite Dev Server / Static File Serving
  // ==========================================
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 BizAccount Server running on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
