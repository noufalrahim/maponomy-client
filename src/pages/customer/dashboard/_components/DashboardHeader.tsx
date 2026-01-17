export default function DashboardHeader() {
  return (
    <div className="flex items-start flex-col">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">
        Your order overview for this month
      </p>
    </div>
  )
}
