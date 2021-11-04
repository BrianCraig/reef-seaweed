import { Box } from "@chakra-ui/react"
import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table"
import { format } from 'date-fns'
import { useContext } from "react"
import { BigNumber, utils } from "ethers"
import { addressFormat, timestampToDate } from "../utils/utils"
import { IDOContext } from "../contexts/IDOContext"

export const VestingInformationComponent = () => {
  const { vesting } = useContext(IDOContext);
  if (vesting === undefined) return null;
  return <Box border={"1px"} borderColor={"app.400"} borderRadius={8}>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Beneficiary</Th>
          <Th>Tokens</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {vesting.filter(vest => !vest.amount.eq(BigNumber.from(0))).map(({ beneficiary, amount, timestamp }, index) =>
          <Tr key={index}>
            <Td>{addressFormat(beneficiary)}</Td>
            <Td>{utils.formatEther(amount)}</Td>
            <Td>{format(timestampToDate(timestamp), "PPpp")}</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  </Box>
}