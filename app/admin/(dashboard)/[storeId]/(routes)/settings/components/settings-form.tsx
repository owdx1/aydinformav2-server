"use client"

import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { settingsFormSchema } from '@/schemas/settingsFormSchema'
import { Store } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface SettingsFormProps {
  initialData: Store
  params: {
    storeId: string
  }
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData, params }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleDeleteStore = () => {
    setLoading(true);
    const response = axios.delete(`/api/stores/${params.storeId}`)
    .then(() => {
      router.push("/admin")
      router.refresh()
    })
    .catch((error) => {
      toast.error("error occured", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences"/>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className=' hover:bg-gray-50 rounded-lg transition p-4'>
            <TrashIcon className="text-red-500 h-12 w-12 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-4 p-4 m-4">
            <div>
              do you really want do delete this store?
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteStore()} disabled={isLoading}>
                Delete
                {isLoading && <LoaderIcon className="animate-spin" />}
              </Button>
            </div>
            
          </PopoverContent>
        </Popover>
        
      </div>
      <hr />
      <Separator />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-8">
        <Formik
          initialValues={{
            name: initialData.name
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true)
              const response = await axios.patch(`/api/stores/${params.storeId}`, {
                name: values.name
              })

              router.refresh()
              toast.success("Store updated!")
              
            } catch (error) {
              toast.error("Something went wrong")
            } finally {
              setLoading(false)
            }
          }}
          validationSchema={settingsFormSchema}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <Form onSubmit={handleSubmit} className='flex flex-col w-full h-full justify-center gap-5'>
              <div>
                <label>name</label>
                <Input 
                  onChange={handleChange}
                  name='name'
                  value={values.name}
                />
                {errors.name && !touched.name && <p className="text-red-500"> {errors.name}</p>}
              </div>

              <Button type="submit" className='flex gap-4' disabled={isLoading}>
                Update
                {isLoading && <LoaderIcon className="animate-spin"/>}
              </Button>
            </Form>
          )}

        </Formik>
      </div>
    </>
  )
}