import React, {useEffect} from 'react';
import {BrowserRouter as Router,Route, useParams} from 'react-router-dom'
import {RouteTransitionProvider} from 'react-route-transition';

import {useDispatch, useSelector} from "react-redux";
import {getInitialData} from "./store/actions/get-initial-data";
import Loader from './components/Loader/index'
import './App.css';
import HomePage from './components/Home/Nav'
import TabPage from './components/TabPage/TabPage'
import {RootReducer} from "./store/reducers";
import {getMenusData} from "./store/actions/get-menus-data";
import {getAboutPageTabContent} from "./store/actions/get-about-page-Tab-content";
import {getObjectPageData} from "./store/actions/get-objet-page-data";
import SubTabPage from './components/SubTabPage'

function App() {
  const dispatch = useDispatch();

  const menus = useSelector((state: RootReducer) => state.landData.menus?.data);
  const aboutData = useSelector((state: RootReducer) => state.landData.aboutPageContent?.data);

  useEffect(() => {
    dispatch(getInitialData());
  }, []);

  useEffect(() => {
      if (menus?.items) {
          dispatch(getMenusData(menus.items));
          dispatch(getObjectPageData(menus.items));
      }
  }, [menus]);

  useEffect(() => {
      if (aboutData?.items) {
          console.log('About data is loading');
          dispatch(getAboutPageTabContent(aboutData?.items))
      }
  }, [aboutData]);

  return (
      <div>
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
      </div>
  );
};



export default App;
