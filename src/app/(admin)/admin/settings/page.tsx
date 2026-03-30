"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Settings {
  collection_address: string;
  collection_hours: string;
  collection_instructions: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    collection_address: "",
    collection_hours: "",
    collection_instructions: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Settings saved");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your store&apos;s collection details
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Collection Point</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Collection Address</Label>
              <Input
                id="address"
                value={settings.collection_address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    collection_address: e.target.value,
                  })
                }
                placeholder="e.g. Blk 123 Tampines St 45, #01-678, Singapore 520123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Collection Hours</Label>
              <Input
                id="hours"
                value={settings.collection_hours}
                onChange={(e) =>
                  setSettings({ ...settings, collection_hours: e.target.value })
                }
                placeholder="e.g. Mon-Fri: 12pm-8pm, Sat: 10am-6pm, Sun: Closed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Collection Instructions</Label>
              <Textarea
                id="instructions"
                value={settings.collection_instructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    collection_instructions: e.target.value,
                  })
                }
                placeholder="e.g. Please bring your order confirmation email and a valid ID"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </div>
  );
}
