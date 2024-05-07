"use client"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

type Props = {}

export const MainNav = ({className, ...props}: React.HTMLAttributes<HTMLElement>) => {

  const pathname = usePathname();
  const params = useParams();

  type routeInstance = {
    href: string
    label: string
    active: boolean
  }

  type routeType = routeInstance[]

  const routes: routeType = [
    
    {
      href: `/admin/${params.storeId}`,
      label: "Overview",
      active: pathname === `/admin/${params.storeId}`
    },
    {
      href: `/admin/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/admin/${params.storeId}/billboards`
    },
    {
      href: `/admin/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/admin/${params.storeId}/categories`
    },
    {
      href: `/admin/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/admin/${params.storeId}/sizes`
    },
    {
      href: `/admin/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/admin/${params.storeId}/colors`
    },
    {
      href: `/admin/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/admin/${params.storeId}/products`
    },
    {
      href: `/admin/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/admin/${params.storeId}/orders`
    },
    {
      href: `/admin/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/admin/${params.storeId}/settings`
    },
    
  ]


  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {
        routes.map((route) => (
          <Link href={route.href} key={route.href}
            className={cn("text-sm font-extralight transition-colors hover:text-primary hover:border-b-2",
              route.active ? "text-black font-semibold" : "text-muted-foreground"
            )}
          
          >
            {route.label} {route.active}
          </Link>
        ))
      }
    </nav>
  )
}

