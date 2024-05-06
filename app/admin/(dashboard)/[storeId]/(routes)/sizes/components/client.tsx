"use client"
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { columns, SizeColumn } from './columns'
import { DataTable } from '@/components/data-table'

interface SizeClientProps {
  data: SizeColumn[]
}

export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {

  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Sizes(${data.length})`} description='Your sizes..'/>
        <Button onClick={() => router.push(`/admin/${params.storeId}/sizes/new`)}>
          <PlusIcon className='mr-2 h-4 w-4' /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
    </>
  )
}
