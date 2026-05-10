const colors = {
  Pending: 'bg-amber-100 text-amber-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-rose-100 text-rose-700'
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
