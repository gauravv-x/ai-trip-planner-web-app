"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Plus,
} from "lucide-react";

interface AdminConfig {
  openrouterModel: string;
  openrouterApiKey: string;
  adminEmails: string[];
  updatedAt?: number;
  updatedBy?: string;
}

export default function ConfigPage() {
  const { user, isLoaded } = useUser();
  const [config, setConfig] = useState<AdminConfig>({
    openrouterModel: "",
    openrouterApiKey: "",
    adminEmails: [],
  });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Load configuration and check admin access
  useEffect(() => {
    if (!isLoaded) return;

    const checkAdminAndLoadConfig = async () => {
      try {
        const response = await fetch("/api/admin/config");

        if (response.status === 403) {
          setIsAdmin(false);
          const errorData = await response.json().catch(() => ({}));
          setMessage({ 
            type: "error", 
            text: errorData.message || errorData.error || "Access denied. Please check your admin email configuration." 
          });
          setLoading(false);
          return;
        }

        if (response.ok) {
          setIsAdmin(true);
          const data = await response.json();
          setConfig({
            openrouterModel: data.openrouterModel || "openrouter/polaris-alpha",
            openrouterApiKey: "", // don’t expose key
            adminEmails: data.adminEmails || [],
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
          });
        } else {
          throw new Error("Failed to load config");
        }
      } catch (error: any) {
        console.error("Error loading config:", error);
        const errorText = error?.message || "Failed to load configuration";
        setMessage({ type: "error", text: errorText });
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadConfig();
  }, [isLoaded]);

  // ✅ Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openrouterModel: config.openrouterModel,
          openrouterApiKey: config.openrouterApiKey,
          adminEmails: config.adminEmails,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Configuration updated successfully!" });
        setConfig((prev) => ({ ...prev, openrouterApiKey: "" })); // clear key for security
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update configuration" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin panel.
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator to get access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuration</h1>
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8">
          Manage OpenRouter API configuration and authorized admin emails.
        </p>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              OpenRouter Model
            </label>
            <input
              type="text"
              id="model"
              value={config.openrouterModel}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, openrouterModel: e.target.value }))
              }
              placeholder="e.g., openrouter/polaris-alpha"
              required
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              OpenRouter API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={config.openrouterApiKey}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, openrouterApiKey: e.target.value }))
              }
              placeholder="Enter new API key (leave empty to keep current)"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Admin Emails */}
          <div>
            <label
              htmlFor="adminEmails"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Emails
            </label>
            <div className="space-y-2">
              {config.adminEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.adminEmails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm"
                    >
                      <span className="text-gray-700 break-all">{email}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            adminEmails: prev.adminEmails.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="email"
                  id="newAdminEmail"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const email = newAdminEmail.trim();
                      if (email && !config.adminEmails.includes(email)) {
                        setConfig((prev) => ({
                          ...prev,
                          adminEmails: [...prev.adminEmails, email],
                        }));
                        setNewAdminEmail("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const email = newAdminEmail.trim();
                    if (email && !config.adminEmails.includes(email)) {
                      setConfig((prev) => ({
                        ...prev,
                        adminEmails: [...prev.adminEmails, email],
                      }));
                      setNewAdminEmail("");
                    }
                  }}
                  disabled={!newAdminEmail.trim() || config.adminEmails.includes(newAdminEmail.trim())}
                  variant="outline"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 sm:gap-4">
            <Button type="submit" disabled={saving} className="min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Save</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info */}
        {config.updatedAt && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              {new Date(config.updatedAt).toLocaleString()} by{" "}
              {config.updatedBy || "Unknown"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}