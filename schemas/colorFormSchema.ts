import * as yup from "yup"

export const colorFormSchema = yup.object().shape({
  name: yup.string().required("Please fill here...").min(1), 
  value: yup.string().required("Please fill here...").min(4)
  .matches(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, "Please enter a valid color value"), 
})