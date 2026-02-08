// app/patient/dashboard/page.tsx

"use client";

import { useAuth } from "@/lib/context/auth-context";
import { useMyAppointments } from "@/lib/hooks/useAppointment";
// import { useMyPatientProfile } from "@/lib/hooks/useClinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  Stethoscope,
  Activity,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  formatDateAr,
  getAppointmentStatusLabel,
  getAppointmentStatusColor,
} from "@/lib/utils";

export default function PatientDashboard() {
  const { user } = useAuth();
  // const { data: profileData, isLoading: profileLoading } =
  //   useMyPatientProfile();
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useMyAppointments({
      page: 1,
      limit: 5,
    });

  // const profile = profileData?.data;
  // const appointments = appointmentsData?.data?.appointments || [];
  // const upcomingAppointments = appointments.filter(
  //   (apt: any) => apt.status === "confirmed" || apt.status === "pending",

  // );
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your health today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {appointmentsData?.data?.pagination?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time appointments
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                {/* <div className="text-2xl font-bold">
                  {upcomingAppointments.length}
                </div> */}
                <p className="text-xs text-muted-foreground">
                  Scheduled appointments
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* {profileLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-muted-foreground">
                  Based on recent checkups
                </p>
              </>
            )} */}
          </CardContent>
        </Card>

        {/* BMI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            {profileLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {profile?.bmi?.toFixed(1) || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.height && profile?.weight
                    ? "Normal range"
                    : "Add height & weight"}
                </p>
              </>
            )}
          </CardContent> */}
        </Card>
      </div>

      {/* Main Content */}
      

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/patient/doctors">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Find a Doctor</span>
              </Button>
            </Link>
            <Link href="/patient/appointments">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span>My Appointments</span>
              </Button>
            </Link>
            <Link href="/patient/medical-records">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Medical Records</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
