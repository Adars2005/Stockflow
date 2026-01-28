import NavLayout from "@/components/nav-layout";
import SessionWrapper from "@/components/session-wrapper";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <SessionWrapper>
            <NavLayout>{children}</NavLayout>
        </SessionWrapper>
    );
}
