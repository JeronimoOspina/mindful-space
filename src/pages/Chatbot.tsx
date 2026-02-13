import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const suggestions = [
  "Me siento ansioso",
  "Necesito relajarme",
  "No puedo dormir",
  "Me siento triste",
];

const responses: Record<string, string> = {
  ansioso: "Es normal sentir ansiedad a veces. Te sugiero intentar un ejercicio de respiración 4-7-8: inhala 4 segundos, sostén 7 y exhala 8. ¿Te gustaría probarlo en nuestra sección de ejercicios?",
  relajarme: "¡Claro! Una buena técnica es la relajación muscular progresiva. Tensa y relaja cada grupo muscular por 5 segundos. También puedes explorar nuestros ejercicios guiados.",
  dormir: "Para mejorar tu sueño, intenta mantener un horario regular, evita pantallas antes de acostarte y prueba la respiración relajante. Estoy aquí si necesitas más sugerencias.",
  triste: "Lamento que te sientas así. Recuerda que está bien no estar bien. Si estos sentimientos persisten, considera hablar con un profesional. Puedes agendar una teleconsulta desde nuestra plataforma.",
  default: "Gracias por compartir. Recuerda que cuidar de tu salud mental es un acto de valentía. ¿Hay algo específico en lo que pueda ayudarte? Puedo sugerirte ejercicios de relajación o información sobre teleconsultas.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("ansios") || lower.includes("ansiedad")) return responses.ansioso;
  if (lower.includes("relaj") || lower.includes("calm")) return responses.relajarme;
  if (lower.includes("dorm") || lower.includes("sueño") || lower.includes("insomn")) return responses.dormir;
  if (lower.includes("trist") || lower.includes("deprimi") || lower.includes("mal")) return responses.triste;
  return responses.default;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: "¡Hola! Soy tu asistente de bienestar. ¿Cómo te sientes hoy? Puedes escribirme o usar las sugerencias rápidas." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: "bot", text: getResponse(text) };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Chatbot de Apoyo</h1>
        <p className="text-center text-muted-foreground mb-6">Un espacio seguro para expresarte</p>

        <Card className="glass-card flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === "bot" ? "bg-primary/10" : "bg-secondary"}`}>
                  {m.role === "bot" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-secondary-foreground" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "bot" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm text-muted-foreground">
                  Escribiendo<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {messages.length <= 2 && suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Escribe cómo te sientes..."
              className="flex-1"
            />
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
