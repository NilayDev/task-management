import { NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import User from "../../lib/models/user.model";

export async function GET() {
  await dbConnect();
  const users = await User.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
  return new NextResponse(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
