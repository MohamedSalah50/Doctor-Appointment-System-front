// app/patient/dashboard/page.tsx

"use client";

import { useAuth } from "@/lib/context/auth-context";
import { useMyAppointments } from "@/lib/hooks/useAppointment";
import { useMyPatientProfile } from "@/lib/hooks/useClinic";
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
  const { data: profileData, isLoading: profileLoading } =
    useMyPatientProfile();
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useMyAppointments({
      page: 1,
      limit: 5,
    });

  const profile = profileData?.data;
  const appointments = appointmentsData?.data?.appointments || [];
  const upcomingAppointments = appointments.filter(
    (apt: any) => apt.status === "confirmed" || apt.status === "pending",
  );

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
                <div className="text-2xl font-bold">
                  {upcomingAppointments.length}
                </div>
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
            {profileLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-muted-foreground">
                  Based on recent checkups
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* BMI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Upcoming Appointments
            </CardTitle>
            <Link href="/patient/appointments">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsLoading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment: any) => (
                <div
                  key={appointment._id}
                  className="flex items-start space-x-4 space-x-reverse p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Dr. {appointment.doctorId?.userId?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.doctorId?.specialty || "General"}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDateAr(appointment.scheduledDate, "PPP")}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getAppointmentStatusColor(appointment.status)}
                  >
                    {getAppointmentStatusLabel(appointment.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No upcoming appointments
                </p>
                <Link href="/patient/doctors">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Summary */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Health Summary</CardTitle>
            <Link href="/patient/profile">
              <Button variant="ghost" size="sm">
                Update
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              <>
                {/* Blood Type */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Blood Type</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.bloodType || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Activity className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Allergies</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.allergies?.length
                          ? profile.allergies.join(", ")
                          : "None reported"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Chronic Conditions</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.chronicDiseases?.length
                          ? profile.chronicDiseases.join(", ")
                          : "None reported"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {profile?.emergencyContact && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Emergency Contact</p>
                        <p className="text-xs text-muted-foreground">
                          {profile.emergencyContact.name} (
                          {profile.emergencyContact.relationship})
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
