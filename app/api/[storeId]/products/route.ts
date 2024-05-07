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
    const 
    { 
      name,
      price,
      amount,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images
            
    } = body; 


    if(!name) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!price) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!amount) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!categoryId) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!colorId) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!sizeId) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    if(!images || images.length === 0) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        amount,
        colorId,
        sizeId,
        categoryId,
        isArchived,
        isFeatured,
        storeId: params.storeId,
        images
      }
    })

    return NextResponse.json(product);
   
  } catch (error) {
    console.log("[PRODUCTS_POST]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}




export async function GET(req : NextRequest, { params } : { params : { storeId: string }} ) {
  try {

    const { searchParams } = new URL(req.url)
    
    const categoryId = searchParams.get("categoryId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    if(!params.storeId) {
      return new NextResponse("Unauthorized, no store id", { status: 401 })
    }

    const product = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true: undefined,
        isArchived: false
      },
      include: {
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createAt: "desc"
      }
    })

    return NextResponse.json(product);
   
  } catch (error) {
    console.log("[PRODUCTS_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
}

