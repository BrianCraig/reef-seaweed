import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export const MenuComponent = () => {
  let { push } = useHistory();
  return <>
    <Button variant="outline" onClick={() => { push('/') }}>Home</Button>
    <Button variant="ghost" onClick={() => { push('/projects') }}>Projects</Button>
    <Button variant="ghost" onClick={() => { push('/my-account') }}>My Account</Button>
    <Box width={"1px"} bg={"app.400"} height={"40px"} marginX={2} />
    <Button variant="ghost" onClick={() => { push('/docs') }}>Docs</Button>
    <Button variant="ghost" onClick={() => { push('/publish') }}>Publish</Button>
    <Button variant="ghost" onClick={() => { push('/settings') }}>Settings</Button>
  </>
}