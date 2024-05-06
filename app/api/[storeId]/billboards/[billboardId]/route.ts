import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest, { params } : { params : { billboardId: string }}) {
  
  try {

    if(!params.billboardId) {
      return new NextResponse("billboard id is required", { status: 400 })
    }


    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)




  } catch (error) {
    console.log("[BILLBOARDS_BILLBOARDID_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string, billboardId: string }}) {

  try {
    const { userId } = auth()
    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json();

    const { label, imageUrl } = body;

    if(!label) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }
    if(!imageUrl) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }
    if(!params.billboardId) {
      return new NextResponse("billboard id is required", { status: 400 })
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


    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      },
      data: {
        label,
        imageUrl
      }
    })
    
    return NextResponse.json(billboard);

  } catch (error) {
    console.log("[BILLBOARDS_BILLBOARDID_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }

  
}

export async function DELETE (req: NextRequest, { params } : { params : { storeId: string, billboardId: string }}) {
  
  try {

    const { userId } = auth();  
    
    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    if(!params.billboardId) {
      return new NextResponse("billboard id is required", { status: 400 })
    }


    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard)




  } catch (error) {
    console.log("[BILLBOARDS_BILLBOARDID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}