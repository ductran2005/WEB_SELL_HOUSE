import { NextResponse } from 'next/server'
import { z } from 'zod'
import { leadFormSchema } from '@/lib/validations'

const submitSchema = leadFormSchema.extend({
  campaignName: z.string().trim().min(1).optional(),
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildLeadEmail(lead: z.infer<typeof submitSchema>) {
  const campaignName = lead.campaignName || 'Landing page'
  const rows = [
    ['Ho va ten', lead.fullName],
    ['So dien thoai', lead.phone],
    ['Email', lead.email],
    ['Nhu cau', lead.demand],
    ['Campaign', campaignName],
  ]

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('')

  return {
    subject: `Lead moi tu ${campaignName}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827;">
        <h2 style="margin:0 0 16px;">Thong tin khach hang moi</h2>
        <table style="border-collapse:collapse;width:100%;max-width:640px;">${htmlRows}</table>
      </div>
    `,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  }
}

async function sendLeadEmail(lead: z.infer<typeof submitSchema>) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.RESEND_TO_EMAIL

  if (!apiKey || !from || !to) {
    throw new Error('Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or RESEND_TO_EMAIL')
  }

  const email = buildLeadEmail(lead)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: to.split(',').map((emailAddress) => emailAddress.trim()).filter(Boolean),
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: lead.email,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Resend failed with ${response.status}: ${message}`)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body using our shared Zod schema
    const validationResult = submitSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, errors: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    await sendLeadEmail(validationResult.data)

    // Simulate sending data to webhook URL (configured in .env)
    const webhookUrl = process.env.FORM_SUBMIT_WEBHOOK_URL
    const secret = process.env.FORM_SUBMIT_SECRET

    if (webhookUrl) {
      console.log(`[Webhook] Forwarding lead to: ${webhookUrl} with secret: ${secret ? '***' : 'none'}`)
      // In actual deployment, we would make a POST request to webhookUrl:
      // await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Webhook-Secret': secret || '',
      //   },
      //   body: JSON.stringify(validationResult.data),
      // })
    }

    // Respond with success
    return NextResponse.json({ success: true, lead: validationResult.data })
  } catch (error) {
    console.error('Error submitting lead form:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
