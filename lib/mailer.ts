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
  process.env.EMAIL_FROM || "Heybassh Portal <noreply@app.heybassh.com>"

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

function wrapResendError(error: unknown): Error {
  if (!error || typeof error !== "object") {
    return new Error(typeof error === "string" ? error : "Failed to send email via Resend")
  }

  const message =
    typeof (error as any).message === "string"
      ? (error as any).message
      : "Failed to send email via Resend"

  const wrapped = new Error(message)
  ;(wrapped as any).code =
    (error as any).code || (error as any).name || (error as any).statusCode || "RESEND_ERROR"
  ;(wrapped as any).statusCode = (error as any).statusCode
  ;(wrapped as any).cause = error
  ;(wrapped as any).details = error
  return wrapped
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
    throw wrapResendError(error)
  }
}


