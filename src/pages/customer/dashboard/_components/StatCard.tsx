import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueClass = ''
}: {
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  valueClass?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className='flex flex-col items-start'>
        <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
