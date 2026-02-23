import { useEffect, useMemo, useState } from "react";
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
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/services/students";
import { fetchSubjects } from "@/services/subjects";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 5;

const Students = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [classNameFilter, setClassNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
      className: "",
      age: "",
      address: "",
      subjects: [],
    },
  });

  const selectedSubjects = watch("subjects") || [];

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => ({
        id: subject._id,
        label: `${subject.name} (${subject.code})`,
      })),
    [subjects],
  );

  const loadStudents = async (page = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchStudents({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        className: classNameFilter || undefined,
      });
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to load students.";
      setError(message);
    } finally {
      setIsLoading(false);
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
    loadStudents(1);
    loadSubjects();
  }, []);

  useEffect(() => {
    loadStudents(1);
  }, [search, classNameFilter]);

  const openCreate = () => {
    setEditingStudent(null);
    reset({
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
      className: "",
      age: "",
      address: "",
      subjects: [],
    });
    setIsDialogOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    reset({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      rollNumber: student.rollNumber || "",
      className: student.className || "",
      age: student.age || "",
      address: student.address || "",
      subjects: (student.subjects || []).map(
        (subject) => subject._id || subject,
      ),
    });
    setIsDialogOpen(true);
  };

  const toggleSubject = (subjectId) => {
    const current = selectedSubjects || [];
    const exists = current.includes(subjectId);
    const next = exists
      ? current.filter((id) => id !== subjectId)
      : [...current, subjectId];
    setValue("subjects", next, { shouldDirty: true });
  };

  const onSubmit = async (formData) => {
    if (editingStudent && role !== "admin") {
      toast.error("Only admin can update students.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
      };

      if (editingStudent) {
        await updateStudent(editingStudent._id, payload);
        toast.success("Student updated");
      } else {
        await createStudent(payload);
        toast.success("Student created");
      }

      setIsDialogOpen(false);
      loadStudents(1);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save student.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (student) => {
    if (role !== "admin") {
      toast.error("Only admin can delete students.");
      return;
    }
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudent(studentToDelete._id);
      toast.success("Student deleted successfully");
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadStudents(1);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete student.";
      toast.error(message);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage student profiles and assignments.
          </p>
        </div>
        <Button onClick={openCreate}>Add Student</Button>
      </div>

      <div className="flex shrink-0 flex-wrap gap-3 rounded-lg border border-border bg-card p-3">
        <div className="min-w-55 flex-1">
          <Input
            placeholder="Search by name or roll number"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="min-w-40">
          <Input
            placeholder="Filter by class"
            value={classNameFilter}
            onChange={(event) => setClassNameFilter(event.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setClassNameFilter("");
          }}
        >
          Reset
        </Button>
      </div>

      {isLoading && (
        <div className="animate-pulse rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
            Loading students...
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
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Roll Number</th>
                  <th className="px-4 py-2 font-medium">Class</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-sm text-muted-foreground"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-border/60">
                    <td className="px-4 py-2 font-medium">{student.name}</td>
                    <td className="px-4 py-2">{student.rollNumber}</td>
                    <td className="px-4 py-2">{student.className}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(student)}
                          disabled={role !== "admin"}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student._id)}
                          disabled={role !== "admin"}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex shrink-0 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadStudents(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadStudents(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Edit Student" : "Add Student"}
            </DialogTitle>
            <DialogDescription>
              Fill out the student details below.
            </DialogDescription>
          </DialogHeader>

          <form
            className="max-h-[calc(90vh-120px)] space-y-4 overflow-y-auto pr-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Student name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@email.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  Phone
                </label>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="rollNumber">
                  Roll Number
                </label>
                <Input
                  id="rollNumber"
                  placeholder="Roll number"
                  {...register("rollNumber", {
                    required: "Roll number is required",
                  })}
                />
                {errors.rollNumber && (
                  <p className="text-xs text-destructive">
                    {errors.rollNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="className">
                  Class
                </label>
                <Input
                  id="className"
                  placeholder="Class"
                  {...register("className", {
                    required: "Class is required",
                  })}
                />
                {errors.className && (
                  <p className="text-xs text-destructive">
                    {errors.className.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="age">
                  Age
                </label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  placeholder="Age"
                  {...register("age")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="address">
                  Address
                </label>
                <Input
                  id="address"
                  placeholder="Address"
                  {...register("address")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subjects</label>
              {subjectOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subjects found. Add subjects first.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {subjectOptions.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => toggleSubject(subject.id)}
                      />
                      {subject.label}
                    </label>
                  ))}
                </div>
              )}
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
                {isSubmitting
                  ? "Saving..."
                  : editingStudent
                    ? "Update Student"
                    : "Create Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Student
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {studentToDelete && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium">{studentToDelete.name}</p>
              <p className="text-sm text-muted-foreground">
                Roll Number: {studentToDelete.rollNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Class: {studentToDelete.className}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
