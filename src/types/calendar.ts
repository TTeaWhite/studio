export interface CalendarEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date | null; // End date might be optional or same as start for single-day events
  location?: string;
  description?: string;
  isAllDay: boolean;
}
