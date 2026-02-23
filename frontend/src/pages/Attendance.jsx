import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  markAttendance,
  getAttendanceByDate,
  getStudentAttendance,
  getAttendanceSummary,
} from "@/services/attendance";
import { fetchStudents } from "@/services/students";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 5;

const Attendance = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student: "",
      date: selectedDate,
      status: "Present",
    },
  });

  const loadAttendance = async (page = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      if (role === "student") {
        const data = await getStudentAttendance("me", page, PAGE_SIZE);
        setAttendance(Array.isArray(data.records) ? data.records : []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        const summaryData = await getAttendanceSummary("me");
        setSummary(summaryData);
      } else {
        const data = await getAttendanceByDate(selectedDate);
        setAttendance(Array.isArray(data) ? data : []);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to load attendance.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await fetchStudents({ limit: 999 });
      setStudents(data.students || []);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    loadAttendance(1);
  }, [selectedDate, role]);

  const onSubmit = async (formData) => {
    if (role === "student") {
      toast.error("Students cannot mark attendance.");
      return;
    }

    setIsSubmitting(true);
    try {
      await markAttendance(formData);
      toast.success("Attendance marked");
      setIsDialogOpen(false);
      reset();
      setCurrentPage(1);
      loadAttendance(1);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to mark attendance.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "student"
              ? "View your attendance record."
              : "Manage student attendance."}
          </p>
        </div>
        {role !== "student" && (
          <Button onClick={() => setIsDialogOpen(true)}>Mark Attendance</Button>
        )}
      </div>

      {role === "student" && summary && (
        <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-sm text-muted-foreground">Total Days</div>
            <div className="mt-1 text-xl font-semibold">
              {summary.totalDays || 0}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-sm text-muted-foreground">Present</div>
            <div className="mt-1 text-xl font-semibold text-green-600">
              {summary.presentDays || 0}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-sm text-muted-foreground">Percentage</div>
            <div className="mt-1 text-xl font-semibold">
              {summary.percentage?.toFixed(1) || 0}%
            </div>
          </div>
        </div>
      )}

      {role !== "student" && (
        <div className="shrink-0 rounded-lg border border-border bg-card p-3">
          <label className="text-sm font-medium">Filter by Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2"
          />
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
            Loading attendance...
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
          <div className="h-full overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-2 font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-sm text-muted-foreground"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
                {attendance.map((record) => (
                  <tr key={record._id} className="border-b border-border/60">
                    <td className="px-4 py-2">
                      {record.student?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : record.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !error && role === "student" && attendance.length > 0 && (
        <div className="flex shrink-0 items-center justify-between rounded-lg border border-border bg-card p-3">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadAttendance(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => loadAttendance(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for a student.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="student">
                Student
              </label>
              <select
                id="student"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("student", {
                  required: "Student is required",
                })}
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
              {errors.student && (
                <p className="text-xs text-destructive">
                  {errors.student.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="date">
                Date
              </label>
              <Input
                id="date"
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
              />
              {errors.date && (
                <p className="text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("status")}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Marking..." : "Mark Attendance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
