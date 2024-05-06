import React from 'react'
import { BillboardClient } from './components/billboard-client'
import { Billboard } from '@prisma/client'
import prismadb from '@/lib/prismadb'
import { BillboardColumn } from './components/columns'
import { format } from "date-fns"

const BillboardsPage = async ({ params } : { params : { storeId: string }}) => {

  const billboards: Billboard[] = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
      
    },
    orderBy: {
      createadAt: "desc"
    }
  })

  console.log(billboards)

  const formattedBillboards : BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    createdAt: format(item.createadAt, "MMMM do yyyy"),
    label: item.label
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage