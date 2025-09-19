"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { submitReport } from "@/lib/actions";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (formData: FormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitReport(formData);

      if (result.success) {
        // Solo limpiar el formulario si el envío fue exitoso
        setIsSubmitted(true);
        toast.success(result.message);
        formRef.current?.reset();
        setSelectedFile(null);
      } else {
        toast.error(result.error || "Error al enviar el reporte. Por favor, verifica los datos.");
        // IMPORTANTE: NO reseteamos el formulario aquí para preservar los datos del usuario
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardContent className="px-8 py-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                ¡Reporte enviado exitosamente!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Tu reporte ha sido procesado en modo de prueba.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Para funcionalidad completa, descomenta el código de producción en /lib/actions.ts
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="h-12 px-8 text-base font-semibold border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Enviar otro reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardContent className="px-8 py-8">
        <form ref={formRef} action={handleSubmit} className="space-y-8">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Nombre completo (opcional)
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Tu nombre completo"
                  className="h-12 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="area"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Área *
                </Label>
                <Input
                  id="area"
                  name="area"
                  placeholder="Área o departamento relacionado"
                  required
                  className="h-12 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Categoría *
              </Label>
              <Select name="category" required>
                <SelectTrigger className="w-full h-12 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Discriminación">Discriminación</SelectItem>
                  <SelectItem value="Corrupción">Corrupción</SelectItem>
                  <SelectItem value="Inconformidades">
                    Inconformidades
                  </SelectItem>
                  <SelectItem value="Sugerencias">Sugerencias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="message"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Tu mensaje *
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Describe los detalles del evento..."
                required
                className="min-h-40 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 resize-none"
              />
              <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4 rounded-lg">
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">
                  Incluye la siguiente información:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></span>
                    <span>Fecha y hora de los hechos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></span>
                    <span>Lugar de la incidencia</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></span>
                    <span>Detalles precisos del evento</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></span>
                    <span>Evidencia disponible</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="file"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Adjuntar archivo (opcional)
              </Label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                  dragActive
                    ? "border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-700/30 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Input
                  ref={fileInputRef}
                  id="file"
                  name="file"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <div className="text-center">
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-10 w-10 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto" />
                      <div>
                        <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                          Arrastra un archivo aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          PDF, DOC, TXT, JPG, PNG (máx. 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 focus:ring-slate-900 dark:focus:ring-slate-100 transition-colors"
              >
                {isSubmitting ? "Enviando..." : "Enviar reporte"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
