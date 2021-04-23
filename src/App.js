import React, {useEffect} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RouteTransitionProvider } from "react-route-transition";
import {connect} from "react-redux";

import HomePage from "./components/home";
import TabPage from "./components/tab-page";
import SubTabPage from "./components/sub-tab-page";
import MyProvider from "./MyProvider";
import { getPageData } from './store/actions/actions';


import "./App.css";
// import Loader from "./components/loader";

function App(props) {
    const {getPageData} = props;
    useEffect(() => {
        getPageData('visuals');
        getPageData('writers');
        getPageData('storyboards');
        getPageData('graphic-design');
        getPageData('european-talent');
        getPageData('corporates');
    }, []);
    return (
      <MyProvider>
        <div id="main">
          {/*<Loader/>*/}
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

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
    getPageData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
