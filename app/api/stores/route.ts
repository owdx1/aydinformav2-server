import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
  
  const { userId } = auth()

  if(!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json();
  const { name } = body; 

  if(!name) {
    return new NextResponse("Invalid credentials", { status: 400 })
  }

  const store = await prismadb.store.create({
    data: {
      name: name,
      userId: userId
    }
  })

  return NextResponse.json(store);





  try {

    
    
  } catch (error) {
    console.log("[STORES_POST]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}