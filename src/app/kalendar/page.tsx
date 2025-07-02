'use client';

import { useEffect, useState } from 'react';

export default function KalendarPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-12">Kalendár</h1>
      <ul>
        {events.map((event, idx) => (
          <li key={idx} className="mb-4">
            <div className="font-semibold">{event.title}</div>
            <div className="text-muted-foreground">{event.date}</div>
            <div>{event.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}