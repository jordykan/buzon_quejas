import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveFile } from '@/lib/upload'
import { reportSchema } from '@/lib/validations'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const fullName = formData.get('fullName') as string || undefined
    const category = formData.get('category') as string
    const area = formData.get('area') as string
    const message = formData.get('message') as string
    const file = formData.get('file') as File | null

    const validationData = {
      fullName,
      category,
      area,
      message,
      ...(file && { file })
    }

    const validatedData = reportSchema.parse(validationData)

    let fileUrl: string | undefined = undefined
    if (file && file.size > 0) {
      fileUrl = await saveFile(file)
    }

    const report = await prisma.report.create({
      data: {
        fullName: validatedData.fullName || null,
        category: validatedData.category,
        area: validatedData.area,
        message: validatedData.message,
        fileUrl
      }
    })

    // Enviar notificación por email si está configurado
    console.log('Checking email configuration...', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      adminEmail: process.env.ADMIN_EMAIL
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        console.log(`Sending email to: ${adminEmail}`);

        const emailSent = await emailService.sendNotificationEmail(
          adminEmail,
          `Nueva sugerencia en ${validatedData.area}`,
          `Se ha recibido una nueva sugerencia:

**Categoría:** ${validatedData.category}
**Área:** ${validatedData.area}
**De:** ${validatedData.fullName || 'Anónimo'}

**Mensaje:**
${validatedData.message}

**ID del reporte:** ${report.id}`,
          'nueva'
        );

        console.log('Email sent result:', emailSent);
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    } else {
      console.log('Email configuration missing, skipping email notification');
    }

    return NextResponse.json(
      {
        message: 'Reporte enviado exitosamente',
        reportId: report.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating report:', error)

    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.issues
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