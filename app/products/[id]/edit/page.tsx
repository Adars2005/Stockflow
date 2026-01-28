"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Props = {
    params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        quantityOnHand: 0,
        costPrice: "",
        sellingPrice: "",
        lowStockThreshold: "",
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const json = await res.json();

            if (res.ok && json.product) {
                const p = json.product;
                setFormData({
                    name: p.name,
                    sku: p.sku,
                    description: p.description || "",
                    quantityOnHand: p.quantityOnHand,
                    costPrice: p.costPrice?.toString() || "",
                    sellingPrice: p.sellingPrice?.toString() || "",
                    lowStockThreshold: p.lowStockThreshold?.toString() || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                sku: formData.sku,
                description: formData.description || undefined,
                quantityOnHand: formData.quantityOnHand,
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
                sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : undefined,
                lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : undefined,
            };

            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to update product");
                return;
            }

            router.push("/products");
            router.refresh();
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Edit Product</h1>
                    <p className="text-gray-600 mt-1">Update product details</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantityOnHand">Quantity on Hand *</Label>
                                <Input
                                    id="quantityOnHand"
                                    type="number"
                                    min="0"
                                    value={formData.quantityOnHand}
                                    onChange={(e) =>
                                        setFormData({ ...formData, quantityOnHand: parseInt(e.target.value) || 0 })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="costPrice">Cost Price</Label>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sellingPrice">Selling Price</Label>
                                <Input
                                    id="sellingPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.sellingPrice}
                                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                            <Input
                                id="lowStockThreshold"
                                type="number"
                                min="0"
                                value={formData.lowStockThreshold}
                                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                placeholder="Uses default if empty"
                            />
                            <p className="text-sm text-gray-500">
                                Leave empty to use organization default threshold
                            </p>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
