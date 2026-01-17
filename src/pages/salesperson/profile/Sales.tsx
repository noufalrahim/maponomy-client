import { useSelector } from 'react-redux';
import { ProfileHeader, RecentOrders, StatsGrid } from './_components';
import { RootState } from '@/redux/store';
import { useReadData } from '@/hooks/useReadData';
import { TProfileStats, TServiceResponse } from '@/types';
import { Loader } from '@/components/Loader';

const END_POINT = '/statistics';

export default function SalesProfile() {

    const user = useSelector((state: RootState) => state.user.entity);

    const { data, isFetching } = useReadData<TServiceResponse<TProfileStats>>('profile_stats_fetch', `${END_POINT}/salesperson/${user?.salesperson?.id}`);

    if(isFetching){
        return <Loader />
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <ProfileHeader profile={user?.salesperson} email={user?.email} />
            <StatsGrid
                assignedVendors={parseInt(data?.data?.totalVendors || "0")}
                orders={parseInt(data?.data?.totalOrders || "0")}
                targets={{
                    monthlyTarget: data?.data?.monthlyTarget || 0,
                    achieved: parseFloat(data?.data?.totalAchievedThisMonth || "0"),
                }}
            />
            <RecentOrders id={user?.salesperson?.id} />
        </div>
    );
}
