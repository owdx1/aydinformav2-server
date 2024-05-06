"use client"

import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { colorFormSchema } from '@/schemas/colorFormSchema'
import { Color, Size } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface ColorFormProps {
  initialData: Color | null
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit color" : "Create color"
  const description = initialData ? "Edit a color" : "Add a new color"
  const toastMessage = initialData ? "color updated" : "color created"
  const action = initialData ? "Save changes" : "Create"

  const router = useRouter();

  const handleDeleteColor = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
    .then(() => {
      router.push(`/admin/${params.storeId}/colors`)
      router.refresh()
      toast("Color deleted")
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
                do you really want do delete this color?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteColor()} disabled={isLoading}>
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
                const response = await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, {
                  name: values.name,
                  value: values.value,
                  
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/colors`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/colors`, {
                  name: values.name,
                  value: values.value,
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/colors`)
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
          validationSchema={colorFormSchema}
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
                  placeholder='enter color name'
                />
                {errors.name && !touched.name && <p className="text-red-500"> {errors.name}</p>}
              </div>
              <div>
                <label>value</label>
                <div className="flex items-center gap-x-4">
                  <Input 
                    onChange={handleChange}
                    name='value'
                    value={values.value}
                    placeholder='#.....'
                  />
                  <div className='border p-4 rounded-md' style={{ backgroundColor: values.value}}/>
                </div>
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