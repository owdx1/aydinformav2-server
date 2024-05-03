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
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`
    }
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

