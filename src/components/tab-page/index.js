import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import { useParams } from "react-router";
import { useTransitionHistory } from "react-route-transition";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import NavCloneforTab from './clone-nav'

import APIService from "../../services";
import "./tab-page.css";
import MyContext from "../../MyContext";
import { ReactComponent as LeftArrow } from "../../assets/left-arrow.svg";
import { ReactComponent as RightArrow } from "../../assets/right-arrow.svg";


const TabListingItem = styled.a`
  font-family: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_family : ""};
  font-size: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_size + "px" : ""};
  color: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.text_color : ""};
  font-weight: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_weight : ""};
  text-decoration: none;
  text-transform: uppercase;
 
  &:hover {
    color: ${(props) =>
    props.tabListingStyle && (props.tabListingStyle.text_color == "#000000" || props.tabListingStyle.text_color == "#000")
      ? "#fff"
      : "#000"};
  }
`;

const PageDataDiv = styled.div`
  display: inline-block;
  width:77%;
  
    font-family: ${(props) =>
    props.pageData && props.pageData.acf
      ? props.pageData.acf.typography.font_family
      : ""};
    font-size: ${(props) =>
    props.pageData && props.pageData.acf
      ? props.pageData.acf.typography.font_size + "px"
      : ""};
    color: ${(props) =>
    props.pageData && props.pageData.acf
      ? props.pageData.acf.typography.text_color
      : ""};
  `;

// const CustomTypeContent = ({ pageContent, OpenSubmenuItem, tabListingStyle }) => {
//   return (
//     <div
//       className="menu-item-main-content"
//       style={{
//         display: pageContent ? "flex" : "none"        
//       }}
//     >
//       {pageContent && <table
//         style={{
//           display: "inline-block",
//           textAlign: "left",
//           verticalAlign: "top",
//           padding: "0 10px",          
//         }}
//       >
//         <tbody>
//           {pageContent.length > 0 && pageContent.map((formatedData, index) => (
//             <tr key={index}>
//               {formatedData.map((data, index) => (
//                 <td style={{ padding: "0 20px" }} key={index}>
//                   <TabListingItem
//                     tabListingStyle={tabListingStyle}
//                     href="#"
//                     id={"listing_" + data.id}
//                     onClick={(event) => OpenSubmenuItem(event, data.id)}
//                   >
//                     {data.title.rendered}
//                   </TabListingItem>
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>}
//     </div>)
// }

