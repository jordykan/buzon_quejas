# Buzón Integral

Sistema web moderno para reportes confidenciales de quejas y sugerencias, desarrollado con Next.js 15, TailwindCSS, ShadCN UI y Prisma.

## Características

- 🔒 **Seguridad y Confidencialidad**: Reportes anónimos con máxima privacidad
- 📱 **Diseño Responsivo**: Interfaz moderna tipo SaaS compatible con todos los dispositivos
- 📁 **Carga de Archivos**: Drag & drop para adjuntar evidencias
- ⚡ **Validación en Tiempo Real**: Validación de formularios con Zod
- 🎨 **UI Profesional**: Componentes de ShadCN UI con estilo minimalista
- 🗄️ **Base de Datos**: Persistencia con SQLite/PostgreSQL usando Prisma

## Tecnologías

- **Frontend**: Next.js 15 (App Router), TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes, Server Actions
- **Base de Datos**: Prisma ORM con SQLite (desarrollo)
- **Validación**: Zod
- **UI**: Lucide React icons, Sonner toasts

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la base de datos:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3001](http://localhost:3001) en el navegador

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/reports/          # API endpoints
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
├── components/
│   ├── ui/                  # Componentes ShadCN
│   └── report-form.tsx      # Formulario principal
└── lib/
    ├── actions.ts           # Server Actions
    ├── prisma.ts            # Cliente Prisma
    ├── upload.ts            # Utilidades de archivos
    ├── utils.ts             # Utilidades generales
    └── validations.ts       # Esquemas Zod
```

## Funcionalidades

### Formulario de Reportes
- Nombre completo (opcional)
- Categorías: Discriminación, Corrupción, Inconformidades, Sugerencias
- Área afectada
- Mensaje detallado con guías
- Carga de archivos con drag & drop

### Validaciones
- Campos requeridos
- Longitud mínima de mensajes
- Tipos de archivo permitidos
- Manejo de errores en tiempo real

### Confirmación
- Mensaje de éxito después del envío
- Toast notifications
- Opción para enviar otro reporte

## Base de Datos

### Modelo Report
```prisma
model Report {
  id        String   @id @default(uuid())
  fullName  String?
  category  String
  area      String
  message   String
  fileUrl   String?
  createdAt DateTime @default(now())
}
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting

## Configuración para Producción

Para producción, cambiar a PostgreSQL:

1. Actualizar `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Configurar variable de entorno:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/buzon_db"
   ```

3. Ejecutar migración:
   ```bash
   npx prisma migrate deploy
   ```

## Estado del Proyecto

✅ **Sistema completamente funcional** - Listo para usar en desarrollo

- Frontend con diseño profesional implementado
- Backend con API y validaciones funcionando
- Base de datos configurada y migraciones aplicadas
- Servidor de desarrollo ejecutándose en http://localhost:3001

## Licencia

MIT
