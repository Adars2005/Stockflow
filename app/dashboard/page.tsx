"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Package, TrendingDown } from "lucide-react";

type DashboardData = {
    totalProducts: number;
    totalQuantity: number;
    lowStockItems: any[];
    defaultThreshold: number;
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await fetch("/api/dashboard");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <div>
                <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your inventory</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-violet-100 hover-lift bg-gradient-to-br from-violet-50 to-purple-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-violet-900">Total Products</CardTitle>
                        <Package className="h-6 w-6 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-violet-700">{data?.totalProducts || 0}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-blue-100 hover-lift bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Total Inventory</CardTitle>
                        <TrendingDown className="h-6 w-6 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-700">{data?.totalQuantity || 0}</div>
                        <p className="text-xs text-blue-600 mt-2 font-medium">units on hand</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-orange-100 hover-lift">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                        <CardTitle className="text-xl">Low Stock Items</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Products at or below their low stock threshold
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {data?.lowStockItems && data.lowStockItems.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Threshold</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.lowStockItems.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell>
                                            <span className="text-orange-600 font-semibold">
                                                {item.quantityOnHand}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.lowStockThreshold || data.defaultThreshold}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No low stock items. All products are adequately stocked! 🎉
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
