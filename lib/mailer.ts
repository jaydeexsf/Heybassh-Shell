import nodemailer from "nodemailer"

type MailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

type MailerInstance = ReturnType<typeof nodemailer.createTransport>

let cachedTransporter: MailerInstance | null = null
let cachedConfig: MailConfig | null = null

const FALLBACK_SMTP_USER = "jaydeexsf0@gmail.com"
const FALLBACK_SMTP_PASS = "bgoz akel fvqb muqt"

function resolveConfig(): MailConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  let user = process.env.SMTP_USER
  let pass = process.env.SMTP_PASSWORD

  if (!user || !pass) {
    console.warn("[SMTP] Environment variables SMTP_USER/SMTP_PASSWORD not set. Using fallback credentials for email delivery. Update your environment variables to use your own SMTP account.")
    user = FALLBACK_SMTP_USER
    pass = FALLBACK_SMTP_PASS
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com"
  const port = Number(process.env.SMTP_PORT || "587")
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465
  const from = process.env.SMTP_FROM || user

  cachedConfig = { host, port, secure, user, pass, from }
  return cachedConfig
}

export function getMailer(): MailerInstance {
  if (cachedTransporter) {
    return cachedTransporter
  }

  const config = resolveConfig()
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })

  return cachedTransporter
}

export function getMailFrom(): string {
  return resolveConfig().from
}

export function getMailerConfig(): MailConfig {
  return resolveConfig()
}


