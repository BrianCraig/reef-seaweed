import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";

export const MenuComponent = () => {
  let { push } = useHistory();
  let { pathname } = useLocation();
  const variantBool = (status: boolean) => status ? "outline" : "ghost"
  return <>
    <Button variant={variantBool(pathname === '/')} onClick={() => { push('/') }}>Home</Button>
    <Button variant={variantBool(pathname.startsWith("/projects"))} onClick={() => { push('/projects') }}>Projects</Button>
    <Button variant={variantBool(pathname.startsWith("/my-account"))} onClick={() => { push('/my-account') }}>My Account</Button>
    <Button variant={variantBool(pathname.startsWith("/locking"))} onClick={() => { push('/locking') }}>$SWD</Button>
    <Box width={"1px"} bg={"app.400"} height={"40px"} marginX={2} />
    <Button variant={variantBool(pathname.startsWith("/docs"))} onClick={() => { push('/docs') }}>Docs</Button>
    <Button variant={variantBool(pathname.startsWith("/publish"))} onClick={() => { push('/publish') }}>Publish</Button>
    <Button variant={variantBool(pathname.startsWith("/settings"))} onClick={() => { push('/settings') }}>Settings</Button>
  </>
}