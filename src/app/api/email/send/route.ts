import { NextResponse } from 'next/server';
import { getEmailSequence as getEmailSeq, EmailSequenceType } from '@/lib/email-sequences';

/**
 * API endpoint для отправки email
 * В будущем можно интегрировать с SendGrid, Resend, Postmark и т.д.
 */

export async function POST(request: Request) {
  try {
    const { type, to, data } = await request.json();

    if (!type || !to) {
      return NextResponse.json({ error: 'Type and email are required' }, { status: 400 });
    }

    // Получаем шаблон
    const sequence = getEmailSeq(type as EmailSequenceType);
    if (!sequence) {
      return NextResponse.json({ error: 'Email sequence not found' }, { status: 404 });
    }

    // Здесь можно интегрировать с email-сервисом
    // Например: SendGrid, Resend, Postmark, AWS SES
    
    // Пример с Resend (раскомментировать когда будет настроен):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'EDEM <noreply@chatedem.com>',
      to: [to],
      subject: sequence.template.subject,
      html: sequence.template.html,
      text: sequence.template.text,
    });
    */

    // Пока просто логируем
    console.log('[Email] Would send email:', {
      type,
      to,
      subject: sequence.template.subject,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Email queued for sending',
    });
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}


