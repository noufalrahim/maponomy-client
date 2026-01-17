import { useReadData } from "@/hooks/useReadData";
import { EUrl, TServiceResponse } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";
import { CreateOrder } from "./_components";

const ORDER_END_POINT = '/orders'

export default function ManageCreateOrder() {
    const user = useSelector((state: RootState) => state.user.entity);
    const navigate = useNavigate();
    const { data: limit, isLoading: dailyLimitLoading } = useReadData<TServiceResponse<{
        totalTodaysOrder: number,
        limitExceeded: boolean,
    }>>('daily_limit_fetch', `${ORDER_END_POINT}/customer/${user?.customer?.id}/daily-limit`);

    if(dailyLimitLoading){
        return <Loader />
    }

    return (
        <div>
            {
                !limit?.data?.limitExceeded ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex text-start flex-col">
                            <h1 className="text-2xl font-bold text-foreground">Place Order</h1>
                            <p className="text-muted-foreground">Select products and submit for approval</p>
                        </div>

                        <Card>
                            <CardContent className="py-12 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                                        <ShoppingCart className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Order Already Placed Today</h2>
                                    <p className="text-muted-foreground">
                                        You already have an order placed for today. You can only place one order per day to avoid duplicates.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Please wait for your sales representative to approve or reject your current order before placing a new one.
                                    </p>
                                    <Button onClick={() => navigate(EUrl.CUSTOMER_ORDERS)} className="mt-4">
                                        View My Orders
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <CreateOrder />
                )
            }
        </div>
    )
}
