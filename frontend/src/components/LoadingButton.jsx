const LoadingButton = ({ loading, children, className = '', ...props }) => {
  return (
    <button
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
};

export default LoadingButton;
