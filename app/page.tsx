
import Link from 'next/link'
import React from 'react'

type Props = {}

const LandingPage = (props: Props) => {
  return (
    <Link href="/admin">
      Admin
    </Link>
  )
}

export default LandingPage