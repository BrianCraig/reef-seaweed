import React from 'react';
import { Pane, Text, majorScale } from 'evergreen-ui'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./app.css"
import { ActualReefComponent, ConnectionStatusComponent, SelectAccountComponent } from './components/SmallComponents';
import { TxCallerComponent } from './components/TxCallerComponent';
import { ToolsPage } from './pages/ToolsPage';


export const Layout = () => {

  return (
    <Router>
      <Pane display="flex" flexDirection={"column"} height="100vh" width="100vw" alignItems="center">
        <Pane display="flex" alignItems="center" justifyContent={"flex-end"} padding={majorScale(1)} gap={majorScale(1)} background="tint1" width="100%">
          <Text flexGrow={10} background="linear-gradient(to bottom, #121FCF 0%, #00a911 65%)" className={"clipText"}>SeaWeed</Text>
          <ActualReefComponent />
          <SelectAccountComponent />
          <ConnectionStatusComponent />
        </Pane>
        <Pane display="flex" flexDirection={"column"} padding={majorScale(2)} width={1080} gap={majorScale(1)} flexGrow={0} flexShrink={1}>
          <Switch>
            <Route exact path="/">
              <ToolsPage />
            </Route>
          </Switch>
        </Pane>
        <TxCallerComponent />
      </Pane>
    </Router>
  );
}