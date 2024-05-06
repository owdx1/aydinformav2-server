import * as yup from "yup"

export const sizeFormSchema = yup.object().shape({
  name: yup.string().required("Please fill here...").min(1), 
  value: yup.string().required("Please fill here...").min(1), 
})