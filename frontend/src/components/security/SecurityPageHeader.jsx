function SecurityPageHeader({ title, description, icon: Icon, tint, breadcrumbs, action }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span
    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
    style={{ backgroundColor: `${tint}1A`, color: tint }}
  >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {action}
    </div>;
}
export {
  SecurityPageHeader
};
