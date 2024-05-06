"use client"

import React, { useState } from 'react'
import { BillboardColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Copy, Edit, MoreHorizontal, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface CellActionProps {
  data: BillboardColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast("Copied")
  }

  const handleDeleteBillboard = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
    .then(() => {
      router.refresh()
      toast("Billboard deleted")
    })
    .catch((error) => {
      toast.error("error occured", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className='w-8 h-8 p-0'>
          <span className="sr-only">Open Menu</span>
          <MoreHorizontal className='h-4 w-4 '/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/admin/${params.storeId}/billboards/${data.id}`)}>
          <Edit className='mr-2 h-4 w-4'/>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className='mr-2 h-4 w-4'/>
          Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBillboard()}>
          <TrashIcon className='mr-2 h-4 w-4'/>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
