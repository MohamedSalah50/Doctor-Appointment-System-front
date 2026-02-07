// app/doctor/dashboard/page.tsx

"use client";

import { useAuth } from "@/lib/context/auth-context";
import { useDoctorAppointments } from "@/lib/hooks/useAppointment";
import { useMyDoctorProfile, useMyDoctorStats } from "@/lib/hooks/useDoctor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDateAr, getAppointmentStatusLabel, getAppointmentStatusColor } from "@/lib/utils";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useMyDoctorProfile();
  const { data: statsData, isLoading: statsLoading } = useMyDoctorStats();
  const { data: appointmentsData, isLoading: appointmentsLoading } = useDoctorAppointments({
    page: 1,
    limit: 5,
  });

  const profile = profileData?.data;
  const stats = statsData?.data;
  const appointments = appointmentsData?.data?.appointments || [];
  
  const todayAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.scheduledDate);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const pendingAppointments = appointments.filter(
    (apt: any) => apt.status === "pending"
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Dr. {user?.fullName?.split(" ")[0]}! 👨‍⚕️
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your practice overview for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.totalPatients || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time patients
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.totalAppointments || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time appointments
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center">
                  {stats?.rating?.toFixed(1) || "N/A"}
                  {stats?.rating && (
                    <Star className="h-5 w-5 ml-1 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalReviews || 0} reviews
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.isAcceptingNewPatients ? (
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Inactive
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.isVerified ? "Verified" : "Pending verification"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Appointments */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Today's Schedule
            </CardTitle>
            <Link href="/doctor/appointments">
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
            ) : todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map((appointment: any) => (
                <div
                  key={appointment._id}
                  className="flex items-start space-x-4 space-x-reverse p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {appointment.patientId?.userId?.fullName || "Unknown Patient"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.appointmentType || "Consultation"}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDateAr(appointment.scheduledDate, "p")}
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
                <p className="text-sm text-muted-foreground">
                  No appointments scheduled for today
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Pending Actions
            </CardTitle>
            <Badge variant="destructive" className="rounded-full">
              {pendingAppointments.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : pendingAppointments.length > 0 ? (
              pendingAppointments.slice(0, 4).map((appointment: any) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">
                        New appointment request
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.patientId?.userId?.fullName || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  All caught up! No pending actions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-900">
                {appointmentsData?.data?.pagination?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {appointments.filter((a: any) => a.status === "completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertCircle className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-900">
                {pendingAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="h-8 w-8 text-red-600 mb-2" />
              <p className="text-2xl font-bold text-red-900">
                {appointments.filter((a: any) => a.status === "cancelled").length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/doctor/schedule">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Manage Schedule</span>
              </Button>
            </Link>
            <Link href="/doctor/appointments">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>View Patients</span>
              </Button>
            </Link>
            <Link href="/doctor/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Update Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}