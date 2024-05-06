import React from 'react'
import { SizeClient } from './components/client'
import { Size } from '@prisma/client'
import prismadb from '@/lib/prismadb'
import { SizeColumn } from './components/columns'
import { format } from "date-fns"

const SizesPage = async ({ params } : { params : { storeId: string }}) => {

  const sizes: Size[] = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
      
    },
    orderBy: {
      createdAt: "desc"
    }
    
  })

  console.log(sizes)

  const formattedSizes : SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
    name: item.name,
    value: item.value
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}

export default SizesPage