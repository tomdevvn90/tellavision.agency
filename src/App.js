import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RouteTransitionProvider } from "react-route-transition";

import HomePage from "./components/home";
import TabPage from "./components/tab-page";
import SubTabPage from "./components/sub-tab-page";
import MyProvider from "./MyProvider";


import "./App.css";
import Loader from "./components/loader";

function App(props) {
    return (
      <MyProvider>
        <div id="main">
          <Loader/>
            <Router>
              <RouteTransitionProvider>
                <Route path="/" exact>
                  <HomePage /> 
                </Route>
                <Route path="/:menuTitle" exact>
                  <TabPage />
                </Route>
                <Route path="/:menuTitle/:subId" exact>
                  <SubTabPage />
                </Route>
              </RouteTransitionProvider>
            </Router>
        </div>
      </MyProvider>
    );
}

export default App;
