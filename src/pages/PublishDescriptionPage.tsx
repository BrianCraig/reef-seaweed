import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Stack, Textarea, useToast } from "@chakra-ui/react"
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { FunctionComponent, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from 'yup';
import { IIDO } from "../abis/contracts";
import { FieldRenderer } from "../components/FieldRenderer";
import { AccountsContext } from "../contexts/AccountsContext";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { IPFSClient } from "../utils/ipfsClient";
import { getBytes32FromMultiash } from "ipfs-multihash-on-solidity";
import { IPFSIDO, PublishValues } from "../utils/types";
import { NetworkContext } from "../contexts/NetworkContext";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

interface PublishFilesInterface {
  logo: string,
  background: string,
  setLogo: React.Dispatch<React.SetStateAction<string>>,
  setBackground: React.Dispatch<React.SetStateAction<string>>
}

export const PublishFilesContext = React.createContext<PublishFilesInterface>({
  logo: "",
  background: "",
  setLogo: () => { },
  setBackground: () => { }
});

export const PublishFilesContextProvider: React.FunctionComponent = ({ children }) => {
  const { ipfs } = useContext(IDOContext);
  let [logo, setLogo] = useState<string>(ipfs.logo)
  let [background, setBackground] = useState<string>(ipfs.background)
  return <PublishFilesContext.Provider value={{
    logo,
    background,
    setLogo,
    setBackground
  }} children={children} />
}

const ImageRenderer: FunctionComponent<{ title: string, helper: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>> }> = ({ title, helper, value, setValue }) => {
  const onChange = async (e: any) => {
    const file = e.target.files[0]
    try {
      const { path } = await IPFSClient.add(file)
      setValue(path);
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  return <FormControl>
    <FormLabel >{title}</FormLabel>
    <Input onChange={onChange} type={"file"} />
    <FormHelperText>{helper}</FormHelperText>
  </FormControl>

}

const TextAreaRenderer: FunctionComponent<{ title: string, name: string, type?: string, placeholder?: string, helper?: string }> = ({ title, name, placeholder, type, helper }) => {
  return <Field name={name}>
    {
      ({ field, meta }: any) => (
        <FormControl isRequired id={field.id} isInvalid={meta.touched && meta.error}>
          <FormLabel htmlFor={field.id}>{title}</FormLabel>
          <Textarea {...field} type={type} placeholder={placeholder} />
          {meta.touched && meta.error && (
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          )}
          <FormHelperText>{helper}</FormHelperText>
        </FormControl>
      )
    }
  </Field >
}


const FormikFormComponent: FunctionComponent<FormikProps<PublishValues>> = ({ isSubmitting }) => {
  let { signer } = useContext(AccountsContext)
  const { background, logo, setLogo, setBackground } = useContext(PublishFilesContext)
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
    <TextAreaRenderer
      title={"Description"}
      name={"description"}
    />
    <ImageRenderer
      title={"Logo"}
      helper={"1:1 ratio 128px max"}
      value={logo}
      setValue={setLogo}
    />
    <ImageRenderer
      title={"Background image"}
      helper={"960 x 540 background image"}
      value={background}
      setValue={setBackground}
    />
    960 x 540
    <Button type={"submit"} isFullWidth marginTop={"32px !important"} disabled={isSubmitting || !signer}>Upload description</Button>
  </Form>
}

const DescriptionForm = () => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { IDO, ipfs } = useContext(IDOContext)
  let { signer } = useContext(AccountsContext)
  const { background, logo } = useContext(PublishFilesContext)
  let toast = useToast();
  return <Stack spacing={2}>
    <Heading>Update description</Heading>
    <Formik<IPFSIDO>
      initialValues={ipfs}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        const { path } = await IPFSClient.add(JSON.stringify({ ...values, logo, background }))
        await IIDO(SeaweedAddress, signer!).setIPFS(IDO.id, getBytes32FromMultiash(path));
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
  return <IDOContextProvider id={parseInt(id)}><PublishFilesContextProvider><DescriptionForm /></PublishFilesContextProvider></IDOContextProvider>;

}
