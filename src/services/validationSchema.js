import * as yup from 'yup'

export const addApartmentValidator = yup.object().shape({
  // type: yup.string().required('Apartment type is Required'),
  bedroom: yup
    .number()
    .min(1, ({ min }) => `Bedroom number must be at least ${min}`)
    .typeError('Number only')
    .required('Bedroom is required'),
  rentPrice: yup
    .number()
    .min(1, ({ min }) => `Rent price must be at least ${min}`)
    .typeError('Number only')
    .required('Rent price is required'),
  reporter: yup.string().required('Reporter is Required'),
})
export const addCategoryValidator = yup.object().shape({
  name: yup.string().required('Category name is Required'),
})
