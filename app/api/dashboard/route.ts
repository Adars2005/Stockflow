import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;

    // Get total products
    const totalProducts = db.prepare(`
    SELECT COUNT(*) as count FROM products WHERE organizationId = ?
  `).get(organizationId) as any;

    // Get total quantity
    const totalQuantity = db.prepare(`
    SELECT SUM(quantityOnHand) as total FROM products WHERE organizationId = ?
  `).get(organizationId) as any;

    // Get settings for default threshold
    const settings = db.prepare(`
    SELECT * FROM settings WHERE organizationId = ?
  `).get(organizationId) as any;

    const defaultThreshold = settings?.defaultLowStockThreshold || 5;

    // Get low stock items
    const lowStockItems = db.prepare(`
    SELECT * FROM products 
    WHERE organizationId = ? 
    AND (
      (lowStockThreshold IS NOT NULL AND quantityOnHand <= lowStockThreshold)
      OR (lowStockThreshold IS NULL AND quantityOnHand <= ?)
    )
    ORDER BY quantityOnHand ASC
  `).all(organizationId, defaultThreshold);

    return NextResponse.json({
        totalProducts: totalProducts.count || 0,
        totalQuantity: totalQuantity.total || 0,
        lowStockItems,
        defaultThreshold,
    });
}
