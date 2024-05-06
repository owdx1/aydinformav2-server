import * as yup from "yup"

export const productSchema = yup.object().shape({
  name: yup.string().required("Please fill here...").min(1),
  categoryId: yup.string().required().min(1),
  colorId: yup.string().required().min(1),
  sizeId: yup.string().required().min(1),
  isFeatured: yup.boolean().required(),
  isArchived: yup.boolean().required(),
  amount: yup.number().required().min(0),
  price: yup.number().required().min(0)
})

