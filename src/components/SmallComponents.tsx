import React, { useContext } from "react"
import { Text } from 'evergreen-ui'
import { SignerStatusContext } from "../contexts/SignerStatusContext"

export const ActualReefComponent = () => {
  const { status } = useContext(SignerStatusContext)
  if (status === undefined) return null;
  return <Text>{status.freeBalance.toHuman()}</Text>
}