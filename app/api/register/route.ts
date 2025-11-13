
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
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
      const { email, password, name } = schema.parse(body);
      console.log('Validated input:', { email, name: name || 'not provided' });

      console.log('Checking if user exists...');
      const exists = await prisma.user.findUnique({ where: { email } });
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
          email, 
          name, 
          passwordHash 
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
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
