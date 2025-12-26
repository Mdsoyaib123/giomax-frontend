/* eslint-disable @typescript-eslint/no-explicit-any */

import { format, parseISO } from "date-fns";


export function formatLocalDate(isoTimestamp: string): string {
    try {
        const date = parseISO(isoTimestamp);
        return format(date, "dd/MM/yyyy - hh:mm a");
    } catch (error: any) {
        console.error("Invalid ISO timestamp:", isoTimestamp, error);
        return "Invalid date";
    }
}
