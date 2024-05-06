import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest, { params } : { params : { categoryId: string }}) {
  
  try {

    if(!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 })
    }


    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      }
    })

    return NextResponse.json(category)




  } catch (error) {
    console.log("[CATEGORIES_CATEGORYID_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string, categoryId: string }}) {

  try {
    const { userId } = auth()
    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
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
      return new NextResponse("Store id is required", { status: 400 })
    }
    if(!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 })
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


    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId
      },
      data: {
        name,
        billboardId
      }
    })
    
    return NextResponse.json(category);

  } catch (error) {
    console.log("[CATEGORIES_CATEGORYID_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }

  
}

export async function DELETE (req: NextRequest, { params } : { params : { storeId: string, categoryId: string }}) {
  
  try {

    const { userId } = auth();  
    
    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    if(!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 })
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


    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log("[CATEGORIES_CATEGORYID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}