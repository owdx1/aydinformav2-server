"use client"

import { Heading } from '@/components/heading'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { sizeFormSchema } from '@/schemas/sizeFormSchema'
import { Size } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface SizeFormProps {
  initialData: Size | null
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size"
  const description = initialData ? "Edit a size" : "Add a new size"
  const toastMessage = initialData ? "size updated" : "size created"
  const action = initialData ? "Save changes" : "Create"

  const router = useRouter();

  const handleDeleteSize = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
    .then(() => {
      router.push(`/admin/${params.storeId}/sizes`)
      router.refresh()
      toast("Size deleted")
    })
    .catch((error) => {
      toast.error("error occured", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description={description}
        />
        {initialData && 
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className=' hover:bg-gray-50 rounded-lg transition p-4'>
              <TrashIcon className="text-red-500 h-12 w-12 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 p-4 m-4">
              <div>
                do you really want do delete this size?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteSize()} disabled={isLoading}>
                  Delete
                  {isLoading && <LoaderIcon className="animate-spin" />}
                </Button>
              </div>    
            </PopoverContent>
          </Popover>
        }
      </div>
      <Separator />  
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-8">
        <Formik
          initialValues={{
            name: initialData?.name || "",
            value: initialData?.value || "",
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if(initialData) {
                const response = await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
                  name: values.name,
                  value: values.value,
                  
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/sizes`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/sizes`, {
                  name: values.name,
                  value: values.value,
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/sizes`)
                  router.refresh()
                }
              }
              toast(toastMessage)
              
            } catch (error) {
              toast.error("Something went wrong")
            } finally {
              setLoading(false)
            }
          }}
          validationSchema={sizeFormSchema}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <Form onSubmit={handleSubmit} 
              className='flex flex-col w-full h-full justify-center gap-5'>
              <div>
                <label>name</label>
                <Input 
                  onChange={handleChange}
                  name='name'
                  value={values.name}
                />
                {errors.name && !touched.name && <p className="text-red-500"> {errors.name}</p>}
              </div>
              <div>
                <label>value</label>
                <Input 
                  onChange={handleChange}
                  name='value'
                  value={values.value}
                />
                {errors.value && !touched.value && <p className="text-red-500"> {errors.value}</p>}
              </div>

              <Button type="submit" className='flex gap-4' disabled={isLoading}>
                {action}
                {isLoading && <LoaderIcon className="animate-spin"/>}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}