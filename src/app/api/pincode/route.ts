import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get("pin");

  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pin}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    if (data[0]?.Status !== "Success" || !data[0]?.PostOffice?.length) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    }

    const po = data[0].PostOffice[0];
    return NextResponse.json({
      city: po.District,
      district: po.District,
      state: po.State,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pincode" }, { status: 500 });
  }
}
