import * as yup from "yup"

export const categoryFormSchema = yup.object().shape({
  name: yup.string().required("Please fill here...").min(1), 
  billboardId: yup.string().required().min(1)
})