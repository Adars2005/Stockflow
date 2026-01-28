"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle, Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

type Product = {
    id: string;
    name: string;
    sku: string;
    quantityOnHand: number;
    sellingPrice: number | null;
    lowStockThreshold: number | null;
};

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const json = await res.json();
            setProducts(json.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-gray-600 mt-1">{products.length} total products</p>
                </div>
                <Button onClick={() => router.push("/products/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {filteredProducts.length > 0 ? (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.quantityOnHand}</TableCell>
                                    <TableCell>
                                        {product.sellingPrice ? `$${product.sellingPrice.toFixed(2)}` : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {product.lowStockThreshold &&
                                            product.quantityOnHand <= product.lowStockThreshold ? (
                                            <span className="flex items-center gap-1 text-orange-600 text-sm">
                                                <AlertCircle className="h-4 w-4" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-green-600 text-sm">In Stock</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/products/${product.id}/edit`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg border-dashed">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? "Try a different search term" : "Get started by adding your first product"}
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => router.push("/products/new")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
