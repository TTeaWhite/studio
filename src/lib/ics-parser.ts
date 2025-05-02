import type { CalendarEvent } from '@/types/calendar';

// Basic function to parse DTSTART/DTEND which might include TZID or be DATE values
function parseIcsDateTime(dateTimeString: string): { date: Date, isAllDay: boolean } {
  const hasTime = dateTimeString.includes('T');
  const isUtc = dateTimeString.endsWith('Z');
  let dateStr = dateTimeString;

  // Remove TZID parameter if present (simplistic approach)
  if (dateStr.includes('TZID=')) {
    dateStr = dateStr.split(':')[1];
  }

  if (isUtc) {
    // Format: YYYYMMDDTHHMMSSZ
     dateStr = dateStr.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
        '$1-$2-$3T$4:$5:$6Z'
     );
     return { date: new Date(dateStr), isAllDay: false };
  } else if (hasTime) {
    // Format: YYYYMMDDTHHMMSS (assume local time if no Z and no TZID handling)
    // This is a simplification; proper TZ handling is complex.
     dateStr = dateStr.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
        '$1-$2-$3T$4:$5:$6'
     );
     return { date: new Date(dateStr), isAllDay: false };
  } else {
    // Format: YYYYMMDD (Date value)
     dateStr = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
     // Treat as start of the day in UTC to avoid timezone shifts for all-day events
     return { date: new Date(dateStr + 'T00:00:00Z'), isAllDay: true };
  }
}

// Very basic ICS parser focusing on VEVENT
export function parseIcs(icsContent: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icsContent.replace(/\r\n?/g, '\n').split('\n');

  let currentEvent: Partial<CalendarEvent> & { rawStart?: string, rawEnd?: string } = {};
  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle line unfolding
    while (lines[i + 1]?.match(/^\s+/)) {
      i++;
      line += lines[i].trim();
    }


    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = {};
      continue;
    }

    if (!inEvent) continue;

    if (line.startsWith('END:VEVENT')) {
      if (currentEvent.uid && currentEvent.summary && currentEvent.rawStart) {
         const { date: startDate, isAllDay } = parseIcsDateTime(currentEvent.rawStart);
         let endDate: Date | null = null;
         if (currentEvent.rawEnd) {
            const { date: parsedEnd } = parseIcsDateTime(currentEvent.rawEnd);
             // For all-day events, RFC5545 specifies the end is non-inclusive.
             // If the time part is midnight, we might need to adjust, but for simplicity:
             endDate = parsedEnd;
             // A common case for all-day events is DTEND being the day *after* the last day.
             // If DTSTART is all-day and DTEND is all-day and time is 00:00:00, subtract one day for inclusive display.
             if(isAllDay && endDate.getUTCHours() === 0 && endDate.getUTCMinutes() === 0 && endDate.getUTCSeconds() === 0) {
                 const potentialEndDate = new Date(endDate);
                 potentialEndDate.setUTCDate(potentialEndDate.getUTCDate() - 1);
                 // Only adjust if the adjusted end date is not before the start date
                 if (potentialEndDate >= startDate) {
                     endDate = potentialEndDate;
                 }
             }
         }

        events.push({
          uid: currentEvent.uid,
          summary: currentEvent.summary,
          start: startDate,
          end: endDate,
          location: currentEvent.location,
          description: currentEvent.description,
          isAllDay: isAllDay,
        });
      }
      inEvent = false;
      currentEvent = {};
      continue;
    }

    if (line.startsWith('UID:')) {
      currentEvent.uid = line.substring(4).trim();
    } else if (line.startsWith('SUMMARY:')) {
      currentEvent.summary = line.substring(8).trim();
    } else if (line.startsWith('DTSTART')) { // Handles DTSTART;VALUE=DATE:YYYYMMDD or DTSTART:YYYYMMDDTHHMMSSZ etc.
       currentEvent.rawStart = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('DTEND')) { // Handles DTEND similarly
       currentEvent.rawEnd = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('LOCATION:')) {
      currentEvent.location = line.substring(9).trim();
    } else if (line.startsWith('DESCRIPTION:')) {
      // Handle potential multi-line descriptions (simple approach)
      currentEvent.description = line.substring(12).trim().replace(/\\n/g, '\n');
    }
  }

  // Sort events by start date
  events.sort((a, b) => a.start.getTime() - b.start.getTime());

  return events;
}
