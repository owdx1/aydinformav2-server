import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { SettingsForm } from './components/settings-form'

interface SettingsPageProps {
  params: {
    storeId: string
  }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {

  const { userId } = auth();

  if(!userId) {
    redirect("/admin/sign-in")
  }

  const store = await prismadb.store.findUnique({
    where: {
      id: params.storeId,
      userId
    }
  })

  if(!store) {
    redirect("/admin")
  }

  return (
    <div className='flex flex-col'>
      <div className="flex-1 space-y-4 p-8 py-6">
        <SettingsForm initialData={store} params={params} />
      </div>
    </div>
  )
}

export default SettingsPage