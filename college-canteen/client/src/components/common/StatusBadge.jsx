import { ORDER_STATUS_STYLE } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const conf = ORDER_STATUS_STYLE[status] || {
    badge: 'badge-gray',
    label: status || 'Unknown',
  };

  return (
    <span className={`badge ${conf.badge}`}>
      {conf.label}
    </span>
  );
}
