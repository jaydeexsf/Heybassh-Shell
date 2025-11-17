import type { Prisma, PrismaClient } from "@prisma/client"

type PrismaExecutor = PrismaClient | Prisma.TransactionClient

export type WorkspaceInput = {
  company_name: string
  company_domain: string
  owner_email: string
}

export function padAccountId(seq: number) {
  return seq.toString().padStart(7, "0")
}

export async function createWorkspaceWithAutoId(db: PrismaExecutor, input: WorkspaceInput) {
  const created = await db.account.create({
    data: {
      company_name: input.company_name,
      company_domain: input.company_domain,
      owner_email: input.owner_email,
    },
    select: {
      accountSeq: true,
    },
  })

  const account_id = padAccountId(created.accountSeq)

  return db.account.update({
    where: { accountSeq: created.accountSeq },
    data: { account_id },
    select: {
      account_id: true,
      company_name: true,
      company_domain: true,
      owner_email: true,
      created_at: true,
    },
  })
}

