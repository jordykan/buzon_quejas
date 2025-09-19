import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Sistema de Buzón',
          address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || '',
        },
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendNotificationEmail(recipientEmail: string, title: string, message: string, type: 'nueva' | 'respuesta' | 'general' = 'general'): Promise<boolean> {
    const htmlTemplate = this.getNotificationTemplate(title, message, type);

    return this.sendEmail({
      to: recipientEmail,
      subject: `Buzón de Sugerencias - ${title}`,
      html: htmlTemplate,
      text: `${title}\n\n${message}`,
    });
  }

  private getNotificationTemplate(title: string, message: string, type: 'nueva' | 'respuesta' | 'general'): string {
    const typeColors = {
      nueva: '#10b981',
      respuesta: '#3b82f6',
      general: '#6b7280'
    };

    const typeLabels = {
      nueva: 'Nueva Sugerencia',
      respuesta: 'Respuesta a Sugerencia',
      general: 'Notificación'
    };

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación - Buzón de Sugerencias</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background-color: ${typeColors[type]};
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .badge {
            background-color: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 8px;
            display: inline-block;
          }
          .content {
            padding: 30px;
          }
          .title {
            color: #2d3748;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          .message {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid ${typeColors[type]};
            margin: 20px 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .logo {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Buzón de Sugerencias</h1>
            <div class="badge">${typeLabels[type]}</div>
          </div>

          <div class="content">
            <h2 class="title">${title}</h2>

            <div class="message">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="footer">
            <div class="logo">Sistema de Buzón de Sugerencias</div>
            <p>Este es un mensaje automático del sistema. Por favor, no responda a este email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export { EmailService };