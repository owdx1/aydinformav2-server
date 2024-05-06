import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const RootLayout = async ({children} : {children: React.ReactNode}) => {


  const { userId } = auth();

  if(!userId) {
    redirect("/admin/sign-in")
  }
  const store = await prismadb.store.findFirst({
    where: {
      userId
    }
  })

  if(store) {
    redirect(`/admin/${store.id}`)
  }

  return (
    <>
      {children}
    </>
  )
}

export default RootLayout