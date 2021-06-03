import React, { useState, useEffect } from "react";

import MyContext from './MyContext';
import APIService from "./services";

function MyProvider(props) {
  const [appName] = useState("Tellavision Agency");
  const [logo, setLogo] = useState("");
  const [whiteLogo, setWhiteLogo] = useState("");
  const [tabListingStyle, setTabListingStyle] = useState(null);
  const [selectedTabBasicDetails, setSelectedTabBasicDetails] = useState(null);
  const [primaryMenu, setPrimaryMenu] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(0);
  const [aboutPageData, setAboutPageData] = useState(null)
  useEffect(() => {
    setIsPageLoaded(0);
    Promise.all([
      APIService.fetchMenuItemStyle(),
      APIService.fetchPrimaryMenu(),
      APIService.fetchPageContent(13) // fetch About page data
    ]).then((res) => {
      const menuItemStyle = res[0].data;
      const primaryMenuResponseData = res[1].data.items;
      const primaryMenuLength = primaryMenuResponseData.length;
      const aboutPage = res[2].data;

      primaryMenuResponseData.forEach((menu, index) => {
        let menuData = primaryMenu;
        let prevMenu = primaryMenuResponseData[index - 1]
          ? primaryMenuResponseData[index - 1]
          : primaryMenuResponseData[primaryMenuLength - 1];
        let nextMenu = primaryMenuResponseData[index + 1]
          ? primaryMenuResponseData[index + 1]
          : primaryMenuResponseData[0];
        menuData.push({ ...menu, ...{ 'prev_menu': prevMenu }, ...{ 'next_menu': nextMenu } });
        setPrimaryMenu(menuData);
        
      });

      setLogo(menuItemStyle.acf.site_logo);
      setWhiteLogo(menuItemStyle.acf.white_logo);
      setTabListingStyle(menuItemStyle.acf.add_typography);
      setAboutPageData(aboutPage);
      setTimeout(function () { setIsPageLoaded(1); }, 3000);
      // setIsPageLoaded(1);
    })
      .catch(error => {
        setIsPageLoaded(1);
        console.log(error);
      })
  }, []);


  return (
    <MyContext.Provider value={{
      appName: appName,
      isPageLoaded: isPageLoaded,
      logo: logo,
      whiteLogo: whiteLogo,
      tabListingStyle: tabListingStyle,
      primaryMenu: primaryMenu,
      selectedTabBasicDetails: selectedTabBasicDetails,
      aboutPageData: aboutPageData,
      setIsPageLoaded: setIsPageLoaded,
      setAboutPageData: setAboutPageData,
      setSelectedTabBasicDetails: setSelectedTabBasicDetails
    }}>
      {props.children}
    </MyContext.Provider>
  );
}

export default MyProvider;