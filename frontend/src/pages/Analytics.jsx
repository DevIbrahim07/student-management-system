import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchAnalytics } from "@/services/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to load analytics.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        No analytics data available.
      </div>
    );
  }

  const classAverageData =
    analytics.averagesBySubject?.map((item) => ({
      name: item.subject,
      average: item.average,
    })) || [];

  const topperData =
    analytics.toppers?.map((student, index) => ({
      name: student.name,
      average: student.averageMarks,
      position: index + 1,
    })) || [];

  const weakStudentsData =
    analytics.weakStudents?.map((student) => ({
      name: student.name,
      average: student.averageMarks,
    })) || [];

  const lowAttendanceData =
    analytics.lowAttendance?.map((student) => ({
      name: student.name,
      percentage: student.attendancePercentage,
    })) || [];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="flex h-full flex-col space-y-4">
      <div
        className="shrink-0 animate-in fade-in slide-in-from-top-4"
        style={{ animationDuration: "500ms" }}
      >
        <h2 className="text-xl font-semibold">Analytics & Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of student performance and attendance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="group animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border bg-linear-to-br from-emerald-50 to-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "100ms" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Students
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700 transition-colors group-hover:text-emerald-600">
            {analytics.totalStudents || 0}
          </div>
        </div>
        <div
          className="group animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border bg-linear-to-br from-blue-50 to-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "200ms" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Class Average
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-700 transition-colors group-hover:text-blue-600">
            {analytics.classAverage?.toFixed(1) || 0}%
          </div>
        </div>
        <div
          onClick={() => setOpenDialog("topPerformers")}
          className="group animate-in fade-in slide-in-from-bottom-4 cursor-pointer rounded-lg border border-border bg-linear-to-br from-purple-50 to-card p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
          style={{ animationDelay: "300ms" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Top Performers
          </div>
          <div className="mt-2 truncate text-base font-bold text-purple-700 transition-colors group-hover:text-purple-600">
            {topperData[0]?.name || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">
            {topperData.length} students • Click to view all
          </div>
        </div>
        <div
          onClick={() => setOpenDialog("lowAttendance")}
          className="group animate-in fade-in slide-in-from-bottom-4 cursor-pointer rounded-lg border border-border bg-linear-to-br from-amber-50 to-card p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
          style={{ animationDelay: "400ms" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Low Attendance
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 transition-colors group-hover:text-amber-600">
            {analytics.lowAttendance?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            &lt; 75% • Click to view all
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2">
        {/* Class Average by Subject */}
        {classAverageData.length > 0 && (
          <div
            className="animate-in fade-in slide-in-from-left-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: "500ms" }}
          >
            <h3 className="mb-3 text-base font-semibold">
              Average Marks by Subject
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classAverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Performers */}
        {topperData.length > 0 && (
          <div
            className="animate-in fade-in slide-in-from-right-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: "600ms" }}
          >
            <h3 className="mb-3 text-base font-semibold">Top Performers</h3>
            <div className="space-y-2">
              {topperData.slice(0, 5).map((student, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-lg bg-linear-to-r from-emerald-50 to-transparent p-3 transition-all duration-300 hover:scale-105 hover:from-emerald-100 hover:shadow-sm"
                >
                  <div>
                    <div className="font-medium transition-colors group-hover:text-emerald-700">
                      {student.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Position #{student.position}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600">
                      {student.average?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Students */}
        {weakStudentsData.length > 0 && (
          <div
            onClick={() => setOpenDialog("weakStudents")}
            className="group animate-in fade-in slide-in-from-left-4 cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
            style={{ animationDelay: "700ms" }}
          >
            <h3 className="mb-3 text-base font-semibold">
              Students Below 40% • Click to view all
            </h3>
            <div className="space-y-2">
              {weakStudentsData.slice(0, 5).map((student, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-lg bg-linear-to-r from-red-50 to-transparent p-3 transition-all duration-300 hover:scale-105 hover:from-red-100 hover:shadow-sm"
                >
                  <div className="font-medium transition-colors group-hover:text-red-700">
                    {student.name}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">
                      {student.average?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Attendance */}
        {lowAttendanceData.length > 0 && (
          <div
            className="animate-in fade-in slide-in-from-right-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: "800ms" }}
          >
            <h3 className="mb-3 text-base font-semibold">
              Low Attendance (&lt; 75%)
            </h3>
            <div className="space-y-2">
              {lowAttendanceData.slice(0, 5).map((student, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-lg bg-linear-to-r from-amber-50 to-transparent p-3 transition-all duration-300 hover:scale-105 hover:from-amber-100 hover:shadow-sm"
                >
                  <div className="font-medium transition-colors group-hover:text-amber-700">
                    {student.name}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-amber-700">
                      {student.percentage?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Distribution Pie Chart */}
      {classAverageData.length > 0 && (
        <div
          className="animate-in fade-in zoom-in-95 rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "900ms" }}
        >
          <h3 className="mb-3 text-base font-semibold">
            Performance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classAverageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="average"
              >
                {classAverageData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toFixed(1) + "%"} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Dialogs */}
      {/* Top Performers Dialog */}
      <Dialog
        open={openDialog === "topPerformers"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-700">
              Top Performers
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {topperData.length > 0 ? (
              topperData.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-purple-200 bg-linear-to-r from-purple-50 to-transparent p-4 transition-all hover:shadow-md"
                >
                  <div>
                    <div className="font-semibold text-purple-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Position #{student.position}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {student.average?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No data available
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Weak Students Dialog */}
      <Dialog
        open={openDialog === "weakStudents"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-700">
              Students Below 40%
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {weakStudentsData.length > 0 ? (
              weakStudentsData.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-linear-to-r from-red-50 to-transparent p-4 transition-all hover:shadow-md"
                >
                  <div className="font-semibold text-red-900">
                    {student.name}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {student.average?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No data available
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Low Attendance Dialog */}
      <Dialog
        open={openDialog === "lowAttendance"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-amber-700">
              Low Attendance Students (&lt; 75%)
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {lowAttendanceData.length > 0 ? (
              lowAttendanceData.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-transparent p-4 transition-all hover:shadow-md"
                >
                  <div className="font-semibold text-amber-900">
                    {student.name}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-700">
                      {student.percentage?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No data available
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analytics;
