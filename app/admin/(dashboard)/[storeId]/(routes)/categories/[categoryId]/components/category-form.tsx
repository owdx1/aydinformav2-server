"use client"

import { Heading } from '@/components/heading'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { billboardFormSchema } from '@/schemas/billboardFormSchema'
import { categoryFormSchema } from '@/schemas/categoryFormSchema'
import { Billboard, Category } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category"
  const description = initialData ? "Edit a Category" : "Add a new Category"
  const toastMessage = initialData ? "Category updated" : "Category created"
  const action = initialData ? "Save changes" : "Create"

  const router = useRouter();

  const handleDeleteCategory = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
    .then(() => {
      router.push(`/admin/${params.storeId}/categories`)
      router.refresh()
      toast("Category deleted")
    })
    .catch((error) => {
      toast.error("error occured", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

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
                do you really want do delete this category?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteCategory()} disabled={isLoading}>
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
            billboardId: initialData?.billboardId || ""
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if(initialData) {
                const response = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, {
                  name: values.name,
                  billboardId: values.billboardId
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/categories`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/categories`, {
                  name: values.name,
                  billboardId: values.billboardId
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/categories`)
                  router.refresh()
                }
              }
              toast(toastMessage)
              
            } catch (error) {
              toast.error("Something went wrong")
            } finally {
              setLoading(false)
            }
            console.log(values)
          }}
          validationSchema={categoryFormSchema}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <Form onSubmit={handleSubmit} 
              className='flex flex-col w-full h-full justify-center gap-5'
            >
              <div>
                <label>Label</label>
                <Input 
                  onChange={handleChange}
                  name='name'
                  value={values.name}
                  placeholder='Category name'
                />
                {errors.name && !touched.name && <p className="text-red-500"> {errors.name}</p>}
              </div>
              <div>
                <label>Billboard</label>
                <Select 
                  disabled={isLoading}
                  onValueChange={(value) => handleChange({target: {name:"billboardId", value}})}
                  name='billboardId'
                  value={values.billboardId}
                  defaultValue={values.billboardId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a billboard..."/>
                  </SelectTrigger>
                  <SelectContent>
                    {billboards.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.billboardId && !touched.billboardId && <p className="text-red-500"> {errors.billboardId}</p>}
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