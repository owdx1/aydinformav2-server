"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePlusIcon, TrashIcon } from 'lucide-react'
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void

  value: string[]
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    console.log("Upload gerçekleşti")
    onChange(result.info.secure_url)
  }


  if(!isMounted) {
    return null
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className='z-10 absolute right-2 top-2'>
              <Button type="button" onClick={() => onRemove(url)} variant="destructive">
                <TrashIcon className='h-4 w-4' />
              </Button>
            </div>
            <Image 
              fill
              alt=''
              src={url}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset='dq7mumlr'>
        {({ open }) => {
          const onClick = () =>{
            open()
          }
          return(
            <Button type="button" variant="secondary" onClick={onClick} className="" disabled={disabled}>
              <ImagePlusIcon className='h-2 w-4 mr-2' />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload