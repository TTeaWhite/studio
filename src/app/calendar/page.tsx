'use client';

import { useState, ChangeEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { parseIcs } from '@/lib/ics-parser';
import type { CalendarEvent } from '@/types/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale'; // Import Chinese locale
import { Separator } from '@/components/ui/separator';
import { Upload, CalendarClock, MapPin, FileText } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ics')) {
       setError('请选择一个 .ics 文件。');
       setEvents([]);
       setFileName(null);
       return;
    }

    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedEvents = parseIcs(content);
        setEvents(parsedEvents);
         if (parsedEvents.length > 0) {
           // Set selected date to the first event's date
           setSelectedDate(parsedEvents[0].start);
         } else {
             setSelectedDate(new Date()); // Reset to today if no events
         }
      } catch (err) {
        console.error("解析 ICS 文件失败:", err);
        setError('解析 ICS 文件失败。请确保文件格式正确。');
        setEvents([]);
        setSelectedDate(new Date());
      }
    };
    reader.onerror = () => {
        console.error("读取文件失败");
        setError("读取文件失败。");
        setEvents([]);
        setFileName(null);
        setSelectedDate(new Date());
    };
    reader.readAsText(file);
  };

  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(event => {
        // Handle all-day events and multi-day events correctly
        const eventStartDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
        let eventEndDay = event.end ? new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate()) : eventStartDay;

        // Ensure end date is inclusive for comparison
        if (event.end && !event.isAllDay && event.end.getHours() === 0 && event.end.getMinutes() === 0 && event.end.getSeconds() === 0) {
           // If end time is midnight, it might effectively end the previous day
           const tempEnd = new Date(event.end);
           tempEnd.setDate(tempEnd.getDate() - 1);
           if(tempEnd >= eventStartDay) {
               eventEndDay = tempEnd;
           }
        } else if (event.isAllDay && event.end && event.end > event.start) {
           // For all-day events where DTEND is the day *after*, the UI already handled the display shift in parser, so compare normally.
           // No adjustment needed here if parser adjusted. If not, adjust here. Assume parser handled it.
           eventEndDay = event.end;
        }


        const selectedDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        return selectedDayStart >= eventStartDay && selectedDayStart <= eventEndDay;

    });
  }, [events, selectedDate]);


  const eventDays = useMemo(() => {
    const days = new Set<string>();
    events.forEach(event => {
        const start = event.start;
        const end = event.end || start;
        let current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const lastDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        while (current <= lastDay) {
            days.add(format(current, 'yyyy-MM-dd'));
            current.setDate(current.getDate() + 1);
        }
    });
    return days;
  }, [events]);

  const dayHasEvent = (day: Date): boolean => {
      return eventDays.has(format(day, 'yyyy-MM-dd'));
  }

  const formatEventTime = (event: CalendarEvent): string => {
      if (event.isAllDay) {
          if (event.end && !isSameDay(event.start, event.end)) {
              // Multi-day all-day event
              return `${format(event.start, 'M月d日', { locale: zhCN })} - ${format(event.end, 'M月d日', { locale: zhCN })}`;
          }
          return "全天"; // Single all-day event
      }

      const startTime = format(event.start, 'HH:mm');
      if (event.end) {
          if (isSameDay(event.start, event.end)) {
              const endTime = format(event.end, 'HH:mm');
              return `${startTime} - ${endTime}`;
          } else {
              // Multi-day timed event
               return `${format(event.start, 'M月d日 HH:mm', { locale: zhCN })} - ${format(event.end, 'M月d日 HH:mm', { locale: zhCN })}`;
          }
      }
      return startTime; // Event with start time but no end time
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
         <CardHeader>
           <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
             <Upload className="h-5 w-5" /> 上传 ICS 日历文件
           </CardTitle>
           <CardDescription className="text-muted-foreground">
             选择您的 .ics 文件以在下方查看日历事件。
           </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="ics-upload" className="text-sm font-medium text-foreground/80">选择文件</Label>
                <Input
                    id="ics-upload"
                    type="file"
                    accept=".ics"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer focus:ring-accent"
                />
            </div>
            {fileName && <p className="mt-2 text-sm text-muted-foreground">已选择: {fileName}</p>}
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
         </CardContent>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg flex justify-center items-start p-0">
            {/* Wrap Calendar in a div to allow centering */}
            <div className="p-2">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    locale={zhCN} // Use Chinese locale
                    modifiers={{ hasEvent: dayHasEvent }}
                    modifiersClassNames={{ hasEvent: 'bg-accent/30 rounded-full' }} // Style days with events
                 />
            </div>

        </Card>

        <Card className="md:col-span-2 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              {selectedDate ? format(selectedDate, 'yyyy年 M月 d日', { locale: zhCN }) : '选择日期'}
            </CardTitle>
             <CardDescription className="text-muted-foreground">
               {selectedDate ? `当天共有 ${eventsOnSelectedDate.length} 个事件。` : '请在左侧日历选择一个日期以查看事件。'}
             </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4"> {/* Adjust height as needed */}
              {eventsOnSelectedDate.length > 0 ? (
                <ul className="space-y-4">
                  {eventsOnSelectedDate.map((event) => (
                    <li key={event.uid} className="p-4 rounded-lg border border-border/70 bg-background/50 hover:bg-secondary/50 transition-colors duration-150 ease-in-out">
                      <h3 className="font-semibold text-foreground">{event.summary}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                         <CalendarClock className="h-4 w-4 shrink-0" />
                        <span>{formatEventTime(event)}</span>
                      </div>
                       {event.location && (
                         <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                           <MapPin className="h-4 w-4 shrink-0" />
                           <span>{event.location}</span>
                         </div>
                       )}
                       {event.description && (
                         <>
                           <Separator className="my-2 bg-border/50"/>
                           <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                             <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                             <p className="whitespace-pre-wrap break-words">{event.description}</p>
                           </div>
                         </>
                       )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">
                  {selectedDate ? '此日期没有事件。' : '请选择一个日期。'}
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
