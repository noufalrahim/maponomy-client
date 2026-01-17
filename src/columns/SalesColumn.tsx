import { TColumn, TSalesPerson } from "@/types";
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge";
import { badgeFields, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

export const generateSalesColumns = (setActionItem: (item: TSalesPerson | string | null | undefined) => void, setOpenResetPasswordWindow: (open: boolean) => void): TColumn<TSalesPerson>[] => {
  return (
    [
      {
        key: "userId",
        header: "Sales Rep",
        render: (row: TSalesPerson) => (
          <div className="flex flex-row gap-2 items-center justify-start">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
              <p>{row.name?.charAt(0)}</p>
            </span>
            <p className="font-semibold">{row.name}</p>
          </div>
        )
      },
      {
        key: "name",
        header: "Contact",
        render: (row: TSalesPerson) => {
          return (
            <div className="flex flex-col gap-1 items-start text-gray-500">
              <p>{row.user?.email}</p>
              <p>{row.phoneNumber}</p>
            </div>
          )
        }
      },
      {
        key: "monthlyTarget",
        header: "Monthly Target",
        render: (row: TSalesPerson) => (
          <p className="flex items-start font-semibold">₹{row.monthlyTarget}</p>
        )
      },
      {
        key: "progress",
        header: "Progress",
        render: (row: TSalesPerson) => {
          const totalAmount = parseFloat(row.monthlyTarget?.toFixed(2) || '0');
          const totalAmountAchieved = parseFloat(row.monthlyProgress?.totalAmountAchievedThisMonth || '0');
          const progress = (totalAmountAchieved / totalAmount) * 100;
          return (
            <div className="flex flex-row items-center justify-start gap-3">
              <Progress value={progress} className="w-[60%] h-2" />
              <span>{progress.toFixed(2)}%</span>
            </div>
          )
        }
      },
      {
        key: "active",
        header: "Status",
        render: (row: TSalesPerson) => (
          <div className="items-start flex">
            <Badge className={cn('cursor-pointer', badgeFields(row?.active ? 'active' : 'inactive').textColor, badgeFields(row?.active ? 'active' : 'inactive').bgColor)}>
              {badgeFields(row?.active ? 'active' : 'inactive').text}
            </Badge>
          </div>
        ),
      },
      {
        key: "Reset Password",
        header: "Reset Password",
        render: (row: TSalesPerson) => (
          <Button
            onClick={() => {
              setActionItem(row.id  )
              setOpenResetPasswordWindow(true)
            }}
            variant="ghost"
            className="flex justify-center items-center"
          >
            <Key />
            <span>Reset Password</span>
          </Button>
        ),
      }
    ]
  )
}