import React from 'react'
import { CategoryClient } from './components/client'
import prismadb from '@/lib/prismadb'

import { format } from "date-fns"
import { CategoryColumn } from './components/columns'

const CategoriesPage = async ({ params } : { params : { storeId: string }}) => {

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
      
    },
    include:{
      billboard: true
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  console.log(categories)

  const formattedCategories : CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
    billboardLabel: item.billboard.label,
    name: item.name
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage