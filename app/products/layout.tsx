import NavLayout from "@/components/nav-layout";
import { SessionProvider } from "next-auth/react";

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <NavLayout>{children}</NavLayout>
        </SessionProvider>
    );
}
