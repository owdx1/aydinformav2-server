import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest, { params } : { params : { colorId: string }}) {
  
  try {

    if(!params.colorId) {
      return new NextResponse("color id is required", { status: 400 })
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log("[COLORS_COLORID_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string, colorId: string }}) {

  try {
    const { userId } = auth()
    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
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
      return new NextResponse("Store id is required", { status: 400 })
    }
    if(!params.colorId) {
      return new NextResponse("color id is required", { status: 400 })
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


    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      },
      data: {
        name,
        value
      }
    })
    
    return NextResponse.json(color);

  } catch (error) {
    console.log("[SIZES_colorId_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

export async function DELETE (req: NextRequest, { params } : { params : { storeId: string, colorId: string }}) {
  
  try {

    const { userId } = auth();  
    
    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    if(!params.colorId) {
      return new NextResponse("color id is required", { status: 400 })
    }


    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log("[COLORS_COLORID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}