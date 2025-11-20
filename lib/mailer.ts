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

  const user = FALLBACK_SMTP_USER
  const pass = FALLBACK_SMTP_PASS
  const host = "smtp.gmail.com"
  const port = 587
  const secure = false
  const from = user

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


