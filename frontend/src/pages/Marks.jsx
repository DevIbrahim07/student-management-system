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
import { addMark, getStudentMarks, getStudentAverage } from "@/services/marks";
import { fetchStudents } from "@/services/students";
import { fetchSubjects } from "@/services/subjects";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 5;

const Marks = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student: "",
      subject: "",
      marks: "",
      examType: "Mid",
    },
  });

  const selectedStudent = watch("student");

  const loadMarks = async (page = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      if (role === "student") {
        // Students automatically see their own marks
        const data = await getStudentMarks("", page, PAGE_SIZE);
        setMarks(Array.isArray(data.marks) ? data.marks : []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        // Admin/Teacher can filter by selected student
        const data = await getStudentMarks(selectedStudent, page, PAGE_SIZE);
        setMarks(Array.isArray(data.marks) ? data.marks : []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load marks.";
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

  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects({ limit: 999 });
      setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
    } catch {
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadStudents();
    loadSubjects();
    loadMarks(1); // Load marks on mount with page 1
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    // Reload marks when student selection changes (reset to page 1)
    if (role !== "student") {
      setCurrentPage(1);
      loadMarks(1);
    }
  }, [selectedStudent]);

  const onSubmit = async (formData) => {
    if (role === "student") {
      toast.error("Students cannot add marks.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMark({
        ...formData,
        marks: Number(formData.marks),
      });
      toast.success("Mark added");
      setIsDialogOpen(false);
      reset();
      setCurrentPage(1);
      loadMarks(1);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add mark.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Marks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "student"
              ? "View your marks and performance."
              : "Manage student marks and scores."}
          </p>
        </div>
        {role !== "student" && (
          <Button onClick={() => setIsDialogOpen(true)}>Add Mark</Button>
        )}
      </div>

      {role !== "student" && (
        <div className="shrink-0 rounded-lg border border-border bg-card p-3">
          <select
            {...register("student")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a student to view marks</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.rollNumber})
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            Loading marks...
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
                  <th className="px-4 py-2 font-medium">Subject</th>
                  <th className="px-4 py-2 font-medium">Marks</th>
                  <th className="px-4 py-2 font-medium">Exam Type</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-sm text-muted-foreground"
                    >
                      No marks found.
                    </td>
                  </tr>
                )}
                {marks.map((mark) => (
                  <tr key={mark._id} className="border-b border-border/60">
                    <td className="px-4 py-2">{mark.student?.name || "N/A"}</td>
                    <td className="px-4 py-2">{mark.subject?.name || "N/A"}</td>
                    <td className="px-4 py-2 font-semibold">{mark.marks}</td>
                    <td className="px-4 py-2">{mark.examType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !error && marks.length > 0 && (
        <div className="flex shrink-0 items-center justify-between rounded-lg border border-border bg-card p-3">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadMarks(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => loadMarks(currentPage + 1)}
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
            <DialogTitle>Add Mark</DialogTitle>
            <DialogDescription>Record a student&apos;s mark.</DialogDescription>
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
              <label className="text-sm font-medium" htmlFor="subject">
                Subject
              </label>
              <select
                id="subject"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("subject", {
                  required: "Subject is required",
                })}
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-xs text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="marks">
                Marks (0-100)
              </label>
              <Input
                id="marks"
                type="number"
                min="0"
                max="100"
                placeholder="Enter marks"
                {...register("marks", {
                  required: "Marks is required",
                  min: { value: 0, message: "Minimum is 0" },
                  max: { value: 100, message: "Maximum is 100" },
                })}
              />
              {errors.marks && (
                <p className="text-xs text-destructive">
                  {errors.marks.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="examType">
                Exam Type
              </label>
              <select
                id="examType"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("examType")}
              >
                <option value="Mid">Mid</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
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
                {isSubmitting ? "Adding..." : "Add Mark"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marks;
