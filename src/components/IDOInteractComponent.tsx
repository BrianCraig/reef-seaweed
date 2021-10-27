
import { FunctionComponent, useCallback, useContext, useState } from "react";
import { utils, BigNumber } from "ethers";
import { formatDistanceStrict } from "date-fns";
import { Stat, StatLabel, StatNumber, Box, Stack, InputGroup, InputLeftAddon, Input, Button } from "@chakra-ui/react"
import { IDOContext, IDOStatus, InformationInterface } from "../contexts/IDOContext";
import { TokenContext } from "../contexts/TokenContext";
import { useToggle, useIntervalUpdate } from "../utils/hooks";
import { timestampToDate } from "../utils/utils";

const { parseEther, formatEther } = utils;

const useWeiConversion = (defaultValue: BigNumber, multiplier: BigNumber, divisor: BigNumber) => {
  const [from, setFrom] = useState<BigNumber>(defaultValue);
  const [to, setTo] = useState<BigNumber>(defaultValue.mul(multiplier).div(divisor));
  const setFromString = useCallback((value: string) => {
    let wei = parseEther(value);
    setFrom(wei);
    setTo(wei.mul(multiplier).div(divisor))
  }, [divisor, multiplier])
  const setToString = useCallback((value: string) => {
    let wei = parseEther(value);
    setTo(wei);
    setFrom(wei.div(multiplier).mul(divisor))
  }, [divisor, multiplier])
  return [from, formatEther(from), formatEther(to), setFromString, setToString] as const
}

const BuyingButtonComponent: FunctionComponent<{ info: InformationInterface, onBuy: () => any, status: IDOStatus }> = ({ info, onBuy, status }) => {
  const disabled = status === IDOStatus.Pending || status === IDOStatus.Ended;
  let text = "";
  if (status === IDOStatus.Pending)
    text = `Opens in ${formatDistanceStrict(Date.now(), timestampToDate(info.startingTimestamp))}`;
  if (status === IDOStatus.Open)
    text = "Buy";
  if (status === IDOStatus.Ended)
    text = "IDO has already ended";
  useIntervalUpdate();
  return <Button bg={"reef.lighter"} disabled={disabled}>{text}</Button>
}

const BuyConversorComponent: FunctionComponent<{ info: InformationInterface, symbol: string }> = ({ info, symbol }) => {
  const [wei, from, to, setFrom, setTo] = useWeiConversion(BigNumber.from(0), info.multiplier, info.divider)
  return <Stack direction={"row"} alignItems={"center"}>
    <InputGroup>
      <InputLeftAddon children={"REEF"} />
      <Input
        value={from}
        onChange={ev => setFrom(ev.target.value)}
        placeholder={"REEF"}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon children={symbol} />
      <Input
        value={to}
        onChange={ev => setTo(ev.target.value)}
        placeholder={symbol}
      />
    </InputGroup>
  </Stack>
}

export const IDOInteractComponent = () => {
  const { information, status } = useContext(IDOContext);
  const { symbol, name } = useContext(TokenContext);
  const [buying, toggleBuying, setBuying, setWithdrawing] = useToggle(true);

  if (information === undefined || status === undefined) return null;
  return <Box borderRadius="md" borderColor={"reef.dark"} borderWidth={"2px"} w={480} alignSelf={"center"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"}>
    <Stack spacing={2} >
      <Stack direction={"row"}>
        <Button bg={buying ? "reef.light" : "reef.lighter"} width={"50%"} onClick={setBuying}>Buy</Button>
        <Button bg={buying ? "reef.lighter" : "reef.light"} width={"50%"} onClick={setWithdrawing}>Withdraw</Button>
      </Stack>
      <Stat alignSelf={"center"}>
        <StatLabel>Bought</StatLabel>
        <StatNumber>0 {symbol}</StatNumber>
      </Stat>
      <BuyConversorComponent info={information} symbol={symbol} />
      <BuyingButtonComponent
        info={information}
        onBuy={() => { }}
        status={status}
      />
    </Stack>
  </Box >
}