import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db, { generateId, now } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
    defaultLowStockThreshold: z.number().int().min(0),
});

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    let settings = db.prepare(`
    SELECT * FROM settings WHERE organizationId = ?
  `).get(organizationId) as any;

    // Create default settings if they don't exist
    if (!settings) {
        const id = generateId();
        const timestamp = now();
        db.prepare(`
      INSERT INTO settings (id, organizationId, defaultLowStockThreshold, updatedAt)
      VALUES (?, ?, 5, ?)
    `).run(id, organizationId, timestamp);

        settings = db.prepare(`SELECT * FROM settings WHERE id = ?`).get(id);
    }

    return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = settingsSchema.parse(body);
        const organizationId = (session.user as any).organizationId;

        db.prepare(`
      UPDATE settings 
      SET defaultLowStockThreshold = ?, updatedAt = ?
      WHERE organizationId = ?
    `).run(data.defaultLowStockThreshold, now(), organizationId);

        const settings = db.prepare(`
      SELECT * FROM settings WHERE organizationId = ?
    `).get(organizationId);

        return NextResponse.json({ settings });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Update settings error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
