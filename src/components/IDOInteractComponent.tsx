
import { FunctionComponent, useCallback, useContext, useState } from "react";
import { utils, BigNumber } from "ethers";
import { formatDistanceStrict } from "date-fns";
import { Stat, StatLabel, StatNumber, Box, Stack, InputGroup, InputLeftAddon, Input, Button, useBoolean } from "@chakra-ui/react"
import { IDOInteractContext } from "../contexts/IDOInteractContext";
import { TokenContext } from "../contexts/TokenContext";
import { useIntervalUpdate } from "../utils/hooks";
import { timestampToDate } from "../utils/utils";
import { IDOStatus } from "../utils/types";
import { IDOContext } from "../contexts/IDOContext";

const { parseEther, formatEther } = utils;

const useWeiConversion = (value: BigNumber, setWei: React.Dispatch<React.SetStateAction<BigNumber>>, multiplier: number, divisor: number) => {
  const [to, setTo] = useState<BigNumber>(value.mul(multiplier).div(divisor));
  const setFromString = useCallback((value: string) => {
    let wei = parseEther(value);
    setWei(wei);
    setTo(wei.mul(multiplier).div(divisor))
  }, [setWei, divisor, multiplier])
  const setToString = useCallback((value: string) => {
    let wei = parseEther(value);
    setTo(wei);
    setWei(wei.div(multiplier).mul(divisor))
  }, [setWei, divisor, multiplier])
  return [formatEther(value), formatEther(to), setFromString, setToString] as const
}

const ActionButtonComponent: FunctionComponent<{ action: () => any, actionName: string }> = ({ action, actionName }) => {
  const { IDO: { params: { open: { start } } } } = useContext(IDOContext);
  const { status } = useContext(IDOInteractContext);
  const disabled = status === IDOStatus.Pending || status === IDOStatus.Ended;
  let text = "";
  if (status === IDOStatus.Pending)
    text = `Opens in ${formatDistanceStrict(Date.now(), timestampToDate(start))}`;
  if (status === IDOStatus.Open)
    text = actionName;
  if (status === IDOStatus.Ended)
    text = "IDO has already ended";
  useIntervalUpdate();
  return <Button disabled={disabled} onClick={action}>{text}</Button>
}

const BuyConversorComponent: FunctionComponent = () => {
  const { IDO: { params: { multiplier } } } = useContext(IDOContext);
  const { wei, setWei } = useContext(IDOInteractContext);
  const { symbol } = useContext(TokenContext);
  const [from, to, setFrom, setTo] = useWeiConversion(wei, setWei, multiplier.multiplier, multiplier.divider)
  return <Stack direction={"row"} alignItems={"center"}>
    <InputGroup>
      <InputLeftAddon children={"REEF"} />
      <Input
        value={from}
        onChange={e => setFrom(e.target.value)}
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
  const { IDO: { params: { multiplier } } } = useContext(IDOContext);
  const { status, onBuy, onWithdraw, balance, paid, onGetPayout } = useContext(IDOInteractContext);
  const { symbol } = useContext(TokenContext);
  const [buying, { on: setBuying, off: setWithdrawing }] = useBoolean(true);

  if (status !== IDOStatus.Ended)
    return <Box borderRadius="md" borderColor={"app.400"} borderWidth={"1px"} w={480} alignSelf={"flex-start"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"} flexShrink={0}>
      <Stack spacing={2} >
        <Stack direction={"row"}>
          <Button width={"50%"} variant={buying ? "outline" : "ghost"} onClick={setBuying}>Buy</Button>
          <Button width={"50%"} variant={buying ? "ghost" : "outline"} onClick={setWithdrawing}>Withdraw</Button>
        </Stack>
        <Stack direction={"row"}>
          <Stat>
            <StatLabel>Spended</StatLabel>
            <StatNumber>{formatEther(balance)} REEF</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Bought</StatLabel>
            <StatNumber>{formatEther(balance.mul(multiplier.multiplier).div(multiplier.divider))} {symbol}</StatNumber>
          </Stat>
        </Stack>
        <BuyConversorComponent />
        <ActionButtonComponent
          action={buying ? onBuy : onWithdraw}
          actionName={buying ? "Buy" : "Withdraw"}
        />
      </Stack>
    </Box >

  const participated = balance.gt(0);
  return <Box borderRadius="md" borderColor={"app.400"} borderWidth={"1px"} w={480} alignSelf={"flex-start"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"} flexShrink={0}>
    <Stack spacing={2} >
      <Stack direction={"row"}>
        <Stat>
          <StatLabel>Bought</StatLabel>
          <StatNumber>{formatEther(balance.mul(multiplier.multiplier).div(multiplier.divider))} {symbol}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Paid</StatLabel>
          <StatNumber>{participated ? (paid ? "Yes" : "No") : "Didn't participate"}</StatNumber>
        </Stat>
      </Stack>
      <Button disabled={!participated || paid} onClick={onGetPayout}>{participated ? (paid ? "Already paid" : "Get Payout") : "Didn't participate"}</Button>
    </Stack>
  </Box >
}