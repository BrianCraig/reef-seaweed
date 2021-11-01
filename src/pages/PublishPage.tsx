import { Button, Heading, Stack, useToast } from "@chakra-ui/react"
import { Form, Formik, FormikProps } from 'formik';
import { FunctionComponent, useContext } from "react";
import * as Yup from 'yup';
import { IIDO, SeaweedIDO } from "../abis/contracts";
import { FieldRenderer } from "../components/FieldRenderer";
import { AccountsContext } from "../contexts/AccountsContext";
import { ContractsContext } from "../contexts/ContractsContext";
import { ContractBasicIDOAction } from "../utils/txFactorys";
import { PublishValues } from "../utils/types";

const validationSchema = Yup.object().shape({
  tokenName: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

const initialValues: PublishValues = {
  tokenName: "",
  tokenSymbol: "",
  reefAmount: 100000,
  reefMultiplier: 5,
  start: "",
  end: ""
}

const FormikFormComponent: FunctionComponent<FormikProps<PublishValues>> = ({ isSubmitting }) => {
  return <Form>
    <FieldRenderer
      title={"Token name"}
      name={"tokenName"}
      placeholder={"My Token X"}
    />
    <FieldRenderer
      title={"Token symbol"}
      name={"tokenSymbol"}
      placeholder={"MTX"}
    />
    <FieldRenderer
      title={"Crowdsale REEF"}
      name={"reefAmount"}
      type={"number"}
      placeholder={"100000"}
      helper={"This is the max amount in REEF the contract owner will get"}
    />
    <FieldRenderer
      title={"Tokens per REEF"}
      name={"reefMultiplier"}
      type={"number"}
      placeholder={"5"}
      helper={"This means how many tokens will be mint per REEF"}
    />
    <FieldRenderer
      title={"Crowdsale start"}
      name={"start"}
      type={"datetime-local"}
      helper={"All times are in local time"}
    />
    <FieldRenderer
      title={"Crowdsale start"}
      name={"end"}
      type={"datetime-local"}
      helper={"All times are in local time"}
    />
    <Button type={"submit"} isFullWidth marginTop={"32px !important"} disabled={isSubmitting}>Publish Contract</Button>
  </Form>
}

export const PublishPage = () => {
  const toast = useToast();
  let { selectedSigner } = useContext(AccountsContext)
  let { setIDOList } = useContext(ContractsContext)
  return <Stack spacing={2}>
    <Heading>Publish</Heading>
    <Formik<PublishValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        let address = await ContractBasicIDOAction(IIDO(selectedSigner!.signer as any), values);
        toast({
          title: "IDO Contract deployed.",
          description: "Hooray 🥳! Your Crowdsale Contract has been deployed successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top"
        })
        setIDOList((or) => [...or, address]);
      }}
    >
      {FormikFormComponent}
    </Formik>
  </Stack>
}