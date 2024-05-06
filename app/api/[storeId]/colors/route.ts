import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req : NextRequest, { params } : { params : { storeId: string }} ) {
  
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    const body = await req.json();
    const { name, value } = body; 

    if(!name) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }
    if(!value) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) {
      return new NextResponse("Unauthorized, no store for this user", { status: 403 })
    }

    return NextResponse.json(color);
   
  } catch (error) {
    console.log("[COLORS_POST]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

export async function GET (req : NextRequest, { params } : { params : { storeId: string }} ) {
  
  try {
    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(colors);
   
  } catch (error) {
    console.log("[COLORS_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

