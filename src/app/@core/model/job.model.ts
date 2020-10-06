export interface Job {
    name: string;
    readonly: boolean;
    // for temp data
    content: string;
    promoted?: boolean;
    // for saved data
    saved: string;
    updatedAt: Date;
    updatedBy: string;
    approved: boolean;
    approvedBy?: string;
}
