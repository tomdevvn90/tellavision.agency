// Ticket: (FWDNTIPIRF-20) | Date: 23-11-2020 | Change: Changed feature images get method to reflect backend API changes 

import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import {  useTransitionHistory } from "react-route-transition";
import { Helmet } from "react-helmet";
import APIService from "../../services";
import "./sub-tab-page.css";
import MyContext from "../../MyContext";
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import 'react-awesome-slider/dist/styles.css';
const SubMenuTitle = styled.div`
  display: inline-block;
  padding-right:30px;
  & > p {
    font-family: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.title_css_settings.font_family
      : ""};
    font-size: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.title_css_settings.font_size + "px"
      : ""};
    color: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.title_css_settings.text_color
      : ""};
    text-transform: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.title_css_settings.text_transform
      : ""};
      white-space: nowrap;
  }
`;

const SubMenuContent = styled.div`
  display: inline-block;
  & > p {
    font-family: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.typography.font_family
      : ""};
    font-size: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.typography.font_size + "px"
      : ""};
    color: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.typography.text_color
      : ""};
  }


`;

const PortfolioList = styled.ul`
  list-style-type: none;
  & > li {
    font-family: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.post_attribute_listing_typography
        .font_family
      : ""};
    font-size: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.post_attribute_listing_typography
        .font_size + "px"
      : ""};
    font-weight: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.post_attribute_listing_typography
        .font_weight
      : ""};
    color: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.post_attribute_listing_typography
        .text_color
      : ""};
    text-transform: ${(props) =>
    props.currentTabSubPageData
      ? props.currentTabSubPageData.acf.post_attribute_listing_typography
        .text_transform
      : ""};
    cursor: pointer;
  }
  & > li:hover {
    color: ${(props) =>
    props.currentTabSubPageData &&
      props.currentTabSubPageData.acf.post_attribute_listing_typography
        .text_color === "#000"
      ? "#fff"
      : "#000"};
  }
  & > .active {
    color: ${(props) =>
    props.currentTabSubPageData &&
      props.currentTabSubPageData.acf.post_attribute_listing_typography
        .text_color === "#000"
      ? "#fff"
      : "#000"};
  }
`;

