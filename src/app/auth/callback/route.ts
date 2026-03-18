import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("next") ?? "/login";

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
