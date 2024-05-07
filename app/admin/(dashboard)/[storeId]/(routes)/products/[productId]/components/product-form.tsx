"use client"

import { Heading } from '@/components/heading'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { billboardFormSchema } from '@/schemas/billboardFormSchema'
import { productSchema } from '@/schemas/productSchema'
import { Category, Color, Product, Size } from '@prisma/client'
import axios from 'axios'
import { FieldArray, Form, Formik } from 'formik'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface ProductFormProps {
  initialData: Product | null
  colors: Color[]
  sizes: Size[]
  categories: Category[]
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, colors, sizes, categories }) => {

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


  const params = useParams();
  console.log(params)

  const [images, setImages] = useState(initialData?.images || [])

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
              isArchived: false,      
            }
          }
          onSubmit={async (values) => {
            try {
              setLoading(true)
              if(initialData) {
                const response = await axios.patch(`/api/${params.storeId}/products/${params.productId}`, {
                  ...values,
                  images
                })
                if(response.status === 200) {                 
                  router.push(`/admin/${params.storeId}/products`)
                  router.refresh()
                }
              } else {
                const response = await axios.post(`/api/${params.storeId}/products`, {
                  ...values,
                  images
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
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting, setValues}) => (
            <Form onSubmit={handleSubmit} 
              className='flex flex-col w-full h-full justify-center gap-5'
            >           
              <ImageUpload
                value={images}
                onChange={(url) => {setImages((prev) => [...prev, url])}}
                onRemove={(url) => {
                  const formattedImages = images.filter((imgUrl) => imgUrl !== url)
                  setImages(formattedImages)
                }}
              />
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
              <div>
                <label>Price</label>
                <Input 
                  onChange={handleChange}
                  name='price'
                  value={values.price}
                  placeholder='Enter a price..'
                  type="number"
                />
                {errors.price && !touched.price && <p className="text-red-500"> {errors.price}</p>}
              </div>
              <div>
                <label>Amount</label>
                <Input 
                  onChange={handleChange}
                  name='amount'
                  value={values.amount}
                  placeholder='how many are there for this item?'
                  type="number"
                />
                {errors.amount && !touched.amount && <p className="text-red-500"> {errors.amount}</p>}
              </div>
              <div>
                <label>Category</label>
                <Select 
                  disabled={isLoading}
                  onValueChange={(value) => handleChange({target: {name:"categoryId", value}})}
                  name='categoryId'
                  value={values.categoryId}
                  defaultValue={values.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category..."/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && !touched.categoryId && <p className="text-red-500"> {errors.categoryId}</p>}
              </div>
              <div>
                <label>Size</label>
                <Select 
                  disabled={isLoading}
                  onValueChange={(value) => handleChange({target: {name:"sizeId", value}})}
                  name='sizeId'
                  value={values.sizeId}
                  defaultValue={values.sizeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size..."/>
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sizeId && !touched.sizeId && <p className="text-red-500"> {errors.sizeId}</p>}
              </div>
              <div>
                <label>Color</label>
                <Select 
                  disabled={isLoading}
                  onValueChange={(value) => handleChange({target: {name:"colorId", value}})}
                  name='colorId'
                  value={values.colorId}
                  defaultValue={values.colorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color..."/>
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((item) => (
                      <SelectItem key={item.id} value={item.id} className='flex items-center gap-2'>
                        {item.name}
                        <div  className='w-6 h-6 border rounded-md' style={{ backgroundColor: item.value }}/>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.colorId && !touched.colorId && <p className="text-red-500"> {errors.colorId}</p>}
              </div>
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Input 
                  name='isArchived'
                  checked={values.isArchived}
                  onChange={handleChange}
                  type="checkbox"              
                />
                <div>
                  <label> This product not appear anywhere </label>
                </div>
                {errors.isArchived && !touched.isArchived && <p className="text-red-500"> {errors.isArchived}</p>}
              </div>
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Input 
                  name='isFeatured'
                  checked={values.isFeatured}
                  onChange={handleChange}
                  type="checkbox"              
                />
                <div>
                  <label> This product will appear in homepage </label>
                </div>
                {errors.isFeatured && !touched.isFeatured && <p className="text-red-500"> {errors.isFeatured}</p>}
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