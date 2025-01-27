import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="absolute bottom-full mb-2 w-56 bg-red-600 text-white text-xs p-2">
        <span className="block">😞 Error: {error.message}</span>
        <svg
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 6 6"
        >
          <path d="M0 0 L3 3 L6 0 Z" />
        </svg>
      </div>
    </div>
  );
}

const Boundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export { useErrorBoundary, Boundary };
