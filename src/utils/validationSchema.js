import * as yup from 'yup'

export const addApartmentValidator = yup.object().shape({
  createdAt: yup
    .string()
    .required('Created at is required')
    .matches(
      /(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-([12]\d{3})/,
      'Created time must be in DD-MM-YYYY format'
    ),
  bedroom: yup
    .number()
    .min(1, ({ min }) => `Bedroom number must be at least ${min}`)
    .max(99, ({ max }) => `Bedroom number can not be more than ${max}`)
    .typeError('Number only')
    .required('Bedroom is required'),
  rentPrice: yup
    .number()
    .min(1, ({ min }) => `Rent price must be at least ${min}`)
    .typeError('Number only')
    .required('Rent price is required'),
  reporter: yup.string().required('Reporter is required'),
})

export const addCategoryValidator = yup.object().shape({
  name: yup.string().required('Category name is required'),
})

export const loginValidator = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .matches(/^[a-z0-9_-]{3,16}$/, 'Invalid username'),
  password: yup.string().required('Password is required'),
  // .matches(
  //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  //   'Invalid password'
  // ),
})
