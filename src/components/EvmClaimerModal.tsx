import { useContext, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/modal";
import { AccountsContext } from "../contexts/AccountsContext"

export const EvmClaimerModal = () => {
  const { selectedSigner, refreshAccounts } = useContext(AccountsContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (selectedSigner && !selectedSigner.isEvmClaimed) {
      onOpen();
    }
  }, [selectedSigner, onOpen])

  const onClaim = async () => {
    await selectedSigner!.signer.claimDefaultAccount();
    refreshAccounts();
    onClose();
  }
  return <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Claim your evm address for this account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>Your current account {selectedSigner?.name}: {selectedSigner?.address}, currently has the assigned evm address {selectedSigner?.evmAddress} but it hasn't been claimed.</Text>
        <Text>Please claim it for the correct behave of this DApp.</Text>
      </ModalBody>
      <ModalFooter>
        <Button mr={4} onClick={onClaim}>Claim</Button><Button onClick={onClose} variant={"outline"}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}