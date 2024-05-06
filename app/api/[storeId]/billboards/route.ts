import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest, { params } : { params : { storeId: string }} ) {
  
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    const body = await req.json();
    const { label, imageUrl } = body; 

    if(!label) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }
    if(!imageUrl) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label: label,
        imageUrl: imageUrl,
        storeId: params.storeId
      }
    })

    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) {
      return new NextResponse("Unauthorized, no store for this user", { status: 403 })
    }

    return NextResponse.json(billboard);
   
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}






export async function GET(req : NextRequest, { params } : { params : { storeId: string }} ) {
  
  try {
    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard);
   
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

