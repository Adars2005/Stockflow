import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import db, { generateId, now } from "@/lib/db";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    organizationName: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, organizationName } = signupSchema.parse(body);

        // Check if user already exists
        const existingUser = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Create organization and user in transaction
        const orgId = generateId();
        const userId = generateId();
        const timestamp = now();
        const passwordHash = await bcrypt.hash(password, 10);

        const transaction = db.transaction((orgId, orgName, userId, email, passwordHash, timestamp) => {
            db.prepare(`
        INSERT INTO organizations (id, name, createdAt, updatedAt)
        VALUES (?, ?, ?, ?)
      `).run(orgId, orgName, timestamp, timestamp);

            db.prepare(`
        INSERT INTO users (id, email, passwordHash, organizationId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, email, passwordHash, orgId, timestamp, timestamp);

            // Create default settings
            db.prepare(`
        INSERT INTO settings (id, organizationId, defaultLowStockThreshold, updatedAt)
        VALUES (?, ?, 5, ?)
      `).run(generateId(), orgId, timestamp);
        });

        transaction(orgId, organizationName, userId, email, passwordHash, timestamp);

        return NextResponse.json({ success: true, email });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
