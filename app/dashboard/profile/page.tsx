"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, LogOut } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { profileSchema } from "@/lib/validations";
import { INDIAN_STATES, OCCUPATIONS, EDUCATION_LEVELS, SOCIAL_CATEGORIES } from "@/lib/constants";
import { SignOutButton } from "@clerk/nextjs";
import type { z } from "zod";

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(0);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const booleans = ["isStudent", "isFarmer", "isBusinessOwner", "hasDisability", "isWidow"] as const;

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.data;
          reset({
            name: p.name,
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split("T")[0] : "",
            gender: p.gender,
            phone: p.phone,
            annualIncome: p.annualIncome,
            occupation: p.occupation,
            education: p.education,
            category: p.category,
            state: p.state,
            district: p.district,
            isStudent: p.isStudent,
            isFarmer: p.isFarmer,
            isBusinessOwner: p.isBusinessOwner,
            hasDisability: p.hasDisability,
            isWidow: p.isWidow,
          });
          setCompletion(p.profileCompletion || 0);
        }
      })
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: ProfileForm) {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setCompletion(result.data.profileCompletion || 0);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <DashboardLayout><div className="animate-pulse h-96 bg-muted rounded-2xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">Complete your profile for accurate eligibility analysis.</p>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Profile Completion</span>
              <span className="font-medium">{completion}%</span>
            </div>
            <Progress value={completion} />
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" {...register("gender")}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="10-digit mobile" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Socio-Economic Details</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                <Input id="annualIncome" type="number" {...register("annualIncome")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Select id="occupation" {...register("occupation")}>
                  <option value="">Select</option>
                  {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Select id="education" {...register("education")}>
                  <option value="">Select</option>
                  {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Social Category</Label>
                <Select id="category" {...register("category")}>
                  <option value="">Select</option>
                    {SOCIAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select id="state" {...register("state")}>
                  <option value="">Select</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" {...register("district")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Additional Status</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              {booleans.map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watch(field) || false}
                    onChange={(e) => setValue(field, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{field.replace(/([A-Z])/g, " $1").replace("is ", "")}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" variant="gradient" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Profile
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
