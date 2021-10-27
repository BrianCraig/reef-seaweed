
import { useContext } from "react";
import { Stat, StatLabel, StatNumber, Box, Stack, InputGroup, InputLeftAddon, Input, Button } from "@chakra-ui/react"
import { IDOContext } from "../contexts/IDOContext";
import { TokenContext } from "../contexts/TokenContext";

export const IDOInteractComponent = () => {
  const { information, status } = useContext(IDOContext);
  const { symbol, name } = useContext(TokenContext);
  return <Box borderRadius="md" borderColor={"reef.dark"} borderWidth={"2px"} w={480} alignSelf={"center"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"}>
    <Stack spacing={2} >
      <Stack direction={"row"}>
        <Button bg={"reef.lighter"} width={"50%"} selected>Buy</Button>
        <Button bg={"reef.lighter"} width={"50%"} disabled>Withdraw</Button>
      </Stack>
      <Stat alignSelf={"center"}>
        <StatLabel>Bought</StatLabel>
        <StatNumber>0 {symbol}</StatNumber>
      </Stat>
      <Stack direction={"row"} alignItems={"center"}>
        <InputGroup>
          <InputLeftAddon children={"REEF"} />
          <Input
            type={"number"}
            placeholder={"REEF"}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children={symbol} />
          <Input
            type={"number"}
            placeholder={symbol}
          />
        </InputGroup>
      </Stack>
      <Button bg={"reef.lighter"}>Buy</Button>
      <Button bg={"reef.lighter"} disabled>Opens in 53s</Button>
    </Stack>
  </Box >
}