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
    const { name, billboardId } = body; 

    if(!name) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }
    if(!billboardId) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
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

    return NextResponse.json(billboardId);
   
  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}






export async function GET(req : NextRequest, { params } : { params : { storeId: string }} ) {
  
  try {
    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
        
      }
    })

    return NextResponse.json(categories);
   
  } catch (error) {
    console.log("[CATEGORIES_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

