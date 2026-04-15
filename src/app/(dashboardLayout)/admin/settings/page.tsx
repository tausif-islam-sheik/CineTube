"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Mail,
  Save,
  RefreshCw,
  Database,
  Lock,
  Users,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultLanguage: string;
}

interface ModerationSettings {
  autoApproveReviews: boolean;
  requireEmailVerification: boolean;
  maxReviewsPerDay: number;
  spoilerThreshold: number;
  enableContentFiltering: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  reviewAlerts: boolean;
  newUserAlerts: boolean;
  dailyDigest: boolean;
  adminEmail: string;
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "CineTube",
    siteDescription: "Your ultimate movie streaming platform",
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: "en",
  });

  // Moderation Settings State
  const [moderationSettings, setModerationSettings] = useState<ModerationSettings>({
    autoApproveReviews: false,
    requireEmailVerification: true,
    maxReviewsPerDay: 10,
    spoilerThreshold: 3,
    enableContentFiltering: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    reviewAlerts: true,
    newUserAlerts: false,
    dailyDigest: false,
    adminEmail: "admin@cinetube.com",
  });

  // Save Settings Mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: {
      site?: SiteSettings;
      moderation?: ModerationSettings;
      notifications?: NotificationSettings;
    }) => {
      const { data } = await apiClient.patch("/api/v1/admin/settings", settings);
      return data;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  // Reset Settings
  const handleReset = () => {
    setSiteSettings({
      siteName: "CineTube",
      siteDescription: "Your ultimate movie streaming platform",
      maintenanceMode: false,
      allowRegistration: true,
      defaultLanguage: "en",
    });
    setModerationSettings({
      autoApproveReviews: false,
      requireEmailVerification: true,
      maxReviewsPerDay: 10,
      spoilerThreshold: 3,
      enableContentFiltering: true,
    });
    setNotificationSettings({
      emailNotifications: true,
      reviewAlerts: true,
      newUserAlerts: false,
      dailyDigest: false,
      adminEmail: "admin@cinetube.com",
    });
    toast.info("Settings reset to defaults");
  };

  // Save All Settings
  const handleSave = () => {
    saveSettingsMutation.mutate({
      site: siteSettings,
      moderation: moderationSettings,
      notifications: notificationSettings,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform configuration and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={saveSettingsMutation.isPending}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saveSettingsMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Configure basic site settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, siteName: e.target.value })
                    }
                    placeholder="Enter site name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, siteDescription: e.target.value })
                    }
                    placeholder="Enter site description"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <select
                    id="defaultLanguage"
                    value={siteSettings.defaultLanguage}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, defaultLanguage: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSiteSettings({ ...siteSettings, maintenanceMode: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch
                    checked={siteSettings.allowRegistration}
                    onCheckedChange={(checked) =>
                      setSiteSettings({ ...siteSettings, allowRegistration: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Settings */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Content Moderation
              </CardTitle>
              <CardDescription>
                Configure review and content moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Approve Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new reviews without moderation
                    </p>
                  </div>
                  <Switch
                    checked={moderationSettings.autoApproveReviews}
                    onCheckedChange={(checked) =>
                      setModerationSettings({ ...moderationSettings, autoApproveReviews: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify email before posting reviews
                    </p>
                  </div>
                  <Switch
                    checked={moderationSettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setModerationSettings({
                        ...moderationSettings,
                        requireEmailVerification: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Content Filtering</Label>
                    <p className="text-sm text-muted-foreground">
                      Filter inappropriate content in reviews
                    </p>
                  </div>
                  <Switch
                    checked={moderationSettings.enableContentFiltering}
                    onCheckedChange={(checked) =>
                      setModerationSettings({
                        ...moderationSettings,
                        enableContentFiltering: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="maxReviewsPerDay">Max Reviews Per Day</Label>
                  <Input
                    id="maxReviewsPerDay"
                    type="number"
                    min={1}
                    max={100}
                    value={moderationSettings.maxReviewsPerDay}
                    onChange={(e) =>
                      setModerationSettings({
                        ...moderationSettings,
                        maxReviewsPerDay: parseInt(e.target.value) || 10,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of reviews a user can submit per day
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="spoilerThreshold">Spoiler Threshold</Label>
                  <Input
                    id="spoilerThreshold"
                    type="number"
                    min={1}
                    max={10}
                    value={moderationSettings.spoilerThreshold}
                    onChange={(e) =>
                      setModerationSettings({
                        ...moderationSettings,
                        spoilerThreshold: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of spoiler reports before auto-hiding content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={notificationSettings.adminEmail}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        adminEmail: e.target.value,
                      })
                    }
                    placeholder="admin@example.com"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for important events
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Review Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new reviews are submitted
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.reviewAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        reviewAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New User Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new users register
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newUserAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newUserAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of platform activity
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        dailyDigest: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked={false} disabled />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min={5}
                    max={480}
                    defaultValue={60}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-logout after period of inactivity (coming soon)
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">API Access Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all API requests for security auditing
                    </p>
                  </div>
                  <Switch defaultChecked={true} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Database className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/20 p-4">
                <div className="space-y-0.5">
                  <Label className="text-base text-destructive">Clear All Cache</Label>
                  <p className="text-sm text-muted-foreground">
                    Clear all cached data and sessions
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
