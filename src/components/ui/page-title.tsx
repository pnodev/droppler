export function PageTitle({
  children,
  actions,
  loading,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <h1 className="text-3xl font-bold text-black border-b pb-5 -mx-6 px-6 relative">
      {loading ? (
        <div className="absolute left-0 right-0 bottom-0 overflow-hidden h-px">
          <div className="absolute left-0 right-0 h-px bg-primary bottom-0 animate-progress origin-left-right"></div>
        </div>
      ) : null}
      <div className="flex justify-between items-center">
        {children}
        {actions ? actions : null}
      </div>
    </h1>
  );
}
