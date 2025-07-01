'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from 'next/link';

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Názov je povinný." }),
  date: z.string().min(1, { message: "Dátum je povinný." }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Event {
    id: string;
    title: string;
    date: string;
}

const initialEvents: Event[] = [
    {
      id: '1',
      title: 'Mission Camp 2025',
      date: '15. - 25. Júl 2025',
    },
    {
      id: '2',
      title: 'Veľkonočné dni zdravia',
      date: '18. - 21. Apríl 2025',
    },
];

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: '',
    },
  });

  const handleAddNew = () => {
    setEditingEvent(null);
    form.reset({ title: '', date: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset(event);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const onSubmit = (data: EventFormValues) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...data } : e));
    } else {
      const newEvent: Event = { id: Date.now().toString(), ...data };
      setEvents([...events, newEvent]);
    }
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold font-headline">Správa udalostí</h1>
            <p className="text-muted-foreground">Pridávajte, upravujte a mažte udalosti.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Pridať novú udalosť
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Názov</TableHead>
                <TableHead>Dátum</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Naozaj chcete odstrániť túto udalosť?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Táto akcia je nezvratná. Udalosť "{event.title}" bude natrvalo odstránená.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(event.id)}>Odstrániť</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Upraviť udalosť' : 'Pridať novú udalosť'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                      <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Názov</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Názov udalosti" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Dátum</FormLabel>
                                  <FormControl>
                                      <Input placeholder="napr. 1. Január 2025" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Zrušiť</Button>
                          </DialogClose>
                          <Button type="submit">{editingEvent ? 'Uložiť zmeny' : 'Vytvoriť udalosť'}</Button>
                      </DialogFooter>
                  </form>
              </Form>
          </DialogContent>
      </Dialog>
      
       <Button variant="outline" asChild className="mt-8">
         <Link href="/admin">Späť na administráciu</Link>
      </Button>
    </div>
  );
}
