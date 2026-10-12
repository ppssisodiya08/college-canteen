export default function EmptyState({
  icon = '🍽️',
  title = 'No items found',
  message = 'There are no records to display at this time.',
  action = null,
}) {
  return (
    <div className="card text-center py-12 px-6 max-w-md mx-auto my-8 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-4 shadow-sm">
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </div>
      <h3 className="text-xl font-display font-semibold text-charcoal-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-charcoal-500 max-w-xs mb-6 leading-relaxed">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
