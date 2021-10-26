import { Box, Stack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ActualReefComponent, ConnectionStatusComponent, SelectAccountComponent } from './components/SmallComponents';
import { TxCallerComponent } from './components/TxCallerComponent';
import { ToolsPage } from './pages/ToolsPage';
import { IDOShowPage } from './pages/IDOShowPage';

import "./app.css"

export const Layout = () => {
  return (
    <Router>
      <Stack height="100vh" width="100vw" position={"absolute"} top={0} left={0} bottom={0} right={0} gap={0}>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"} padding={2} gap={2} bg="blackAlpha.200" width="100%" flexGrow={0} flexShrink={0}>
          <ActualReefComponent />
          <SelectAccountComponent />
          <ConnectionStatusComponent />
        </Stack>
        <Box flexGrow={1} flexShrink={0} height={"calc(100vh - 56px)"} overflowY={"auto"} >
          <Box maxWidth={1200} overflowY={"auto"} marginX={"auto"}>
            <Switch>
              <Route exact path="/">
                <ToolsPage />
              </Route>
              <Route path="/ido/:tx">
                <IDOShowPage />
              </Route>
            </Switch>
          </Box>
        </Box>
        <TxCallerComponent />
      </Stack>
    </Router >
  );
}