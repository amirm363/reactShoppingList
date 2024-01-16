export type Product = {
    id: number;
    name: string;
    category_id: number;
}

export interface ChosenProducts {
    [key: string]: {
        [key: string]: number;
    };
}

export type UserDetails = {
    fullName: string;
    address: string;
    email: string;
}

export type SummaryPayload = UserDetails & {
    orderDetails: string;
}