// Tab page component
function SubTabPage(props) {
  
  const sharedData = React.useContext(MyContext);
  const [{ menuTitle, subId }] = useState(useParams());
  const [currentTabSubPageData, setCurrentTabSubPageData] = useState(null);
  const [sliderArrowColor, setSliderArrowColor] = useState('');
  const [portfolioContent, setPortfolioContent] = useState({});
  const [featuredImages, setFeaturedImages] = useState([]);
  const [tabBasicDetails, setTabBasicDetails] = useState(sharedData.selectedTabBasicDetails);
  const history = useTransitionHistory();

  // Fetch all required data from API 


  useEffect(() => {
    let APICalls = [APIService.fetchMenuItemSubPageData(menuTitle, subId)];
    if (tabBasicDetails === null) {
      APICalls.push(APIService.fetchPrimaryMenu());
    }

    Promise.all(APICalls)
      .then((res) => {
        let currentTabSubPageData = res[0].data;
        let arrowColor = currentTabSubPageData.acf.navigation_arrow_color.text_color;
        setCurrentTabSubPageData(currentTabSubPageData);
        setSliderArrowColor(arrowColor)
        if (tabBasicDetails === null) {
          let primaryMenu = res[1].data.items;
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
              let selectedMenu = { ...menu, ...{ 'prev_menu': prevMenu }, ...{ 'next_menu': nextMenu } }
              setTabBasicDetails(selectedMenu);
              sharedData.setSelectedTabBasicDetails(selectedMenu);
            }
          });
        }

        // Set first portfolio item by default open or Featured images silder
        if (currentTabSubPageData.acf.add_slider_data && currentTabSubPageData.acf.add_slider_data.length > 0) {
          getPortfolioContent(currentTabSubPageData.acf.add_slider_data[0]);
        }
        else if (currentTabSubPageData.acf.featured_image_gallery && currentTabSubPageData.acf.featured_image_gallery.length > 0) {
          getFeaturedImages(currentTabSubPageData.acf.featured_image_gallery);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const getFeaturedImages = (data) => {
    let featureIamges = [];
    data.forEach(image => {
      if (image) {
        // FWDNTIPIRF-20 | 23-11-2020 | Changed feature images get method to reflect backend API changes | Start
        featureIamges.push(`<img src= ${image}></div`);
        // FWDNTIPIRF-20 | 23-11-2020 | Changed feature images get method to reflect backend API changes | End
      }
    })
    setFeaturedImages(featureIamges);
  }

  // Modify portfolio content as per the need and rander
  const getPortfolioContent = (data) => {
    let portfolioTitle = data.add_attribute_name;
    let portfolioContent = data.add_content_for_attribute;
    let elements = [];
    portfolioContent.forEach(content => {
      if (content.select_content_type === "Image") {       
          elements.push(`<a data-fancybox="gallery" href="${content.add_attribute_data.add_attribute_image}"><img src="${content.add_attribute_data.add_attribute_image}"></a>`);
      } else if (content.select_content_type === "Url") {
        elements.push(`<iframe src="${content.add_attribute_data.add_attribute_link}"></iframe>`);
      } else {
        elements.push(`<div class="written_portfolio">${content.add_attribute_data.add_attribute_content}</div>`);
      }
    })
    setPortfolioContent({ key: portfolioTitle, content: elements });
  };

  // Update portfolio category content on click
  const renderPorfolioContent = (event, data) => {
    event.preventDefault();
    event.stopPropagation();
    getPortfolioContent(data);
  }

  // Close current sub-tab on X click
  const CloseMenuItem = (event) => {
    event.preventDefault();
    event.stopPropagation();
    history.push(`/${menuTitle}`);
  };

  // Update the buttons of the Awesome slider
  const updateSliderArrow = (arrowColor) => {
    var nextButton = document.getElementsByClassName("control-next");
    var prevButton = document.getElementsByClassName("control-prev");
    for (let i = 0; i < prevButton.length; i++) {
      prevButton[i].innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33">       
        <path id="&lt;" fill=${arrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
      </svg>`;
    }
    for (let i = 0; i < nextButton.length; i++) {
      nextButton[i].innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33" style="transform:rotate(180deg);">        
        <path id="&lt;" fill=${arrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
      </svg>`;
    }
  }

  return (
    
    <MyContext.Consumer>
      {(context) => (
        <div id="sub-tab-page"
          style={{
            boxShadow: `0px 0px 0px 100vw ` + ((tabBasicDetails && tabBasicDetails.background_color)
              ? tabBasicDetails.background_color
              : "inherit"),
            backgroundColor: tabBasicDetails
              ? tabBasicDetails.background_color
              : "inherit",
          }}>
          <Helmet>
            <title>
              {currentTabSubPageData
                ? context.appName + " | " +
                currentTabSubPageData.title.rendered
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
                tabBasicDetails ? tabBasicDetails.header_settings.font_size +
                  "px" : 'inherit',
              fontStyle:
                tabBasicDetails ? tabBasicDetails.header_settings.font_style : 'inherit',
            }}
          >
            {tabBasicDetails ? tabBasicDetails.title : ''}
          </p>
          <div className="close_right">
            <a
              href=""
              className="close-btn"
              onClick={(event) => CloseMenuItem(event)}
            >
              X
          </a>
          </div>
          {currentTabSubPageData &&
            <div id="menu-item-sub-content">
              <div className="artist_content">
                <SubMenuTitle currentTabSubPageData={currentTabSubPageData}>
                  <p>
                    {currentTabSubPageData
                      ? currentTabSubPageData.title.rendered
                      : ""}
                  </p>
                </SubMenuTitle>
                <SubMenuContent currentTabSubPageData={currentTabSubPageData}>
                  {currentTabSubPageData
                    ? ReactHtmlParser(currentTabSubPageData.content.rendered)
                    : ""}
                </SubMenuContent>
              </div>
              <div
                id="portfolio"
                style={{
                  display:
                    currentTabSubPageData &&
                      currentTabSubPageData.acf.add_slider_data !== false
                      ? "flex"
                      : "none",
                }}
              >
                <div className="post_list_item">
                  <PortfolioList currentTabSubPageData={currentTabSubPageData}>
                    {currentTabSubPageData &&
                      currentTabSubPageData.acf.add_slider_data !== false
                      ? currentTabSubPageData.acf.add_slider_data.map(
                        (data, index) => (
                          <li
                            key={index}
                            className={
                              portfolioContent.key === data.add_attribute_name
                                ? "active"
                                : ""
                            }
                            onClick={(event) =>
                              renderPorfolioContent(event, data)
                            }
                          >
                            {data.add_attribute_name}
                          </li>
                        )
                      )
                      : ""}
                  </PortfolioList>
                </div>
                {portfolioContent && portfolioContent.content &&
                  <div id="post_des_content">
                    <Carousel
                    //  infiniteLoop
                     showStatus = {false}
                     showIndicators = {false}
                      key={portfolioContent.key}                    
                      onChange={(e) => {
                        console.log("IMAGE", e,sliderArrowColor);
                      }}
                      renderArrowPrev={(onClickHandler, hasPrev) =>                   
                       hasPrev && (
                            <button type="button" className="control-prev" onClick={onClickHandler} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33">       
                                  <path id="&lt;" fill={sliderArrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
                                </svg>                              
                            </button>
                        )
                      }
                    
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && (
                            <button type="button" className="control-next" onClick={onClickHandler} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33">        
                                  <path id="&lt;" fill={sliderArrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
                                </svg>
                            </button>
                        )
                    }

                      

                    
                    
                      style={{ display: portfolioContent.content.length > 1 ? 'block' : 'none' }}>
                      {portfolioContent && portfolioContent.content && portfolioContent.content.map((element, index) => (
                        <div key={index} className="portfolio-slider">
                          {ReactHtmlParser(element)}    
                                       
                        </div>
                        
                      ))}                      
                   
                      
                    </Carousel>
                   
                    {/* {portfolioContent.content.length === 1 &&
                      portfolioContent.content.map((element, index) => (
                        <div className="single_portfolio">
                          <div key={index} className="portfolio-slider">
                            {ReactHtmlParser(element)}
                           
                          </div>
                        </div>
                      ))} */}
                  </div>}
              </div>

              {featuredImages && featuredImages.length > 0 &&
                <div id="featured-media">
                 <Carousel
                    //  infiniteLoop
                     showStatus = {false}
                     showIndicators = {false}
                      key={portfolioContent.key}                    
                      onChange={(e) => {
                        console.log("IMAGE", e,sliderArrowColor);
                      }}
                      renderArrowPrev={(onClickHandler, hasPrev) =>                   
                       hasPrev && (
                            <button type="button" className="control-prev" onClick={onClickHandler} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33">       
                                  <path id="&lt;" fill={sliderArrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
                                </svg>                              
                            </button>
                        )
                      }
                    
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && (
                            <button type="button" className="control-next" onClick={onClickHandler} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 33" width="34" height="33">        
                                  <path id="&lt;" fill={sliderArrowColor} class="shp0" d="M33.94 33.11L2.36 19.88L2.36 13.37L33.94 0.1L33.94 4.99L6.71 16.61L33.94 28.26L33.94 33.11ZM32.23 33.11L0.65 19.88L0.65 13.37L32.23 0.1L32.23 4.99L5 16.61L32.23 28.26L32.23 33.11Z" />
                                </svg>
                            </button>
                        )
                    }
                    style={{ display: featuredImages.length > 1 ? 'block' : 'none' }}>
                    {featuredImages && featuredImages.length > 0 && featuredImages.map((element, index) => (
                      <div key={index} className="portfolio-slider">
                        {ReactHtmlParser(element)}
                      </div>
                    ))}
                  </Carousel>
                  {featuredImages.length === 1 &&
                    featuredImages.map((element, index) => (
                      <div className="single_portfolio">
                        <div key={index} className="portfolio-slider">
                          {ReactHtmlParser(element)}
                        </div>
                      </div>
                    ))}
                </div>}
            </div>
          }


        </div>
        
      )}
    </MyContext.Consumer>
    
  );
  
}

export default SubTabPage;
