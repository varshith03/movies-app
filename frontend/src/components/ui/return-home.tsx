import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ReturnHome = () => {
  return (
    <div className="mb-6">
      <Link
        to=".."
        className="text-foreground/80 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded-md -ml-2 inline-flex items-center gap-2 transition-colors"
      >
        <div className="inline-flex items-center group">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 -ml-2">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:text-primary-foreground" />
          </div>
          <span className="ml-1">Back to Movies</span>
        </div>
      </Link>
    </div>
  );
};

export default ReturnHome;
