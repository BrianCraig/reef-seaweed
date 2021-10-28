import { Box } from "@chakra-ui/react"
import { Table, TableCaption, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table"
import { format } from 'date-fns'

export const CrowdsaleInformationComponent = () => {
  return <Box border={"1px"} borderColor={"app.100"} borderRadius={8}>
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
          <Td isNumeric><a href="https://testnet.reefscan.com/token/0xBC1771A363769edb78034F779360254758E872Da">0xBC1771A363769edb78034F779360254758E872Da</a></Td>
        </Tr>
        <Tr>
          <Td>Token Name</Td>
          <Td isNumeric>Kool Real Feel</Td>
        </Tr>
        <Tr>
          <Td>Maximum Token Crowdsale</Td>
          <Td isNumeric>300,000.00 KRF</Td>
        </Tr>
        <Tr>
          <Td>Maximum per investor</Td>
          <Td isNumeric>1,000.00 KRF</Td>
        </Tr>
        <Tr>
          <Td>KRF by each REEF multiplier</Td>
          <Td isNumeric>15.00</Td>
        </Tr>
        <Tr>
          <Td>Crowdsale total supply percentage</Td>
          <Td isNumeric>75.23%</Td>
        </Tr>
        <Tr>
          <Td>Estimated REEF for Stakeholders</Td>
          <Td isNumeric>20,000.00 REEF - 640.34 U$D</Td>
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
          <Td isNumeric>{format(new Date(), "PPpp")} to {format(new Date(), "PPpp")}, local time</Td>
        </Tr>
      </Tbody>
    </Table>
  </Box>
}