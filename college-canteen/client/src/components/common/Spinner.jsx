export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${
          sizeClasses[size] || sizeClasses.md
        } border-primary-200 border-t-primary-500 rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
