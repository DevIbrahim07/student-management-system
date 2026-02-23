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
import { fetchSubjects } from "@/services/subjects";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 10;

const Subjects = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const token = useAuthStore((state) => state.token);

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const loadSubjects = async (page = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchSubjects({ page, limit: PAGE_SIZE });
      setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to load subjects.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects(1);
    setCurrentPage(1);
  }, []);

  const onSubmit = async (formData) => {
    if (role !== "admin") {
      toast.error("Only admin can add subjects.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create subject");
      }
      toast.success("Subject created");
      setIsDialogOpen(false);
      reset();
      setCurrentPage(1);
      loadSubjects(1);
    } catch (err) {
      const message = err?.message || "Failed to create subject.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Subjects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All available subjects in the system.
          </p>
        </div>
        {role === "admin" && (
          <Button onClick={() => setIsDialogOpen(true)}>Add Subject</Button>
        )}
      </div>

      {isLoading && (
        <div className="animate-pulse rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent"></div>
            Loading subjects...
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {subjects.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground md:col-span-2 lg:col-span-3">
                No subjects found.
              </div>
            ) : (
              subjects.map((subject, index) => (
                <div
                  key={subject._id}
                  className="group animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border bg-linear-to-br from-card to-card/80 p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {subject.code}
                    </p>
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 p-1.5 opacity-20 transition-opacity group-hover:opacity-100">
                      <div className="h-full w-full rounded-full bg-white"></div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-foreground transition-colors group-hover:text-emerald-600">
                    {subject.name}
                  </h3>
                  {subject.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {subject.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {!isLoading && !error && subjects.length > 0 && (
        <div className="flex shrink-0 items-center justify-between rounded-lg border border-border bg-card p-3">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadSubjects(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => loadSubjects(currentPage + 1)}
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
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>Create a new subject.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                placeholder="Subject name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="code">
                Code
              </label>
              <Input
                id="code"
                placeholder="Subject code"
                {...register("code", { required: "Code is required" })}
              />
              {errors.code && (
                <p className="text-xs text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <Input
                id="description"
                placeholder="Description"
                {...register("description")}
              />
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
                {isSubmitting ? "Creating..." : "Create Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
