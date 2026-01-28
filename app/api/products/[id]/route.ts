import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db, { now } from "@/lib/db";
import { z } from "zod";

const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    description: z.string().optional(),
    quantityOnHand: z.number().int().min(0).optional(),
    costPrice: z.number().optional(),
    sellingPrice: z.number().optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    const product = db.prepare(`
    SELECT * FROM products WHERE id = ? AND organizationId = ?
  `).get(id, organizationId);

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = updateProductSchema.parse(body);
        const organizationId = (session.user as any).organizationId;

        // Verify product exists and belongs to organization
        const product = db.prepare(`
      SELECT * FROM products WHERE id = ? AND organizationId = ?
    `).get(id, organizationId);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check SKU uniqueness if changing SKU
        if (data.sku) {
            const existing = db.prepare(`
        SELECT * FROM products WHERE organizationId = ? AND sku = ? AND id != ?
      `).get(organizationId, data.sku, id);

            if (existing) {
                return NextResponse.json(
                    { error: "SKU already exists in your organization" },
                    { status: 400 }
                );
            }
        }

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (updates.length > 0) {
            values.push(now(), id, organizationId);
            db.prepare(`
        UPDATE products SET ${updates.join(", ")}, updatedAt = ?
        WHERE id = ? AND organizationId = ?
      `).run(...values);
        }

        const updatedProduct = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
        return NextResponse.json({ product: updatedProduct });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    const product = db.prepare(`
    SELECT * FROM products WHERE id = ? AND organizationId = ?
  `).get(id, organizationId);

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
}
