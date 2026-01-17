/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import TargetsHeader from './_components/TargetsHeader';
import MonthlyTargetCard from './_components/MonthlyTargetCard';
import WeeklyBreakdown from './_components/WeeklyBreakdown';
import StatsGrid from './_components/StatsGrid';
import { useReadData } from '@/hooks/useReadData';
import { TProfileStats, TServiceResponse } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader } from '@/components/Loader';

const END_POINT = '/statistics';

export default function SalesTargets() {

    const user = useSelector((state: RootState) => state.user.entity);

    const { data, isFetching } = useReadData<TServiceResponse<TProfileStats>>('profile_stats_fetch', `${END_POINT}/salesperson/${user?.salesperson?.id}`);

    if(isFetching){
        return <Loader />
    }

    const targetData = {
        monthlyTarget: data?.data?.monthlyTarget!,
        achieved: data?.data?.totalAchievedThisMonth,
        orderCount: data?.data?.totalOrders,
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <TargetsHeader />
            <MonthlyTargetCard 
                monthlyTarget={targetData.monthlyTarget}
                achieved={parseFloat(targetData.achieved || '0')}
            />
            <WeeklyBreakdown
                weeklyBreakdown={data?.data?.weeklyBreakdown!}
            />
            <StatsGrid
                orderCount={parseInt(targetData.orderCount || '0')}
                totalRevenue={parseFloat(targetData.achieved || '0')}
            />
        </div>
    );
}
