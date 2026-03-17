import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const shifts = await prisma.shift.findMany({
    where: {
      userId: session.user.id,
      ...(employeeId ? { employeeId } : {}),
      ...(start && end ? { startTime: { gte: new Date(start), lte: new Date(end) } } : {}),
    },
    include: { employee: true },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(shifts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const shift = await prisma.shift.create({
    data: { ...body, userId: session.user.id },
    include: { employee: true },
  });
  return NextResponse.json(shift);
}
