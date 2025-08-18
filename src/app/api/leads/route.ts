import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Quick GET to verify route exists
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company || null,
        websiteType: body.websiteType || null,
        budget: body.budget || null,
        goals: body.goals || null,
               timeline: body.timeline || null,
        updates: Boolean(body.updates),
      },
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/leads failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
