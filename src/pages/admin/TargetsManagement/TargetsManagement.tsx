import { TProgress, TServiceResponse } from "@/types";
import { TargetsList, TargetsSummary } from "./_components";
import { useReadData } from "@/hooks/useReadData";
import { Loader } from "@/components/Loader";

const END_POINT = '/statistics/progress/salesperson-progress';

export default function TargetsManagement() {


  const { data: salespersonProgress, isFetching: salespersonLoading } = useReadData<TServiceResponse<TProgress>>('progress_list_fetch', END_POINT);

  if (salespersonLoading) {
    return <Loader />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-start flex flex-col">
        <h2 className="text-xl font-semibold">Targets & Performance</h2>
        <p className="text-muted-foreground">
          Monitor team performance against monthly targets
        </p>
      </div>

      <TargetsSummary
        totalTarget={salespersonProgress?.data?.totalMonthlyTarget || 0}
        totalAchieved={salespersonProgress?.data?.totalAchieved || 0}
        overallPercentage={
          salespersonProgress?.data?.totalMonthlyTarget
            ? (salespersonProgress.data.totalAchieved / salespersonProgress.data.totalMonthlyTarget) * 100
            : 0
        }
        topPerformer={salespersonProgress?.data?.topPerformer}
      />

      <TargetsList data={salespersonProgress?.data} />
    </div>
  );
}
