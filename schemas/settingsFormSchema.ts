import * as yup from "yup"

export const settingsFormSchema = yup.object().shape({
  name: yup.string().required("Please fill here...").min(1),
  
})