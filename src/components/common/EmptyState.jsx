export const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="text-text-grey mb-4">{icon}</div>}
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-grey text-sm text-center max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};
