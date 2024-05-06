"use client"

import { Heading } from '@/components/heading'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { billboardFormSchema } from '@/schemas/billboardFormSchema'
import { productSchema } from '@/schemas/productSchema'
import { Billboard, Image, Product } from '@prisma/client'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface ProductFormProps {
  initialData: Product & { 
    images: Image[]
  } | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product"
  const description = initialData ? "Edit a Product" : "Add a new Product"
  const toastMessage = initialData ? "Product updated" : "Product created"
  const action = initialData ? "Save changes" : "Create"

  const router = useRouter();

  const handleDeleteProduct = () => {
    setLoading(true);
    axios.delete(`/api/${params.storeId}/products/${params.productId}`)
    .then(() => {
      router.push(`/admin/${params.storeId}/products`)
      router.refresh()
      toast("Product deleted")
    })
    .catch((error) => {
      toast.error("error occured", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const [images, setImages] = useState([initialData?.images]) 

  const [imageUrl, setImageUrl] = useState("")


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
                do you really want do delete this product?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="destructive" className='flex-1 gap-4' onClick={() => handleDeleteProduct()} disabled={isLoading}>
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
        onChange={(url) => setImages((prev) => [...prev, url])}
        disabled={isLoading}
        onRemove={() =>  setImageUrl("")}     
      />    
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-8">
        <Formik
          initialValues={
            initialData ? {
              ...initialData,
              price: parseFloat(String(initialData?.price))
            } : 
            {
              name: "",
              price: 0,
              amount: 0,
              categoryId: "",
              colorId: "",
              sizeId: "",
              isFeatured: false,
              isArchived: false          
            }
          }
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if(initialData) {
                const response = await axios.patch(`/api/${params.storeId}/products/${params.productId}`, {
                  name: values.name,
                  imageUrl
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/products`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/products`, {
                  name: values.name,
                  imageUrl
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/products`)
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
          validationSchema={productSchema}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <Form onSubmit={handleSubmit} 
              className='flex flex-col w-full h-full justify-center gap-5'>
              <div>
                <label>Name</label>
                <Input 
                  onChange={handleChange}
                  name='name'
                  value={values.name}
                  placeholder='Enter product name...'
                />
                {errors.name && !touched.name && <p className="text-red-500"> {errors.name}</p>}
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