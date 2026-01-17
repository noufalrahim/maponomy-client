export type SalesPersonCreateDTO = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    active: boolean;
    monthlyTarget: number;
}

export type SalesPersonEditDTO = {
    id: string;
    name?: string;
    phoneNumber?: string;
    active?: boolean;
    monthlyTarget?: number;
}