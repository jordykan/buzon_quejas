'use server'

import { prisma } from '@/lib/prisma'
import { saveFile } from '@/lib/upload'
import { reportSchema } from '@/lib/validations'

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

    // MODO DE PRUEBA - Esta función solo simula el envío del reporte
    // Para usar en producción, descomenta el código a continuación y configura las variables de entorno

    /* CÓDIGO PARA PRODUCCIÓN - DESCOMENTA PARA USAR:
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
    */

    // Simulación de respuesta exitosa para demostración
    console.log('MODO DE PRUEBA - Datos del reporte:', {
      fullName: validatedData.fullName,
      category: validatedData.category,
      area: validatedData.area,
      message: validatedData.message,
      hasFile: !!(file && file.size > 0)
    })

    return {
      success: true,
      message: '✅ MODO DE PRUEBA: Reporte procesado correctamente (no guardado en base de datos)'
    }

  } catch (error) {
    console.error('Error creating report:', error)

    if (error instanceof Error && 'issues' in error) {
      return {
        success: false,
        error: 'Datos inválidos',
        details: (error as { issues: { path?: (string | number)[]; message: string }[] }).issues
      }
    }

    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}