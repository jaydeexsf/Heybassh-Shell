import { Resend } from "resend"

type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

const resendApiKey = process.env.RESEND_API_KEY
const defaultFromEmail =
  process.env.EMAIL_FROM || "Heybassh Shell <onboarding@resend.dev>"

let client: Resend | null = null

function getClient(): Resend {
  if (client) {
    return client
  }

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.")
  }

  client = new Resend(resendApiKey)
  return client
}

export async function sendEmail({ from, ...rest }: SendEmailInput) {
  const sender = from ?? defaultFromEmail
  if (!sender) {
    throw new Error("Missing sender email. Set EMAIL_FROM or pass `from`.")
  }

  const { error } = await getClient().emails.send({
    from: sender,
    ...rest,
  })

  if (error) {
    throw error
  }
}


