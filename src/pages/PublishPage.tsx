import { Button, Heading, Stack, useToast } from "@chakra-ui/react"
import { Form, Formik } from 'formik';
import { useContext, useState } from "react";
import * as Yup from 'yup';
import { IIDO, MAX_VESTING_OCURRENCES } from "../abis/contracts";
import { FieldRenderer } from "../components/FieldRenderer";
import { VestingFormComponent } from "../components/VestingFormComponent";
import { AccountsContext } from "../contexts/AccountsContext";
import { NetworkContext } from "../contexts/NetworkContext";
import { ContractBasicIDOAction } from "../utils/txFactorys";
import { PublishValues, VestingForm } from "../utils/types";

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
  reefMaxPerAddress: 100,
  swdWhitelisting: 0,
  start: "",
  end: ""
}

export const PublishPage = () => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const [vesting, setVesting] = useState<VestingForm[]>([])
  const toast = useToast();
  let { signer } = useContext(AccountsContext)
  const addVesting = () => {
    if (vesting.filter(el => !!el).length >= MAX_VESTING_OCURRENCES) return;
    setVesting([...vesting, { beneficiary: "", amount: 0, timestamp: "" }])
  }
  return <Stack spacing={2}>
    <Heading>Publish</Heading>
    <Formik<PublishValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        await ContractBasicIDOAction(IIDO(SeaweedAddress, signer!), values, vesting.filter(el => !!el));
        toast({
          title: "IDO published.",
          description: "Hooray 🥳! Your IDO has been published successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top"
        })
      }}
    >
      {({ isSubmitting }) => {
        return <Form>
          <Stack spacing={4}>
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
              title={"Max REEF spended per address"}
              name={"reefMaxPerAddress"}
              type={"number"}
              placeholder={"100"}
            />
            <FieldRenderer
              title={"$SWD locked amount for joining"}
              name={"swdWhitelisting"}
              type={"number"}
              helper={"0 means anyone can buy without locking $SWD"}
            />
            <FieldRenderer
              title={"Crowdsale start"}
              name={"start"}
              type={"datetime-local"}
              helper={"All times are in local time"}
            />
            <FieldRenderer
              title={"Crowdsale end"}
              name={"end"}
              type={"datetime-local"}
              helper={"All times are in local time"}
            />
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Heading size={"lg"}>Vesting</Heading><Button onClick={addVesting}>Add</Button>
            </Stack>
            {vesting.map((e, index) => e === null ? null : <VestingFormComponent key={index} id={index} setVesting={setVesting} />)}
            <Button type={"submit"} isFullWidth marginTop={"32px !important"} disabled={isSubmitting || (signer === undefined)}>Publish Contract</Button>
          </Stack>
        </Form>
      }}
    </Formik>
  </Stack>
}