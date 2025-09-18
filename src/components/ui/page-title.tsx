export function PageTitle({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <h1 className="text-3xl font-bold text-black border-b pb-5 -mx-6 px-6 ">
      <div className="flex justify-between items-center">
        {children}
        {actions ? actions : null}
      </div>
    </h1>
  );
}
