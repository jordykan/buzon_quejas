import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email'

export async function GET() {
  try {
    console.log('Testing email configuration...');

    // Verificar configuración
    const config = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      adminEmail: process.env.ADMIN_EMAIL
    };

    console.log('Email config:', config);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({
        error: 'Configuración de email incompleta',
        config
      }, { status: 400 });
    }

    // Verificar conexión
    const connectionValid = await emailService.verifyConnection();

    if (!connectionValid) {
      return NextResponse.json({
        error: 'Conexión SMTP fallida',
        config
      }, { status: 500 });
    }

    // Enviar email de prueba
    const testEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const success = await emailService.sendNotificationEmail(
      testEmail!,
      'Email de Prueba',
      'Este es un email de prueba del sistema de buzón de sugerencias.',
      'general'
    );

    return NextResponse.json({
      success,
      message: success ? 'Email enviado correctamente' : 'Error al enviar email',
      config,
      testEmail
    });

  } catch (error) {
    console.error('Error in test-email:', error);
    return NextResponse.json({
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}