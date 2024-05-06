import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest, { params } : { params : { sizeId: string }}) {
  
  try {

    if(!params.sizeId) {
      return new NextResponse("size id is required", { status: 400 })
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log("[SIZES_SIDEID_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string, sizeId: string }}) {

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
    if(!params.sizeId) {
      return new NextResponse("size id is required", { status: 400 })
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


    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId
      },
      data: {
        name,
        value
      }
    })
    
    return NextResponse.json(size);

  } catch (error) {
    console.log("[SIZES_SIZEID_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }

  
}

export async function DELETE (req: NextRequest, { params } : { params : { storeId: string, sizeId: string }}) {
  
  try {

    const { userId } = auth();  
    
    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    if(!params.sizeId) {
      return new NextResponse("size id is required", { status: 400 })
    }


    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log("[SIZES_SIZEID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}