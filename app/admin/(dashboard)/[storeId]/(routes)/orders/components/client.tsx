"use client"
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/data-table'

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {

  return (
    <>
      <Heading title={`Orders(${data.length})`} description='Your Orders..'/>      
      <Separator />
      <DataTable columns={columns} data={data} searchKey='products' />
    </>
  )
}
