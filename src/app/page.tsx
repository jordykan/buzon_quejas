import ReportForm from "@/components/report-form";
import ThemeToggle from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative">
      {/* Modern background pattern */}
      <div className="absolute inset-0 bg-[radial-circle_at_50%_50%,_rgba(148,163,184,0.1)_0%,_transparent_50%] dark:bg-[radial-circle_at_50%_50%,_rgba(148,163,184,0.05)_0%,_transparent_50%]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>

      <ThemeToggle />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
            Buzón Integral
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Un espacio seguro y confidencial para compartir tus reportes, quejas
            y sugerencias de manera anónima.
          </p>
        </header>

        <main className="flex justify-center">
          <ReportForm />
        </main>

        <footer className="mt-20 text-center text-slate-500 dark:text-slate-400">
          <div className="max-w-2xl mx-auto">
            <p className="text-base font-medium mb-2">
              Todos los reportes son tratados con la máxima confidencialidad
            </p>
            <p className="text-sm opacity-75">
              Tu privacidad y seguridad son nuestra prioridad
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
