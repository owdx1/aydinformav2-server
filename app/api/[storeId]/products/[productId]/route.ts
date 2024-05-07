import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest, { params } : { params : { productId: string }}) {
  
  try {

    if(!params.productId) {
      return new NextResponse("product id is required", { status: 400 })
    }


    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        size: true,
        color: true,
        category: true
      }
    })

    return NextResponse.json(product)




  } catch (error) {
    console.log("[PRODUCT_PRODUCDID_GET]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}

export async function PATCH (req: NextRequest, { params } : { params : { storeId: string, productId: string }}) {

  try {

    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
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

    const body = await req.json();

    const { 
      name,
      price,
      amount,
      colorId,
      sizeId,
      categoryId,
      isArchived,
      isFeatured,
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
    if(!images || !images.length) {
      return new NextResponse("Invalid credentials", { status: 400 })
    }

    const product = await prismadb.product.updateMany({
      where: {
        id: params.productId,
        storeId: params.storeId
      },
      data: {
        name,
        price,
        amount,
        colorId,
        sizeId,
        categoryId,
        isArchived,
        isFeatured,
        images 
      }
    })
    
    return NextResponse.json(product);

  } catch (error) {
    console.log("[PRODUCT_PRODUCTID_PATCH]", error)
    return new NextResponse("Server error", { status: 500 })
  }

  
}

export async function DELETE (req: NextRequest, { params } : { params : { storeId: string, productId: string }}) {
  
  try {

    const { userId } = auth();  
    
    if(!userId) {
      return new NextResponse("Unauthenticated", { status: 400 })
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    if(!params.productId) {
      return new NextResponse("product id is required", { status: 400 })
    }


    const productId = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(productId)

  } catch (error) {
    console.log("[PRODUCT_PRODUCTID_DELETE]", error)
    return new NextResponse("Server error", { status: 500 })
  }
  
}