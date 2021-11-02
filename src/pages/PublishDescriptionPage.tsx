import { Button, Heading, Stack, useToast } from "@chakra-ui/react"
import { Form, Formik, FormikProps } from 'formik';
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import * as Yup from 'yup';
import { IIDO } from "../abis/contracts";
import { FieldRenderer } from "../components/FieldRenderer";
import { AccountsContext } from "../contexts/AccountsContext";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { IPFSClient } from "../utils/ipfsClient";
import { getBytes32FromMultiash } from "ipfs-multihash-on-solidity";
import { IPFSIDO, PublishValues } from "../utils/types";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

const FormikFormComponent: FunctionComponent<FormikProps<PublishValues>> = ({ isSubmitting }) => {
  return <Form>
    <FieldRenderer
      title={"Title"}
      name={"title"}
      placeholder={"My Amazing Project"}
    />
    <FieldRenderer
      title={"Subtitle"}
      name={"subtitle"}
      placeholder={"An outstanding platform"}
    />
    <FieldRenderer
      title={"Description"}
      name={"description"}
    />
    <Button type={"submit"} isFullWidth marginTop={"32px !important"} disabled={isSubmitting}>Upload description</Button>
  </Form>
}

const DescriptionForm = () => {
  const { IDO, ipfs } = useContext(IDOContext)
  let { selectedSigner } = useContext(AccountsContext)
  let toast = useToast();
  return <Stack spacing={2}>
    <Heading>Publish</Heading>
    <Formik<IPFSIDO>
      initialValues={ipfs}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        const { path } = await IPFSClient.add(JSON.stringify(values))
        await IIDO(selectedSigner!.signer as any).setIPFS(IDO.id, getBytes32FromMultiash(path));
        toast({
          title: "IDO Description updated.",
          description: "Hooray 🥳! Your IDO description has been updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top"
        })
      }}
    >
      {FormikFormComponent}
    </Formik>
  </Stack>
}

export const PublishDescriptionPage = () => {
  let { id } = useParams<{ id: string }>();
  return <IDOContextProvider id={parseInt(id)}><DescriptionForm /></IDOContextProvider>;

}