const CustomTypeContent = ({ pageContent, OpenSubmenuItem, tabListingStyle }) => {
  return (
    <div
      className="menu-item-main-content"
      style={{
        display: pageContent ? "flex" : "none"
      }}
    >
      {
        pageContent.length > 0 && pageContent.map((formatedData, index) => (
          <table key={index} style={{ display: "inline-block", textAlign: "left", verticalAlign: "top", padding: "0 10px" }}>
            <tbody>
              {formatedData.length > 0 && formatedData.map((data, index) => (
                <tr key={index}>
                  <td style={{ padding: "0 20px" }} key={index}>
                    <TabListingItem
                      tabListingStyle={tabListingStyle}
                      href="#"
                      id={"listing_" + data.id}
                      onClick={(event) => OpenSubmenuItem(event, data.id)}
                    >
                      {data.title.rendered}
                    </TabListingItem>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))
      }
    </div>)
}

const AboutUsPageContent = ({ pageContent, subPageContent, getMenuItemContent }) => {
  return (<div
    className="menu-item-main-content about_page"
    style={{
      display: pageContent ? "flex" : "none",
      alignItems: "center",
      height: "462px",
      
    }}
  >
    <div className="menu_list">
      <ul>
        {pageContent.items && pageContent.items.map(
          (data, index) => (
            <li key={index} onClick={(event) => getMenuItemContent(event, data)} className={
              index == 0
                ? "active"
                : ""
            }>
              {data.title}
            </li>
          )
        )}
      </ul>
    </div>
    {subPageContent && subPageContent.content && subPageContent.content.rendered &&
      <PageDataDiv
        pageData={subPageContent}>
        {ReactHtmlParser(subPageContent.content.rendered)}
      </PageDataDiv>}
  </div>)
}

const PageTypeContent = ({ pageContent }) => {
  return (<div
    className="menu-item-main-content contact-page"
    style={{
      display: pageContent ? "flex" : "none",
      width: '40%'
    }}
  >
    {pageContent && pageContent.content && pageContent.content.rendered &&
      <PageDataDiv
        pageData={pageContent}>
        {ReactHtmlParser(pageContent.content.rendered)}
      </PageDataDiv>}
  </div>)
}

// Tab page component
function TabPage(props) {
  const sharedData = React.useContext(MyContext);
  let sliderAnimation = 0;
  let { menuTitle } = useParams();
  const [tabContent, setTabContent] = useState([]);
  const [previousTabContent, setPreviousTabContent] = useState([]);
  const [nextTabContent, setNextTabContent] = useState([]);
  const [tabBasicDetails, setTabBasicDetails] = useState(sharedData.selectedTabBasicDetails);
  const [currentTabType, setCurrentTabType] = useState("");
  const [currentTabID, setCurrentTabId] = useState("");
  const [nextTabType, setNextTabType] = useState("");
  const [nextTabID, setNextTabId] = useState("");
  const [previousTabType, setPreviousTabType] = useState("");
  const [previousTabID, setPreviousTabId] = useState("");
  const [pageData, setPageData] = useState({});
  const [previousPageData, setPreviousPageData] = useState({});
  const [nextPageData, setNextPageData] = useState({});
  const history = useTransitionHistory();


  // Fetch all required data from API
  useEffect(() => {
    if (tabBasicDetails !== null) {
      let APICall = getTabContentUrl(tabBasicDetails, "current");
      if(tabBasicDetails.object_id === "13"){
        getAboutPageFirstItemContent("current");
      }
      APICall.then(res => {
        let mainPageData = res.data;
        strctureContentBasedOnTabType(tabBasicDetails, mainPageData, "current");
        if (!sliderAnimation) setSliderAnimation();
      })
        .catch(error => {
          console.log("Error in fetching current tab content: " + error);
          setTabContent([]);
          setPageData({});
          setCurrentTabType("");
          setCurrentTabId("");
        })

      let prevAPICall = getTabContentUrl(tabBasicDetails.prev_menu, "previous");
      if(tabBasicDetails.prev_menu.object_id === "13"){
        getAboutPageFirstItemContent("previous");
      }
      prevAPICall.then(res => {
        let mainPageData = res.data;
        strctureContentBasedOnTabType(tabBasicDetails.prev_menu, mainPageData, "previous");
        if (!sliderAnimation) setSliderAnimation();
      })
        .catch(error => {
          console.log("Error in fetching previous tab content: " + error);
          setPreviousTabContent([]);
          setPreviousPageData({});
          setPreviousTabType("");
          setPreviousTabId("");
        });


      let nextAPICall = getTabContentUrl(tabBasicDetails.next_menu, "next");
      if(tabBasicDetails.next_menu.object_id === "13"){
        getAboutPageFirstItemContent("next");
      }
      nextAPICall.then(res => {
        let mainPageData = res.data;
        strctureContentBasedOnTabType(tabBasicDetails.next_menu, mainPageData, "next");
        if (!sliderAnimation) setSliderAnimation();
      })
      .catch(error => {
          console.log("Error in fetching next tab content: " + error);
          setNextTabContent([]);
          setNextPageData({});
          setNextTabType("");
          setNextTabId("");
      });


    } else {
      APIService.fetchPrimaryMenu()
        .then(res => {
          let primaryMenu = res.data.items;
          const primaryMenuLength = primaryMenu.length;
          primaryMenu.forEach((menu, index) => {
            let primaryMenuTitle = menu.title.toLowerCase().replace(' ', '-');
            if (primaryMenuTitle === menuTitle) {
              let prevMenu = primaryMenu[index - 1]
                ? primaryMenu[index - 1]
                : primaryMenu[primaryMenuLength - 1];
              let nextMenu = primaryMenu[index + 1]
                ? primaryMenu[index + 1]
                : primaryMenu[0];
              let selectedMenu = { ...menu, ...{ 'prev_menu': prevMenu }, ...{ 'next_menu': nextMenu } };
              setTabBasicDetails(selectedMenu);
              // console.log(selectedMenu);
              sharedData.setSelectedTabBasicDetails(selectedMenu);

              let APICall = getTabContentUrl(selectedMenu, "current");
              if(selectedMenu.object_id === "13"){
                getAboutPageFirstItemContent("current");
              }
              APICall.then(res => {
                let mainPageData = res.data;
                strctureContentBasedOnTabType(selectedMenu, mainPageData, "current");
                if (!sliderAnimation) setSliderAnimation();
              })
                .catch(error => {
                  console.log("Error in fetching current tab content: " + error);
                  setTabContent([]);
                  setPageData({});
                  setCurrentTabType("");
                  setCurrentTabId("");
                })



              let prevAPICall = getTabContentUrl(selectedMenu.prev_menu, "previous");
              if(selectedMenu.prev_menu.object_id === "13"){
                getAboutPageFirstItemContent("previous");
              }
              prevAPICall.then(res => {
                let mainPageData = res.data;
                strctureContentBasedOnTabType(selectedMenu.prev_menu, mainPageData, "previous");
                if (!sliderAnimation) setSliderAnimation();
              })
                .catch(error => {
                  console.log("Error in fetching previous tab content: " + error);
                  setPreviousTabContent([]);
                  setPreviousPageData({});
                  setPreviousTabType("");
                  setPreviousTabId("");
                })



              let nextAPICall = getTabContentUrl(selectedMenu.next_menu, "next");
              if(selectedMenu.next_menu.object_id === "13"){
                getAboutPageFirstItemContent("next");
              }
              nextAPICall.then(res => {
                let mainPageData = res.data;
                strctureContentBasedOnTabType(selectedMenu.next_menu, mainPageData, "next");
                if (!sliderAnimation) setSliderAnimation();
              })
                .catch(error => {
                  console.log("Error in fetching next tab content: " + error);
                  setNextTabContent([]);
                  setNextPageData({});
                  setNextTabType("");
                  setNextTabId("");
                })
            }
          });
        })
        .catch(error => {
          console.log("Error in fetching primary menu data : " + error);
          if (!sliderAnimation) setSliderAnimation();
          setPreviousTabType("");
          setNextTabType("");
          setCurrentTabType("");
          setPreviousTabId("");
          setNextTabId("");
          setCurrentTabId("");
          setTabContent([]);
          setNextTabContent([]);
          setPreviousTabContent([]);
          setPageData({});
          setPreviousPageData({});
          setNextPageData({});
        })
    }
  }, [menuTitle]);

  const getAboutPageFirstItemContent = (tab = "") => {
  if (sharedData.aboutPageData) {
    if (tab === "current")
      setPageData(sharedData.aboutPageData);
    else if (tab === "previous")
      setPreviousPageData(sharedData.aboutPageData);
    else
      setNextPageData(sharedData.aboutPageData);
  } else {
    APIService.fetchPageContent("13")
      .then(response => {
        sharedData.setAboutPageData(response.data);
        if (tab === "current")
          setPageData(response.data);
        else if (tab === "previous")
          setPreviousPageData(response.data);
        else
          setNextPageData(response.data);
        })
      }
  }

  const getTabContentUrl = (tabData, tab = "") => {
    let tabType = tabData.object;
    let tabId = tabData.object_id;
    let APICall = "";
    if (tab === "current") {
      setCurrentTabType(tabType);
      setCurrentTabId(tabId);
    } else if (tab === "next") {
      setNextTabType(tabType);
      setNextTabId(tabId);
    } else if (tab === "previous") {
      setPreviousTabType(tabType);
      setPreviousTabId(tabId);
    }

    if (tabType === "custom") {
      let updatedTitle = tabData.title.toLowerCase().replace(' ', '-');
      APICall = APIService.fetchMenuItemMainPageData(updatedTitle);
    } else if (tabType === "page" && tabId === "13" && tab !== "") {
      // API call for About us page
      APICall = APIService.fetchAboutUsContent();
    } else if (tabType === "page" && tabId === "13" && tab === "") {
      // API call for About us page
      APICall = APIService.fetchPageContent(tabId);
    } else {
      APICall = APIService.fetchPageContent(tabId);
    }
    return APICall;
  }

  const strctureContentBasedOnTabType = (tabDetails, mainPageData, tab) => {
    if (tabDetails.object === "custom") {
      // Chunkify received data into 2 or 3 table according to length
      let currentTabData = formateTabData(mainPageData);
      if (tab === "current")
        setTabContent(currentTabData);
      else if (tab === "previous")
        setPreviousTabContent(currentTabData);
      else
        setNextTabContent(currentTabData);
    } else if (tabDetails.object === "page" && tabDetails.object_id === "13") {
      if (tab === "current")
        setTabContent(mainPageData);
      else if (tab === "previous")
        setPreviousTabContent(mainPageData);
      else
        setNextTabContent(mainPageData);
    } else {
      if (tab === "current")
        setTabContent(mainPageData);
      else if (tab === "previous")
        setPreviousTabContent(mainPageData);
      else
        setNextTabContent(mainPageData);
    }
  }

  // Format custom type tab data based on its length
  // const formateTabData = (tabData) => {
  //   let formatedData = [];
  //   let dataLength = tabData.length;
  //   if (dataLength <= 24) {
  //     formatedData = Chunkify(tabData, dataLength / 2);
  //   } else {
  //     formatedData = Chunkify(tabData, dataLength / 3);
  //   }
  //   return formatedData;
  // }
  const formateTabData = (tabData) => {
    // tabData.splice(13);
    let formatedData = [];
    let dataLength = tabData.length;
    if(dataLength <= 5){
      formatedData = Chunkify(tabData, 1);
    }
    else if (dataLength <= 30) {
      formatedData = Chunkify(tabData, 2);
    } else {
      formatedData = Chunkify(tabData, 3);
    }
    return formatedData;
  }

  // Close current tab on X click
  const CloseMenuItem = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTabContent([]);
    setPreviousTabContent([]);
    setNextTabContent([]);
    history.push("/");
  };

  // Navigate to new sub menu on click
  const OpenSubmenuItem = (event, id) => {
    event.preventDefault();
    history.push(`/${menuTitle}/${id}`);
  }

  // Set page slider animation on current, next and previous div
  const setSliderAnimation = () => {
    let tabPage = document.getElementById('tab-page');
    let nextPage = document.getElementById('next-page');
    let previousPage = document.getElementById('prev-page');

    tabPage.style.transition = 'all 0.5s';
    nextPage.style.transition = 'all 0.5s';
    previousPage.style.transition = 'all 0.5s';

    tabPage.style.width = '100%';
    tabPage.style.opacity = 1;
    nextPage.style.width = '0%';
    nextPage.style.opacity = 0;
    previousPage.style.width = '0%';
    previousPage.style.opacity = 0;
    sliderAnimation = 1;
  }

  // Remove page slider animation on current, next and previous div
  const removeSliderAnimation = () => {
    let tabPage = document.getElementById('tab-page');
    let nextPage = document.getElementById('next-page');
    let previousPage = document.getElementById('prev-page');

    tabPage.style.transition = 'none';
    nextPage.style.transition = 'none';
    document.getElementById('prev-page').style.transition = 'none';

    tabPage.style.width = '100%';
    tabPage.style.opacity = 1;
    nextPage.style.width = '0%';
    nextPage.style.opacity = 0;
    previousPage.style.width = '0%';
    previousPage.style.opacity = 0;
    sliderAnimation = 0;
  }

  // Divide array into give number of sub-array
  const Chunkify = (a, n) => {
    var len = a.length,
      out = [],
      i = 0,
      size;
    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(a.slice(i, (i += size)));
      }
    } else {
      while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, (i += size)));
      }
    }
    return out;
  };

  // Update menu on next and previous button click
  const UpdateMenu = (menuDetails, action) => {
    let primaryMenu = sharedData.primaryMenu;
    const primaryMenuLength = primaryMenu.length;
    primaryMenu.forEach((menu, index) => {
      if (menu.title === menuDetails.title) {
        let prevMenu = primaryMenu[index - 1]
          ? primaryMenu[index - 1]
          : primaryMenu[primaryMenuLength - 1];
        let nextMenu = primaryMenu[index + 1]
          ? primaryMenu[index + 1]
          : primaryMenu[0];
        let selectedMenu = { ...menu, ...{ 'prev_menu': prevMenu }, ...{ 'next_menu': nextMenu } }
        setTabBasicDetails(selectedMenu);
        // console.log(selectedMenu);
        if (action === "next") {
          setPreviousTabContent(tabContent);
          setTabContent(nextTabContent);
        } else {
          setNextTabContent(tabContent);
          setTabContent(previousTabContent);
        }

        // setTabContent(mainContent);
        sharedData.setSelectedTabBasicDetails(selectedMenu);
      }
    })

    let updatedMenuTitle = menuDetails.title.toLowerCase().replace(' ', '-');
    removeSliderAnimation();
    history.push(updatedMenuTitle);
  }

  // Show animation on next button click
  const nextBtn = (event, menuDetails) => {
    event.preventDefault();
    event.stopPropagation();
    let tabPage = document.getElementById('tab-page');
    let nextPage = document.getElementById('next-page');
    tabPage.style.opacity = 0;
    tabPage.style.width = '0%';
    nextPage.style.opacity = 1;
    nextPage.style.width = '100%';
    event.target.closest('button').style.display="none";
    setTimeout(function () { UpdateMenu(menuDetails, 'next')}, 500);
    setTimeout(function (button) { button.style.display="block";}, 2000, event.target.closest('button'));
  }

  // Show animation on previous button click
  const prevBtn = (event, menuDetails) => {
    event.preventDefault();
    event.stopPropagation();
    let tabPage = document.getElementById('tab-page');
    let previousPage = document.getElementById('prev-page');
    tabPage.style.width = '0%';
    tabPage.style.opacity = 0;
    previousPage.style.width = '100%';
    previousPage.style.opacity = 1;
    event.target.closest('button').style.display="none";
    setTimeout(function () { UpdateMenu(menuDetails, 'previous')}, 500);
    setTimeout(function (button) { button.style.display="block";}, 2000, event.target.closest('button'));
  }

  // Get menu item content if tab content is similar to menu
  const getMenuItemContent = (event, menuDetails) => {
    event.preventDefault();
    const parent = event.target.parentElement;
    const current = event.target;
    Array.prototype.forEach.call(parent.children, li => {
      if (li === current) {
        li.classList.toggle('active');
      } else {
        li.classList.remove('active');
      }
    });

    event.target.classList.add('active');
    getTabContentUrl(menuDetails)
      .then(response => {
        setPageData(response.data);
      })
      .catch(error => {
        console.log("Error in fetching menu item data: " + error);
        setPageData("");
      })
  }

  return (
    <MyContext.Consumer>
      {(context) => (
        <div className="tab-container" style={{ height: '100%', position: 'relative' }}>
          <div
            id="prev-page"
            style={{
              backgroundColor: tabBasicDetails && tabBasicDetails.prev_menu
                ? tabBasicDetails.prev_menu.background_color
                : "inherit",
            }}
          >
            <Link to="/" className="header_logo_img">
              <img
                id="header-logo"
                src={
                  tabBasicDetails && tabBasicDetails.prev_menu.select_logo_color === "White"
                    ? context.whiteLogo
                    : context.logo
                }
                alt="logo"
              />
            </Link>

            <p
              className="tab-title" 
              style={{
                color: tabBasicDetails ? tabBasicDetails.prev_menu.header_settings.text_color : 'inherit',
                fontFamily:
                  tabBasicDetails ? tabBasicDetails.prev_menu.header_settings.font_family : 'inherit',
                fontSize:
                  '30px', // tabBasicDetails ? tabBasicDetails.prev_menu.header_settings.font_size +
                    "px" : 'inherit',
                fontStyle:
                  tabBasicDetails ? tabBasicDetails.prev_menu.header_settings.font_style : 'inherit',
              }}
            >
              {tabBasicDetails ? tabBasicDetails.prev_menu.title : ''}
            </p>

            {
              previousTabType === "custom" &&
              <CustomTypeContent
                pageContent={previousTabContent}
                tabListingStyle={context.tabListingStyle}
                OpenSubmenuItem={OpenSubmenuItem}
              ></CustomTypeContent>
            }

            {
              previousTabType === "page" && previousTabID === "13" &&
              <AboutUsPageContent
                pageContent={previousTabContent}
                subPageContent={previousPageData}
                getMenuItemContent={getMenuItemContent}
              ></AboutUsPageContent>

            }

            {
              previousTabType === "page" && previousTabID !== "13" && previousTabContent &&
              <PageTypeContent pageContent={previousTabContent} ></PageTypeContent>
            }

          </div>

          <div
            id="tab-page"
            style={{
              backgroundColor: tabBasicDetails
                ? tabBasicDetails.background_color
                : "inherit",
            }}
          >
            <Helmet>
              <title>
                {tabBasicDetails
                  ? context.appName + " | " +
                  tabBasicDetails.title
                  : context.appName}
              </title>
            </Helmet>
            <Link to="/" className="header_logo_img">
              <img
                id="header-logo"
                src={
                  tabBasicDetails && tabBasicDetails.select_logo_color === "White"
                    ? context.whiteLogo
                    : context.logo
                }
                alt="logo"
              />
            </Link>
            <p
              className="tab-title"
              onClick={(event) => CloseMenuItem(event)}
              style={{
                color: tabBasicDetails ? tabBasicDetails.header_settings.text_color : 'inherit',
                fontFamily:
                  tabBasicDetails ? tabBasicDetails.header_settings.font_family : 'inherit',
                fontSize:
                  '30px', //tabBasicDetails ? tabBasicDetails.header_settings.font_size +
                    "px" : 'inherit',
                fontStyle:
                  tabBasicDetails ? tabBasicDetails.header_settings.font_style : 'inherit',
              }}
            >
              {tabBasicDetails ? tabBasicDetails.title : ''}             
            </p>
            <div className="close_right">
            <a
              className="close-btn"
              onClick={(event) => CloseMenuItem(event)}
            >
              X
          </a>
          </div>

          
            <button className={(tabBasicDetails && tabBasicDetails.ID === 16) ? ['prev_btn', 'about_prev_next_btn'].join(' ') : 'prev_btn'} onClick={(event) => prevBtn(event, tabBasicDetails.prev_menu)}
              style={{ display: tabBasicDetails && tabBasicDetails.prev_menu != "" ? 'block' : 'none', fill: tabBasicDetails ? tabBasicDetails.prev_menu.background_color : 'inherit' }}
            >
              <LeftArrow />
            </button>
            <br />
            <button className={(tabBasicDetails && tabBasicDetails.ID === 16) ? ['next_btn', 'about_prev_next_btn'].join(' ') : 'next_btn'} onClick={(event) => nextBtn(event, tabBasicDetails.next_menu)}
              style={{ display: tabBasicDetails && tabBasicDetails.next_menu != "" ? 'block' : 'none', fill: tabBasicDetails ? tabBasicDetails.next_menu.background_color : 'inherit' }}
            >
              <RightArrow />
            </button>

            {
              currentTabType === "custom" &&
              <CustomTypeContent
                pageContent={tabContent}
                tabListingStyle={context.tabListingStyle}
                OpenSubmenuItem={OpenSubmenuItem}
              ></CustomTypeContent>
            }

            {
              currentTabType === "page" && currentTabID === "13" &&
              <AboutUsPageContent
                pageContent={tabContent}
                subPageContent={pageData}
                getMenuItemContent={getMenuItemContent}
              ></AboutUsPageContent>

            }

            {
              currentTabType === "page" && currentTabID !== "13" && tabContent &&
              <PageTypeContent pageContent={tabContent} ></PageTypeContent>
            }
          </div>

          <div
            id="next-page"
            style={{
              backgroundColor: tabBasicDetails && tabBasicDetails.next_menu
                ? tabBasicDetails.next_menu.background_color
                : "inherit",
            }}
          >
            <Link to="/" className="header_logo_img">
              <img
                id="header-logo"
                src={
                  tabBasicDetails && tabBasicDetails.next_menu.select_logo_color === "White"
                    ? context.whiteLogo
                    : context.logo
                }
                alt="logo"
              />
            </Link>
            <p
              className="tab-title"
              style={{
                color: tabBasicDetails ? tabBasicDetails.next_menu.header_settings.text_color : 'inherit',
                fontFamily:
                  tabBasicDetails ? tabBasicDetails.next_menu.header_settings.font_family : 'inherit',
                fontSize:
                  '30px', // tabBasicDetails ? tabBasicDetails.next_menu.header_settings.font_size +
                    "px" : 'inherit',
                fontStyle:
                  tabBasicDetails ? tabBasicDetails.next_menu.header_settings.font_style : 'inherit',
              }}
            >
              {tabBasicDetails ? tabBasicDetails.next_menu.title : ''}
            </p>

            {
              nextTabType === "custom" &&
              <CustomTypeContent
                pageContent={nextTabContent}
                tabListingStyle={context.tabListingStyle}
                OpenSubmenuItem={OpenSubmenuItem}
              ></CustomTypeContent>
            }

            {
              nextTabType === "page" && nextTabID === "13" &&
              <AboutUsPageContent
                pageContent={nextTabContent}
                subPageContent={nextPageData}
                getMenuItemContent={getMenuItemContent}
              ></AboutUsPageContent>

            }

            {
              nextTabType === "page" && nextTabID !== "13" && nextTabContent &&
              <PageTypeContent pageContent={nextTabContent} ></PageTypeContent>
            }

          </div>
          <NavCloneforTab 
            context={ context }
            updateTab={ setTabBasicDetails } 
            currentMenu={ tabBasicDetails } 
            menu={ sharedData.primaryMenu } />
        </div>
      )}
    </MyContext.Consumer>
  );
}

export default TabPage;
