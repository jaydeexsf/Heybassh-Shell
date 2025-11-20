import nodemailer, { Transporter } from "nodemailer"

type MailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

let cachedTransporter: Transporter | null = null
let cachedConfig: MailConfig | null = null

function ensureEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function resolveConfig(): MailConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  const user = ensureEnv(process.env.SMTP_USER, "SMTP_USER")
  const pass = ensureEnv(process.env.SMTP_PASSWORD, "SMTP_PASSWORD")
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

export function getMailer(): Transporter {
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


