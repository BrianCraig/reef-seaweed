
import { FunctionComponent, useCallback, useContext, useState } from "react";
import { utils, BigNumber } from "ethers";
import { formatDistanceStrict } from "date-fns";
import { Stat, StatLabel, StatNumber, Box, Stack, InputGroup, InputLeftAddon, Input, Button } from "@chakra-ui/react"
import { IDOContext, IDOStatus, InformationInterface } from "../contexts/IDOContext";
import { TokenContext } from "../contexts/TokenContext";
import { useToggle, useIntervalUpdate } from "../utils/hooks";
import { timestampToDate } from "../utils/utils";

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

const ActionButtonComponent: FunctionComponent<{ info: InformationInterface, action: () => any, actionName: string, status: IDOStatus }> = ({ info, action, actionName, status }) => {
  const disabled = status === IDOStatus.Pending || status === IDOStatus.Ended;
  let text = "";
  if (status === IDOStatus.Pending)
    text = `Opens in ${formatDistanceStrict(Date.now(), timestampToDate(info.startingTimestamp))}`;
  if (status === IDOStatus.Open)
    text = actionName;
  if (status === IDOStatus.Ended)
    text = "IDO has already ended";
  useIntervalUpdate();
  return <Button disabled={disabled} onClick={action}>{text}</Button>
}

const BuyConversorComponent: FunctionComponent = () => {
  const { information, wei, setWei } = useContext(IDOContext);
  const { symbol } = useContext(TokenContext);
  const [from, to, setFrom, setTo] = useWeiConversion(wei, setWei, information!.multiplier, information!.divider)
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
  const { information, status, onBuy, onWithdraw, balance, paid, onGetPayout } = useContext(IDOContext);
  const { symbol } = useContext(TokenContext);
  const [buying, setBuying, setWithdrawing] = useToggle(true);

  if (information === undefined || status === undefined) return <Box width={480} flexShrink={0} />;
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
            <StatNumber>{formatEther(balance.mul(information.multiplier).div(information.divider))} {symbol}</StatNumber>
          </Stat>
        </Stack>
        <BuyConversorComponent />
        <ActionButtonComponent
          info={information}
          action={buying ? onBuy : onWithdraw}
          actionName={buying ? "Buy" : "Withdraw"}
          status={status}
        />
      </Stack>
    </Box >

  const participated = balance.gt(0);
  return <Box borderRadius="md" borderColor={"app.400"} borderWidth={"1px"} w={480} alignSelf={"flex-start"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"} flexShrink={0}>
    <Stack spacing={2} >
      <Stack direction={"row"}>
        <Stat>
          <StatLabel>Bought</StatLabel>
          <StatNumber>{formatEther(balance.mul(information.multiplier).div(information.divider))} {symbol}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Paid</StatLabel>
          <StatNumber>{participated ? (paid ? "Yes" : "No") : "Didn't participate"}</StatNumber>
        </Stat>
      </Stack>
      <Button disabled={!participated && !paid} onClick={onGetPayout}>{participated ? (paid ? "Already paid" : "Get Payout") : "Didn't participate"}</Button>
    </Stack>
  </Box >
}