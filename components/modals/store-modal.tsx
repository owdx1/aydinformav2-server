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
              const response = await fetch(`/api/stores`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({name : values.name })
              })

              if(response.status === 200) {
                toast("successfully created the store!")
                return
              } 

              toast("something went wrong")

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
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                <div className="pt-6 space-x-2 flex justify-end">
                  <Button variant="outline" onClick={modalStore.onClose}> cancel </Button>
                  <Button type="submit"> create store </Button>
                </div>
              </Form>
            )}

          </Formik>
        </div>
    </CustomModal>
  )
};
