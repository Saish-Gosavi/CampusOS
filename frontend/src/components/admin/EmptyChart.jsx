export function EmptyChart({ message = "No data available yet." }) {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
