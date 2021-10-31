import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText } from "@chakra-ui/react"
import { Field } from "formik"
import { FunctionComponent } from "react"

export const FieldRenderer: FunctionComponent<{ title: string, name: string, type?: string, placeholder?: string, helper?: string }> = ({ title, name, placeholder, type, helper }) => {
  return <Field name={name}>
    {
      ({ field, meta }: any) => (
        <FormControl isRequired id={field.id} isInvalid={meta.touched && meta.error}>
          <FormLabel htmlFor={field.id}>{title}</FormLabel>
          <Input {...field} type={type} placeholder={placeholder} />
          {meta.touched && meta.error && (
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          )}
          <FormHelperText>{helper}</FormHelperText>
        </FormControl>
      )
    }
  </Field >
}
