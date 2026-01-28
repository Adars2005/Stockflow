import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import db from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
                const user = stmt.get(email) as any;

                if (!user) return null;

                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) return null;

                // Get organization
                const orgStmt = db.prepare(`SELECT * FROM organizations WHERE id = ?`);
                const org = orgStmt.get(user.organizationId) as any;

                return {
                    id: user.id,
                    email: user.email,
                    organizationId: user.organizationId,
                    organizationName: org?.name || "",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.organizationId = (user as any).organizationId;
                token.organizationName = (user as any).organizationName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.userId;
                (session.user as any).organizationId = token.organizationId;
                (session.user as any).organizationName = token.organizationName;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
})
