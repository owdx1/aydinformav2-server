import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import { Store } from '@prisma/client'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React from 'react'



const DashboardLayout = async  ({ children, params} : {children: React.ReactNode, params : {storeId: string }}) => {

  const { userId } = auth()

  if(!userId) {
    redirect("/admin/sign-in")
  }

  const stores: Store[] = await prismadb.store.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if(stores.length === 0) {
    redirect("/admin")
  } 

  return (
    <div>
      <Navbar stores={stores} />
      {children}
    </div>
  )
}

export default DashboardLayout