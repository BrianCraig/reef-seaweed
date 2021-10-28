import { Box, Button, Stack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ActualReefComponent, ConnectionStatusComponent, SelectAccountComponent } from './components/SmallComponents';
import { TxCallerComponent } from './components/TxCallerComponent';
import { ToolsPage } from './pages/ToolsPage';
import { IDOShowPage } from './pages/IDOShowPage';

import "./app.css"

export const Layout = () => {
  return (
    <Router>
      <Stack height="100vh" width="100vw" position={"absolute"} top={0} left={0} bottom={0} right={0} spacing={0}>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"} padding={2} spacing={2} borderBottom={"1px solid #ddd"} width="100%" flexGrow={0} flexShrink={0}>
          <Button variant="outline">Home</Button>
          <Button variant="ghost">Projects</Button>
          <Button variant="ghost">Documentation</Button>
          <Button variant="ghost">Publish</Button>
          <Button variant="ghost">Manage</Button>
          <Button variant="ghost">Settings</Button>
          <Box flexGrow={1} />
          <ActualReefComponent />
          <SelectAccountComponent />
          <ConnectionStatusComponent />
        </Stack>
        <Box flexGrow={1} flexShrink={0} height={"calc(100vh - 57px)"} overflowY={"auto"} >
          <Box maxWidth={1200} overflowY={"auto"} marginX={"auto"} marginY={8}>
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