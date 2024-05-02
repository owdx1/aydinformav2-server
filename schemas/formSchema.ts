import * as yup from "yup"


export const adminFormSchema = yup.object().shape({
  name: yup.string().required().min(1)

})