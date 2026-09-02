import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, createAdminSessionToken, isValidAdminCode } from "@/lib/server/admin-session";

export async function POST(request: NextRequest) {
  let code: string | undefined;

  try {
    const body = await request.json();
    code = typeof body?.code === "string" ? body.code : undefined;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!process.env.WAGTI_ADMIN_CODE) {
    return NextResponse.json(
      { error: "WAGTI_ADMIN_CODE n'est pas configuré côté serveur." },
      { status: 500 }
    );
  }

  if (!code || !isValidAdminCode(code)) {
    return NextResponse.json({ error: "Code invalide." }, { status: 401 });
  }

  const { token, maxAge } = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return response;
}
