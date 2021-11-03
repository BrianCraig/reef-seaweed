import { Button, Input, Stack } from "@chakra-ui/react";
import { Field, Formik, FormikProps } from "formik";
import React, { Dispatch, FunctionComponent, SetStateAction, useCallback, useRef } from "react";
import Box from "ui-box";
import { VestingForm } from "../utils/types";

const initialValues: VestingForm = {
  beneficiary: "",
  amount: 0,
  timestamp: ""
}


export const VestingFormComponent: FunctionComponent<{ id: number, setVesting: Dispatch<SetStateAction<VestingForm[]>> }> = ({ id, setVesting }) => {
  return <Formik<VestingForm>
    initialValues={initialValues}
    onSubmit={() => { }}
    validateOnBlur
    validate={(values) => {
      setVesting((ori) => Object.assign([], ori, { [id]: values }))
      return {};
    }}
  >{({ values }) => {
    return <Stack direction={"row"}>
      <Field name={"beneficiary"}>
        {
          ({ field }: any) => (
            <Input {...field} placeholder={"Beneficiary"} width={300} />
          )
        }
      </Field >
      <Field name={"amount"}>
        {
          ({ field }: any) => (
            <Input {...field} placeholder={"Amount"} width={300} />
          )
        }
      </Field >
      <Field name={"timestamp"}>
        {
          ({ field }: any) => (
            <Input {...field} type={"datetime-local"} width={300} />
          )
        }
      </Field >
      <Box flexGrow={1} />
      <Button>Remove</Button>
    </Stack>
  }
    }
  </Formik>


}