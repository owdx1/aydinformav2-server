"use client";
import * as z from "zod"
import { useStoreModal } from "@/hooks/use-store-modal";
import CustomModal from "@/components/ui/customModal"
import { Formik, Form } from "formik"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { adminFormSchema } from "@/schemas/formSchema";
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react";
import axios from "axios"
import { redirect } from "next/navigation";
import { Store } from "@prisma/client";



export const StoreModal = () => {
  const modalStore = useStoreModal();


  return (
    <CustomModal
      isOpen={modalStore.isOpen} 
      onClose={modalStore.onClose} 
      title="Annen"
      description="Anan"
      >
        <div>
          <Formik
            initialValues={
              {
                name: ""
              }
            }
            onSubmit={async (values) => {
              const response = await axios.post("/api/stores", {
                name: values.name
              })
            
              if(response.status === 200) {
                toast("successfully created the store!")
                window.location.assign(`/admin/${response.data.id}`)
            
              } else {
                toast("something went wrong")
              }
              modalStore.onClose()

            }}
            validationSchema={adminFormSchema}
            
          >
            {({values, handleChange, handleSubmit, isSubmitting, touched, errors}) => (
              <Form onSubmit={handleSubmit} className="p-4 gap-2 flex flex-col">
                <div>
                  <Label> name </Label>
                  <Input 
                    onChange={handleChange}
                    name="name"
                    value={values.name}
                    placeholder="E-commerce"
                  />
                  {errors.name && !touched.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                <div className="pt-6 space-x-2 flex justify-end">
                  <Button variant="outline" onClick={modalStore.onClose} disabled={isSubmitting}> cancel </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     create store 
                     {isSubmitting && <LoaderIcon className="animate-spin" />} 
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
    </CustomModal>
  )
};
