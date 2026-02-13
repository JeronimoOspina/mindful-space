import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalIcon, Clock, User } from "lucide-react";

const professionals = [
  { id: "1", name: "Dra. María López", specialty: "Psicología Clínica", price: 50 },
  { id: "2", name: "Dr. Carlos Ruiz", specialty: "Psiquiatría", price: 70 },
  { id: "3", name: "Lic. Ana Torres", specialty: "Terapia Cognitivo-Conductual", price: 45 },
];

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export interface Appointment {
  id: string;
  professional: typeof professionals[0];
  date: Date;
  time: string;
  status: "pending" | "confirmed";
}

export default function Teleconsult() {
  const [profId, setProfId] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  const prof = professionals.find((p) => p.id === profId);

  const handleBook = () => {
    if (!prof || !date || !time) return;
    const appt: Appointment = {
      id: crypto.randomUUID(),
      professional: prof,
      date,
      time,
      status: "pending",
    };
    setAppointments((prev) => [...prev, appt]);
    navigate("/payment", { state: { appointment: appt } });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-2">Teleconsulta</h1>
        <p className="text-center text-muted-foreground mb-10">Agenda una cita con un profesional de salud mental</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking form */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Agendar Cita</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Profesional</Label>
                <Select value={profId} onValueChange={setProfId}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un profesional" /></SelectTrigger>
                  <SelectContent>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.specialty} (${p.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  className="rounded-lg border border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Hora</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <Button
                      key={t}
                      variant={time === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full" disabled={!prof || !date || !time} onClick={handleBook}>
                Agendar y Pagar
              </Button>
            </CardContent>
          </Card>

          {/* Appointments list */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mis Citas</h2>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tienes citas programadas aún.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <Card key={a.id} className="glass-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2"><User className="h-4 w-4" /> {a.professional.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CalIcon className="h-3 w-3" /> {a.date.toLocaleDateString()}
                          <Clock className="h-3 w-3 ml-2" /> {a.time}
                        </p>
                      </div>
                      <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>
                        {a.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
