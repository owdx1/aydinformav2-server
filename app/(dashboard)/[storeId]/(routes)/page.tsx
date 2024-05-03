import prismadb from '@/lib/prismadb'
import React from 'react'

interface StoreSpecialPageProps {
  params: { storeId : string }
}

const StoreSpecialPage: React.FC<StoreSpecialPageProps> = async ({ params }) => {

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  })


  return (
    <div>
      Active: {store?.name}
    </div>
  )
}

export default StoreSpecialPage