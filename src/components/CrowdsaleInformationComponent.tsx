import { Box } from "@chakra-ui/react"
import { Table, TableCaption, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table"
import { format } from 'date-fns'
import { useContext } from "react"
import { utils } from "ethers"
import { TokenContext } from "../contexts/TokenContext"
import { timestampToDate } from "../utils/utils"
import { IDOContext } from "../contexts/IDOContext"
import { NetworkContext } from "../contexts/NetworkContext"

export const CrowdsaleInformationComponent = () => {
  const { network: { reefscanUrl } } = useContext(NetworkContext)
  const { IDO: { params: { multiplier, token, baseAmount, open, maxAmountPerAddress, minimumLockedAmount } } } = useContext(IDOContext);
  const { symbol, name } = useContext(TokenContext);
  let mul = multiplier.multiplier / multiplier.divider;
  let reefBase = parseFloat(utils.formatEther(baseAmount))
  return <Box border={"1px"} borderColor={"app.400"} borderRadius={8}>
    <Table variant="simple">
      <TableCaption>This rules are immutable, all times are in local time</TableCaption>
      <Thead>
        <Tr>
          <Th>crowdsale Rule</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Token Address</Td>
          <Td isNumeric><a href={`${reefscanUrl}token/${token}`}>{token}</a></Td>
        </Tr>
        <Tr>
          <Td>Token Name</Td>
          <Td isNumeric>{name}</Td>
        </Tr>
        <Tr>
          <Td>Maximum Token Crowdsale</Td>
          <Td isNumeric>{(reefBase * mul).toFixed(0)} {symbol}</Td>
        </Tr>
        <Tr>
          <Td>Maximum REEF spent per investor</Td>
          <Td isNumeric>{utils.formatEther(maxAmountPerAddress)} REEF</Td>
        </Tr>
        <Tr>
          <Td>{symbol} multiplier</Td>
          <Td isNumeric>{mul.toFixed(2)}</Td>
        </Tr>
        <Tr>
          <Td>Raise goal</Td>
          <Td isNumeric>{reefBase} REEF - {reefBase * 0.0335} U$D</Td>
        </Tr>
        <Tr>
          <Td>Open range</Td>
          <Td isNumeric>{format(timestampToDate(open.start), "PPpp")} to {format(timestampToDate(open.end), "PPpp")}</Td>
        </Tr>
        <Tr>
          <Td>$SWD locked tokens required to join</Td>
          <Td isNumeric>{utils.formatEther(minimumLockedAmount)}</Td>
        </Tr>
      </Tbody>
    </Table>
  </Box>
}