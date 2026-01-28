# 🚀 StockFlow - Quick Start Guide

## Running the Application

The app is **already running** on the dev server!

### Access the App
Open your browser and go to:
- **http://localhost:3000** ✓

> If port 3000 is in use, Next.js will automatically use port 3001 or higher.

---

## First Time Setup

### 1. Create Your Account (Signup)
1. Navigate to http://localhost:3001
2. You'll see the login page - click **"Sign up"**
3. Fill in the form:
   - **Organization Name**: Your company name (e.g., "My Store")
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Same password
4. Click **"Sign Up"**
5. You'll be redirected to login

### 2. Login
1. Enter your email and password
2. Click **"Sign In"**
3. You're now in the dashboard! 🎉

---

## Using StockFlow

### Dashboard
- See total products and inventory at a glance
- Monitor low-stock items automatically
- Access from sidebar: **Dashboard**

### Add Your First Product
1. Click **"Products"** in the sidebar
2. Click **"Add Product"** button
3. Fill in the details:
   - **Name**: Product name
   - **SKU**: Unique identifier (e.g., "WIDGET-001")
   - **Quantity on Hand**: Current stock count
   - **Selling Price**: Optional
   - **Low Stock Threshold**: When to alert (optional)
4. Click **"Create Product"**

### Manage Products
- **Edit**: Click the pencil icon next to any product
- **Delete**: Click the trash icon (confirms before deleting)
- **Search**: Use the search bar to find products by name or SKU

### Low Stock Alerts
Products show a **"Low Stock"** indicator when:
- Quantity ≤ Product's custom threshold, OR
- Quantity ≤ Organization default (if no custom threshold)

### Settings
1. Click **"Settings"** in sidebar
2. Set your **Default Low Stock Threshold**
3. This applies to all products without a custom threshold

---

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is in use", Next.js will automatically use **port 3001** (or 3002, etc.)

Just use whatever port the terminal shows:
```
✓ Ready in 2.7s
- Local: http://localhost:3001  ← Use this URL
```

### To Stop the Server
Press `Ctrl+C` in the terminal

### To Restart
```bash
npm run dev
```

---

## Quick Test Flow

1. **Signup** → test@example.com / Test123!
2. **Add Product** → Widget A, SKU: W001, Qty: 100
3. **Add Low Stock Item** → Widget B, SKU: W002, Qty: 3, Threshold: 10
4. **Check Dashboard** → See Widget B in low-stock alerts
5. **Edit Product** → Update quantity, see alerts change
6. **Settings** → Change default threshold to see effect

---

## Tips

- SKUs must be **unique per organization**
- Low stock alerts update **in real-time**
- Each organization's data is **completely isolated**
- Search works for both **product names and SKUs**

**Enjoy managing your inventory!** 📦
