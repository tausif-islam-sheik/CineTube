"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, CalendarDays, CreditCard, Crown, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type UserSubscription = {
  id: string;
  status: string;
  endDate: string | null;
  autoRenew: boolean;
  tier?: {
    name?: string;
    displayName?: string;
    price?: number;
    currency?: string;
  };
};

type UserPayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  description?: string | null;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    image: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  const { data: activeSubscription, isLoading: subscriptionLoading } = useQuery<UserSubscription | null>({
    queryKey: ["profile-active-subscription"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/subscription");
      return data.data;
    },
    enabled: !!session,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<UserPayment[]>({
    queryKey: ["profile-payments"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/payments?limit=5&page=1&sortBy=createdAt&order=desc");
      return data.data ?? [];
    },
    enabled: !!session,
  });

  const { data: profileData, isLoading: profileLoading } = useQuery<UserProfile | null>({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/profile");
      return data.data;
    },
    enabled: !!session,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    if (profileData) {
      setProfileForm({
        name: profileData.name || session.user.name || "",
        image: profileData.image || session.user.image || "",
        phone: profileData.phone || "",
        gender: profileData.gender || "",
        dateOfBirth: profileData.dateOfBirth
          ? new Date(profileData.dateOfBirth).toISOString().slice(0, 10)
          : "",
      });
      return;
    }
    setProfileForm({
      name: session.user.name || "",
      image: session.user.image || "",
      phone: "",
      gender: "",
      dateOfBirth: "",
    });
  }, [session, profileData]);

  const handleProfileImageFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfileForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/api/v1/user/profile", {
        name: profileForm.name,
        image: profileForm.image,
        phone: profileForm.phone,
        gender: profileForm.gender,
        dateOfBirth: profileForm.dateOfBirth,
      });
    },
    onSuccess: () => {
      toast.success("Profile details saved");
      queryClient.invalidateQueries({ queryKey: ["user-profile", session?.user?.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    },
  });

  const handleProfileSave = () => {
    updateProfileMutation.mutate();
  };

  if (isPending || !session) {
    return (
      <section className="container mx-auto px-4 py-16 md:px-8">
        <div className="mx-auto h-48 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {profileLoading ? "Loading..." : profileForm.name || session.user.name || "CineTube User"}
              </h1>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/watchlist" className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <span className="font-semibold">Watchlist</span>
              </div>
              <p className="text-sm text-muted-foreground">Review and manage saved titles.</p>
            </Link>
            <Link href="/pricing" className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-semibold">Subscription</span>
              </div>
              <p className="text-sm text-muted-foreground">Upgrade or manage your plan.</p>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Personal Information</h2>
            <Button size="sm" onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                  {profileForm.image ? (
                    <img src={profileForm.image} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProfileImageFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                  {profileForm.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setProfileForm((prev) => ({ ...prev, image: "" }))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">PNG/JPG/WEBP up to 2MB.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileName">Full Name</Label>
              <Input
                id="profileName"
                placeholder="Your name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePhone">Phone Number</Label>
              <Input
                id="profilePhone"
                placeholder="+8801XXXXXXXXX"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileGender">Gender</Label>
              <select
                id="profileGender"
                value={profileForm.gender}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileDob">Date of Birth</Label>
              <Input
                id="profileDob"
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Billing & Subscription</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">Manage Plan</Link>
            </Button>
          </div>

          {subscriptionLoading ? (
            <div className="h-20 animate-pulse rounded-lg border border-border bg-muted/40" />
          ) : activeSubscription ? (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <p className="font-semibold">
                    {activeSubscription.tier?.displayName || activeSubscription.tier?.name || "Active Plan"}
                  </p>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                  {activeSubscription.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Renews/Ends: {formatDate(activeSubscription.endDate)}
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Auto renew: {activeSubscription.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              You have no active subscription right now.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Recent Payment History</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">Upgrade / Renew</Link>
            </Button>
          </div>

          {paymentsLoading ? (
            <div className="space-y-2">
              <div className="h-12 animate-pulse rounded-lg border border-border bg-muted/40" />
              <div className="h-12 animate-pulse rounded-lg border border-border bg-muted/40" />
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {payment.amount} {payment.currency.toUpperCase()} • {payment.paymentMethod}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No payment records yet.
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/discover">Continue Exploring</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/faq">Need Help?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
