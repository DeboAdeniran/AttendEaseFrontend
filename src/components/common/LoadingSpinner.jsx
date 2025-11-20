import React from "react";

export const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-4 border-blue border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-text-grey text-sm">{text}</p>}
    </div>
  );
};

export const FullPageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export const InlineLoader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" />
    </div>
  );
};
