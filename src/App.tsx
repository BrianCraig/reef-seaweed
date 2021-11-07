import { Box, Stack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ActualReefComponent, ConnectionStatusComponent, SelectAccountComponent } from './components/SmallComponents';
import { ToolsPage } from './pages/ToolsPage';
import { IDOShowPage } from './pages/IDOShowPage';
import { MenuComponent } from "./components/MenuComponent";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { DocumentationPage } from "./pages/DocumentationPage";
import { MyAccountPage } from "./pages/MyAccountPage";
import { PublishPage } from "./pages/PublishPage";
import { PublishDescriptionPage } from "./pages/PublishDescriptionPage";
import { LockingPage } from "./pages/LockingPage";
import { EvmClaimerModal } from "./components/EvmClaimerModal";
import "./app.css"

export const Layout = () => {
  return (
    <Router>
      <EvmClaimerModal />
      <Stack height="100vh" width="100vw" position={"absolute"} top={0} left={0} bottom={0} right={0} spacing={0}>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"} padding={2} spacing={2} borderBottom={"1px"} borderColor={"app.400"} width="100%" flexGrow={0} flexShrink={0}>
          <MenuComponent />
          <Box flexGrow={1} />
          <ActualReefComponent />
          <SelectAccountComponent />
          <ConnectionStatusComponent />
        </Stack>
        <Box flexGrow={1} flexShrink={0} height={"calc(100vh - 57px)"} overflowY={"auto"} >
          <Box maxWidth={1200} overflowY={"visible"} marginX={"auto"} marginY={8} paddingX={2}>
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/projects">
                <ProjectsPage />
              </Route>
              <Route path="/projects/:tx">
                <IDOShowPage />
              </Route>
              <Route exact path="/my-account">
                <MyAccountPage />
              </Route>
              <Route exact path="/locking">
                <LockingPage />
              </Route>
              <Route exact path="/docs">
                <DocumentationPage />
              </Route>
              <Route exact path="/publish">
                <PublishPage />
              </Route>
              <Route exact path="/publish/:id/description">
                <PublishDescriptionPage />
              </Route>
              <Route exact path="/settings">
                <ToolsPage />
              </Route>
            </Switch>
          </Box>
        </Box>
      </Stack>
    </Router >
  );
}