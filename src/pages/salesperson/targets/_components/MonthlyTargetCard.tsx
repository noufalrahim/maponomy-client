/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { cn, daysLeftInCurrentMonth } from '@/lib/utils';
import { Target, TrendingUp, Calendar } from 'lucide-react';

interface IMonthlyTargetCardProps {
    monthlyTarget: number;
    achieved: number;
}

export default function MonthlyTargetCard({
    monthlyTarget,
    achieved,
}: IMonthlyTargetCardProps) {

    const percentage =
        monthlyTarget > 0 ? Math.round((achieved / monthlyTarget) * 100) : 0;
    const remaining = monthlyTarget - achieved;

    return (
        <Card className="overflow-hidden shadow-xs">
            <div className="p-6 bg-gradient-to-b 
            from-primary/20 
            via-primary/10
            to-primary/0">
                <div className="flex justify-between gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Monthly Target</p>
                        <p className="text-4xl font-bold">
                            ₹{(monthlyTarget / 1000).toFixed(1)}K
                        </p>
                        <p className="text-muted-foreground">This month</p>
                    </div>

                    <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-8 border-primary/20 relative">
                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="6"
                                className="text-primary"
                                strokeDasharray={`${percentage * 2.64} 264`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-primary">{percentage}%</p>
                            <p className="text-xs text-muted-foreground">Achieved</p>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="grid sm:grid-cols-3 gap-4 p-6">
                <Stat icon={TrendingUp} label="Achieved" value={`${(achieved / 1000).toFixed(0)}K`} className="bg-green-50 border-green-200"/>
                <Stat icon={Target} label="Remaining" value={`${(remaining / 1000).toFixed(0)}K`} className="bg-amber-50 border-amber-200"/>
                <Stat icon={Calendar} label="Days Left" value={daysLeftInCurrentMonth().toString()} className="bg-red-50 border-red-200"/>
            </CardContent>
        </Card>
    );
}

interface IStatProps {
    icon: any;
    label: string;
    value: string;
    className: string;
}

function Stat({
    icon: Icon,
    label,
    value,
    className
}: IStatProps) {
    return (
        <div className={cn("p-4 rounded-lg border bg-muted/40", className)}>
            <div className="flex gap-3 items-center">
                <Icon className="h-5 w-5 text-primary" />
                <div className='flex flex-col items-start'>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-bold text-xl">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
