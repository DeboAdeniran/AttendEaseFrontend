export const ErrorMessage = ({ message, onRetry, className = "" }) => {
  return (
    <div
      className={`bg-red-500/20 border border-red-500 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-red-500 text-sm font-medium">Error</p>
          <p className="text-red-400 text-sm mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-sm text-red-500 hover:text-red-400 font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const FullPageError = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorMessage message={message} onRetry={onRetry} />
      </div>
    </div>
  );
};
