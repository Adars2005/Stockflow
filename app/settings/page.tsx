"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [threshold, setThreshold] = useState(5);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const json = await res.json();
            if (json.settings) {
                setThreshold(json.settings.defaultLowStockThreshold);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setSaving(true);

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ defaultLowStockThreshold: threshold }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to update settings");
                return;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your organization settings</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Default Low Stock Threshold</CardTitle>
                    <CardDescription>
                        This value is used for products that don't have a specific low stock threshold set.
                        Products with quantity at or below this value will appear in the low stock alert.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="threshold">Threshold Value</Label>
                            <Input
                                id="threshold"
                                type="number"
                                min="0"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                                required
                                className="max-w-xs"
                            />
                            <p className="text-sm text-gray-500">
                                Products with quantity ≤ {threshold} will be flagged as low stock
                            </p>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-green-600">Settings updated successfully!</p>}

                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
