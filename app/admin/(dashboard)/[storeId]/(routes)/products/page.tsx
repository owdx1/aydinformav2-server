import React from 'react'
import { ProductClient } from './components/client'
import prismadb from '@/lib/prismadb'
import { ProductColumn } from './components/columns'
import { format } from "date-fns"
import { formatter } from '@/lib/utils'

const ProductsPage = async ({ params } : { params : { storeId: string }}) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      
    },
    include: {
      category: true,
      size: true,
      color: true,
    
    },
    orderBy: {
      createAt: "desc"
    }
  })

  console.log(products, "prods")

  const formattedProducts : ProductColumn[] = products.map((item) => ({
    id: item.id,
    createdAt: format(item.createAt, "MMMM do yyyy"),
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    amount: item.amount,
    category: item.category.name,
    size: item.size.name,
    color: item.color.value

  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage