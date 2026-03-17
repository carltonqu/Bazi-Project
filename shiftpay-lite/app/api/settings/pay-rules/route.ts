import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let settings = await prisma.paySettings.findUnique({ where: { userId: session.user.id } });
  if (!settings) {
    settings = await prisma.paySettings.create({ data: { userId: session.user.id } });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const settings = await prisma.paySettings.upsert({
    where: { userId: session.user.id },
    update: body,
    create: { userId: session.user.id, ...body },
  });
  return NextResponse.json(settings);
}
