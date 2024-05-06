import React from 'react'
import { ColorClient } from './components/client'
import { Color, Size } from '@prisma/client'
import prismadb from '@/lib/prismadb'
import { ColorColumn } from './components/columns'
import { format } from "date-fns"

const ColorsPage = async ({ params } : { params : { storeId: string }}) => {

  const colors: Color[] = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
      
    },
    orderBy: {
      createdAt: "desc"
    }
    
  })

  const formattedColors : ColorColumn[] = colors.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
    name: item.name,
    value: item.value
  }))

  console.log("formatlanmıs colorlar", formattedColors)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

export default ColorsPage