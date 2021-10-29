import { Box } from "@chakra-ui/react"
import { Table, TableCaption, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table"
import { format } from 'date-fns'
import { useContext } from "react"
import { utils } from "ethers"
import { IDOContext } from "../contexts/IDOContext"
import { TokenContext } from "../contexts/TokenContext"
import { timestampToDate } from "../utils/utils"

export const CrowdsaleInformationComponent = () => {
  const { information } = useContext(IDOContext);
  const { symbol, name } = useContext(TokenContext);
  if (!information) return null;
  let multiplier = information.multiplier / information.divider;
  let reefBase = parseFloat(utils.formatEther(information.maxSoldBaseAmount))
  return <Box border={"1px"} borderColor={"app.400"} borderRadius={8}>
    <Table variant="simple">
      <TableCaption>This rules are immutable</TableCaption>
      <Thead>
        <Tr>
          <Th>crowdsale Rule</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Token Address</Td>
          <Td isNumeric><a href={`https://testnet.reefscan.com/token/${information.tokenAddress}`}>{information.tokenAddress}</a></Td>
        </Tr>
        <Tr>
          <Td>Token Name</Td>
          <Td isNumeric>{name}</Td>
        </Tr>
        <Tr>
          <Td>Maximum Token Crowdsale</Td>
          <Td isNumeric>{(reefBase * multiplier).toFixed(0)} {symbol}</Td>
        </Tr>
        <Tr>
          <Td>Maximum per investor</Td>
          <Td isNumeric>1,000.00 {symbol}</Td>
        </Tr>
        <Tr>
          <Td>KRF by each REEF multiplier</Td>
          <Td isNumeric>{multiplier.toFixed(2)}</Td>
        </Tr>
        <Tr>
          <Td>Crowdsale total supply percentage</Td>
          <Td isNumeric>75.23%</Td>
        </Tr>
        <Tr>
          <Td>Estimated REEF for Stakeholders</Td>
          <Td isNumeric>{reefBase} REEF - {reefBase * 0.03} U$D</Td>
        </Tr>
        <Tr>
          <Td>Open range</Td>
          <Td isNumeric>{format(timestampToDate(information.startingTimestamp), "PPpp")} to {format(timestampToDate(information.endTimestamp), "PPpp")}, local time</Td>
        </Tr>
        <Tr>
          <Td>Is refundable?</Td>
          <Td isNumeric>Yes</Td>
        </Tr>
        <Tr>
          <Td>Refundable percentage</Td>
          <Td isNumeric>80%</Td>
        </Tr>
        <Tr>
          <Td>Refund range</Td>
          <Td isNumeric>{format(timestampToDate(information.startingTimestamp), "PPpp")} to {format(timestampToDate(information.endTimestamp), "PPpp")}, local time</Td>
        </Tr>
      </Tbody>
    </Table>
  </Box>
}