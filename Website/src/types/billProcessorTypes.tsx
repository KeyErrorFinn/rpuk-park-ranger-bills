type BillItem = {
    Taken: [number, number];
    Given: [number, number];
};

type PersonBill = {
    Bill: number;
    Items: Record<string, BillItem>;
    IsRanger: boolean;
};

export type SeparateBills = Record<string, PersonBill>;

export type ProcessBill = {
    Name: string;
    Bill: number;
    Items: Record<string, BillItem>;
    IsRanger: boolean;
}

export type ProcessedBills = {
    success: boolean;
    message?: string;
    bills?: ProcessBill[];
    billsOutputText?: string;
};