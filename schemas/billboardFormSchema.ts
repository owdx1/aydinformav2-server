import * as yup from "yup"

export const billboardFormSchema = yup.object().shape({
  label: yup.string().required("Please fill here...").min(1), 
})