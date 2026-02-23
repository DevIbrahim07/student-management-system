import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboard";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const isStudent = user?.role === "student";

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchDashboardStats();
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load dashboard stats.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Student specific stat cards
  const studentStatCards = [
    {
      label: "Roll Number",
      value: stats?.rollNumber ?? "N/A",
      icon: Award,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Class",
      value: stats?.className ?? "N/A",
      icon: BookOpen,
      gradient: "from-teal-500 to-cyan-500",
      bg: "bg-teal-50",
    },
    {
      label: "Average Marks",
      value: stats?.averageMarks ?? "0",
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
    },
    {
      label: "Attendance",
      value: `${stats?.attendancePercentage ?? 0}%`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
    },
  ];

  // Teacher/Admin stat cards
  const adminStatCards = [
    {
      label: "Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Subjects",
      value: stats?.totalSubjects ?? 0,
      icon: BookOpen,
      gradient: "from-teal-500 to-cyan-500",
      bg: "bg-teal-50",
    },
    {
      label: "Marks Entries",
      value: stats?.totalMarksEntries ?? 0,
      icon: Award,
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
    },
    {
      label: "Overall Average",
      value: stats?.overallAverage ?? 0,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
  ];

  const statCards = isStudent ? studentStatCards : adminStatCards;

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="shrink-0">
        <h2 className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent">
          {isStudent
            ? `Welcome, ${stats?.studentName || "Student"}!`
            : "Dashboard"}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isStudent
            ? "View your academic performance and attendance."
            : "Overview of system activity and performance."}
        </p>
      </div>

      {isLoading && (
        <div className="animate-pulse rounded-xl border border-emerald-200 bg-white p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
            Loading stats...
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`group relative overflow-hidden rounded-xl ${card.bg} border border-gray-200 p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        {card.label}
                      </p>
                      <div
                        className={`rounded-lg bg-linear-to-br ${card.gradient} p-2 shadow-md`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-linear-to-br ${card.gradient} opacity-10 transition-transform duration-300 group-hover:scale-150`}
                  />
                </div>
              );
            })}
          </div>

          {isStudent && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-md">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Your Performance
                  </h3>
                  <p className="mt-1 text-sm text-emerald-800">
                    You have completed {stats?.totalMarks || 0} assessments with
                    an average of{" "}
                    <span className="font-bold">
                      {stats?.averageMarks || 0}%
                    </span>
                    . Your attendance is{" "}
                    <span className="font-bold">
                      {stats?.attendancePercentage || 0}%
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
