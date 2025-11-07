"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Settings, Save, AlertCircle, CheckCircle2, Loader2, X, Plus } from "lucide-react";

interface AdminConfig {
  openrouterModel: string;
  openrouterApiKey: string;
  adminEmails: string[];
  updatedAt?: number;
  updatedBy?: string;
}

export default function AdminPage() {
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

  // Check if user is admin and load config
  useEffect(() => {
    if (!isLoaded) return;

    const checkAdminAndLoadConfig = async () => {
      try {
        const response = await fetch("/api/admin/config");
        
        if (response.status === 403) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (response.ok) {
          setIsAdmin(true);
          const data = await response.json();
          setConfig({
            openrouterModel: data.openrouterModel || "openrouter/polaris-alpha",
            openrouterApiKey: "", // This will be empty from API for security
            adminEmails: data.adminEmails || [],
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
          });
        } else {
          throw new Error("Failed to load config");
        }
      } catch (error) {
        console.error("Error loading config:", error);
        setMessage({ type: "error", text: "Failed to load configuration" });
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadConfig();
  }, [isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          openrouterModel: config.openrouterModel,
          openrouterApiKey: config.openrouterApiKey,
          adminEmails: config.adminEmails,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Configuration updated successfully!" });
        // Clear the API key field after saving for security
        setConfig((prev) => ({ ...prev, openrouterApiKey: "" }));
        // Reload config to get updated admin emails
        const reloadResponse = await fetch("/api/admin/config");
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          setConfig((prev) => ({
            ...prev,
            adminEmails: reloadData.adminEmails || [],
            updatedAt: reloadData.updatedAt,
            updatedBy: reloadData.updatedBy,
          }));
        }
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <p className="text-gray-600 mb-8">
            Manage OpenRouter API configuration. Changes take effect immediately.
          </p>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Config Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OpenRouter Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                OpenRouter Model
              </label>
              <input
                type="text"
                id="model"
                value={config.openrouterModel}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, openrouterModel: e.target.value }))
                }
                placeholder="e.g., openrouter/polaris-alpha, openrouter/meta-llama/llama-3.1-405b-instruct"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the OpenRouter model identifier. Leave empty to use default.
              </p>
            </div>

            {/* OpenRouter API Key */}
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a new API key to update it. Leave empty to keep the current key.
              </p>
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
                {/* List of admin emails */}
                {config.adminEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {config.adminEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md text-sm"
                      >
                        <span className="text-gray-700">{email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setConfig((prev) => ({
                              ...prev,
                              adminEmails: prev.adminEmails.filter((_, i) => i !== index),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add new email input */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="newAdminEmail"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Enter admin email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add email addresses that should have admin access. Changes take effect immediately.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Changes are applied immediately to all new requests</li>
                <li>If the API key is invalid, the site will fall back to environment variables</li>
                <li>Make sure the model name is correct and available on OpenRouter</li>
                <li>You can find available models at{" "}
                  <a
                    href="https://openrouter.ai/models"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600"
                  >
                    openrouter.ai/models
                  </a>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Current Config Info */}
          {config.updatedAt && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
              <p className="text-sm text-gray-600">
                {new Date(config.updatedAt).toLocaleString()} by {config.updatedBy || "Unknown"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

