import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'
import { z } from 'zod'

const emailSchema = z.object({
  to: z.string().email('Email inválido'),
  subject: z.string().min(1, 'El asunto es requerido'),
  message: z.string().min(1, 'El mensaje es requerido'),
  type: z.enum(['nueva', 'respuesta', 'general']).optional().default('general')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = emailSchema.parse(body)

    const success = await emailService.sendNotificationEmail(
      validatedData.to,
      validatedData.subject,
      validatedData.message,
      validatedData.type
    )

    if (success) {
      return NextResponse.json(
        { message: 'Email enviado exitosamente' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending email:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}