import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
