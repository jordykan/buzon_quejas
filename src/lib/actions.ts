'use server'

import { prisma } from '@/lib/prisma'
import { saveFile } from '@/lib/upload'
import { reportSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function submitReport(formData: FormData) {
  try {
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
      ...(file && file.size > 0 && { file })
    }

    const validatedData = reportSchema.parse(validationData)

    let fileUrl: string | undefined = undefined
    if (file && file.size > 0) {
      try {
        fileUrl = await saveFile(file)
      } catch (fileError) {
        console.error('Error saving file:', fileError)
        return {
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Error al guardar el archivo'
        }
      }
    }

    await prisma.report.create({
      data: {
        fullName: validatedData.fullName || null,
        category: validatedData.category,
        area: validatedData.area,
        message: validatedData.message,
        fileUrl
      }
    })

    return { success: true, message: 'Reporte enviado exitosamente' }

  } catch (error) {
    console.error('Error creating report:', error)

    if (error instanceof Error && 'issues' in error) {
      return {
        success: false,
        error: 'Datos inválidos',
        details: (error as any).issues
      }
    }

    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}