
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

// Disable Edge Runtime for this route
// This is needed because bcryptjs uses Node.js APIs not available in Edge Runtime
export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
  account_id: z.string().length(7).optional()
})

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
      const { email, password, name, role, account_id } = schema.parse(body);
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
      
      console.log('Creating user...');
      const user = await prisma.user.create({ 
        data: { 
          email: normalizedEmail, 
          name, 
          passwordHash,
          role: role ?? "user",
          account_id: account_id ?? undefined
        } 
      });
      
      console.log('User created:', user.id);
      return NextResponse.json({ 
        id: user.id, 
        email: user.email,
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
