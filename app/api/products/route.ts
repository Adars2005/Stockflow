import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db, { generateId, now } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    description: z.string().optional(),
    quantityOnHand: z.number().int().min(0),
    costPrice: z.number().optional(),
    sellingPrice: z.number().optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
});

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    const products = db.prepare(`
    SELECT * FROM products WHERE organizationId = ? ORDER BY createdAt DESC
  `).all(organizationId);

    return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = productSchema.parse(body);
        const organizationId = (session.user as any).organizationId;

        // Check SKU uniqueness
        const existing = db.prepare(`
      SELECT * FROM products WHERE organizationId = ? AND sku = ?
    `).get(organizationId, data.sku);

        if (existing) {
            return NextResponse.json(
                { error: "SKU already exists in your organization" },
                { status: 400 }
            );
        }

        const id = generateId();
        const timestamp = now();

        db.prepare(`
      INSERT INTO products (
        id, organizationId, name, sku, description, 
        quantityOnHand, costPrice, sellingPrice, lowStockThreshold,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id,
            organizationId,
            data.name,
            data.sku,
            data.description || null,
            data.quantityOnHand,
            data.costPrice || null,
            data.sellingPrice || null,
            data.lowStockThreshold || null,
            timestamp,
            timestamp
        );

        const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
        return NextResponse.json({ product });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
