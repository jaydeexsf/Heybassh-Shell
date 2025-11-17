
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { createWorkspaceWithAutoId } from "@/lib/workspaces"

// Disable Edge Runtime for this route
// This is needed because bcryptjs uses Node.js APIs not available in Edge Runtime
export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
  account_id: z.string().length(7).optional(),
  company_name: z.string().min(2).max(120).optional(),
  company_domain: z.string().min(3).max(191).optional(),
})

const domainPattern = /^[a-z0-9.-]+\.[a-z]{2,}$/i

function sanitizeDomain(input?: string | null) {
  if (!input) return ""
  return input
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase()
}

function deriveCompanyName(domain: string, fallbackEmail: string) {
  if (domain) {
    const candidate = domain.split(".")[0]
    if (candidate) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1)
    }
  }
  const localPart = fallbackEmail.split("@")[0] || "Workspace"
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}

function normalizeDomainFromEmail(email: string) {
  return email.split("@")[1]?.toLowerCase() ?? ""
}

export async function POST(req: Request) {
  try {
    console.log('Registration request received');
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }

    try {
      const { email, password, name, role, account_id, company_name, company_domain } = schema.parse(body);
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Validated input:', { email: normalizedEmail, name: name || 'not provided' });

      console.log('Checking if user exists...');
      const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (exists) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: "Email already registered" }, 
          { status: 409 }
        );
      }

      console.log('Hashing password...');
      const passwordHash = await bcrypt.hash(password, 10);

      let workspaceId = account_id?.trim()
      if (workspaceId) {
        const existingAccount = await prisma.account.findUnique({ where: { account_id: workspaceId } })
        if (!existingAccount) {
          return NextResponse.json(
            { error: "ACCOUNT_NOT_FOUND", message: "Provided workspace ID does not exist." },
            { status: 404 }
          )
        }
      } else {
        const derivedDomain = sanitizeDomain(company_domain) || normalizeDomainFromEmail(normalizedEmail)
        if (!derivedDomain || !domainPattern.test(derivedDomain)) {
          return NextResponse.json(
            { error: "COMPANY_DOMAIN_REQUIRED", message: "Enter a valid company domain (e.g. example.com)." },
            { status: 400 }
          )
        }

        const resolvedCompanyName = (company_name?.trim() || deriveCompanyName(derivedDomain, normalizedEmail)).slice(0, 120)
        const account = await createWorkspaceWithAutoId(prisma, {
          company_name: resolvedCompanyName,
          company_domain: derivedDomain,
          owner_email: normalizedEmail,
        })
        workspaceId = account.account_id ?? undefined
      }
      
      console.log('Creating user...');
      const user = await prisma.user.create({ 
        data: { 
          email: normalizedEmail, 
          name, 
          passwordHash,
          role: role ?? "user",
          account_id: workspaceId ?? undefined
        } 
      });
      
      console.log('User created:', user.id);
      return NextResponse.json({ 
        id: user.id, 
        email: user.email,
        account_id: workspaceId,
        message: 'Registration successful' 
      });

    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation error',
            details: validationError.errors 
          }, 
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error: unknown) {
    console.error('Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = (error instanceof Error && process.env.NODE_ENV === 'development') 
      ? error.stack 
      : undefined;
      
    return NextResponse.json(
      { 
        error: errorMessage,
        stack: errorStack
      }, 
      { status: 500 }
    );
  }
}
