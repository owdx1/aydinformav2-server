"use client"

import { Heading } from '@/components/heading'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { billboardFormSchema } from '@/schemas/billboardFormSchema'
import { Billboard } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface BillboardFormProps {
  initialData: Billboard | null
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard"
  const description = initialData ? "Edit a billboard" : "Add a new billboard"
  const toastMessage = initialData ? "Billboard updated" : "Billboard created"
  const action = initialData ? "Save changes" : "Create"

  const router = useRouter();

  const handleDeleteBillboard = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
    .then(() => {
      router.push(`/admin/${params.storeId}/billboards`)
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

  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl as string || "") 
  const params = useParams();
  console.log(params)

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
                do you really want do delete this billboard?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteBillboard()} disabled={isLoading}>
                  Delete
                  {isLoading && <LoaderIcon className="animate-spin" />}
                </Button>
              </div>    
            </PopoverContent>
          </Popover>
        }
      </div>
      <Separator />
      <ImageUpload value={imageUrl ? [imageUrl] : []}
        onChange={(url) => setImageUrl(url)}
        disabled={isLoading}
        onRemove={() =>  setImageUrl("")}     
      />    
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-8">
        <Formik
          initialValues={{
            label: initialData?.label || "",
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if(initialData) {
                const response = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
                  label: values.label,
                  imageUrl
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/billboards`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/billboards`, {
                  label: values.label,
                  imageUrl
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/billboards`)
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
          validationSchema={billboardFormSchema}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <Form onSubmit={handleSubmit} 
              className='flex flex-col w-full h-full justify-center gap-5'>
              <div>
                <label>Label</label>
                <Input 
                  onChange={handleChange}
                  name='label'
                  value={values.label}
                />
                {errors.label && !touched.label && <p className="text-red-500"> {errors.label}</p>}
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