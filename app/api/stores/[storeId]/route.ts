import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string }}) {

  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json();

    const { name } = body;

    if(!name) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }
    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId
      },
      data: {
        name
      }
    })
    
    return NextResponse.json(store);

  } catch (error) {
    console.log("[STORES_STOREID_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }

  
}


export async function DELETE (req: NextRequest, { params } : { params : { storeId: string }}) {
  
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }


    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    })

    return NextResponse.json(store)




  } catch (error) {
    console.log("[STORES_STOREID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}