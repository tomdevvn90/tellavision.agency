import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useTransition, useTransitionHistory } from 'react-route-transition';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

import APIService from "../../services";
import MyContext from "../../MyContext";
import "./home.css";

// Home page component
function HomePage(props) {
  const [homeText, setHomeText] = useState("");
  const [homeTextStyle, setHomeTextStyle] = useState("");
  const [homePageFeaturedImage, setHomePageFeaturedImage] = useState("");
  const history = useTransitionHistory();

  // Fetch all required data from API
  useEffect(() => {
    ApplyClosingEffectOnLoad();
    Promise.all([
      APIService.fetchHomeContent()
    ]).then((res) => {
      const homeContentResponseData = res[0].data;
      setHomeText(homeContentResponseData.content.rendered);
      setHomeTextStyle(homeContentResponseData.acf.typography);

      APIService.fetchFeaturedImageUrl(homeContentResponseData.featured_media)
        .then(res => {
          const featuredImageResponseData = res.data;
          setHomePageFeaturedImage(featuredImageResponseData.guid.rendered);
        })
        .catch(error => {
          console.log(error);
        })
    })
      .catch(error => {
        console.log(error);
      });
  }, [])


  // Open menu on menu item click
  const OpenMenuItem = (event, menuDetails, context) => {
    context.setSelectedTabBasicDetails(menuDetails);
    let currentMenuItem = event.target;
    let headerLogo = document.getElementById('header-logo');
    let homeText = document.getElementById("home-text");

    if (!event.target.classList.contains('menu-item')) {
      currentMenuItem = currentMenuItem.closest('.menu-item');
    }
    if (!currentMenuItem.classList.contains('full-menu-item')) {
      let divElements = document.getElementsByClassName("menu-item");
      headerLogo.classList.add('small-header-logo');
      homeText.classList.add('home-text-faded');
      for (var i = 0; i < divElements.length; i++) {
        if (divElements[i] !== currentMenuItem) {
          divElements[i].classList.add("small-menu-item");
        } else {
          currentMenuItem.classList.add("full-menu-item");
          currentMenuItem.firstElementChild.classList.add("full-menu-title");
        }
      }
      //Update logo based on given data
      if (menuDetails.select_logo_color === "White") {
        setTimeout(function (logo) { document.getElementById('header-logo').src = logo; }, 1000, context.whiteLogo);
      }
      let menuTitle = menuDetails.title.toLowerCase().replace(' ', '-');
      setTimeout(function () { history.push(`${menuTitle}`); }, 1200);
    }
  }

  // Apply closing effect on some elements, if navigated from the tab page
  const ApplyClosingEffectOnLoad = () => {
    // document.getElementById('header-logo').classList.remove('small-header-logo');
    document.getElementById("home-text").classList.remove('home-text-faded');
    var divElements = document.getElementsByClassName("menu-item");
    for (var i = 0; i < divElements.length; i++) {
      divElements[i].classList.remove("small-menu-item");
      divElements[i].classList.remove("full-menu-item");
      divElements[i].firstElementChild.classList.remove("full-menu-title");
    }
  }

  return (
    <MyContext.Consumer>
      {context => (
        <div style={{ backgroundImage: `url(${homePageFeaturedImage})` }} className="home-content">
          <Helmet><title>{context.appName}</title></Helmet>
          <Link to="/" className="header_logo_img">
            <img id="header-logo" src={context.logo} alt="logo" className={context.selectedTabBasicDetails ? 'small-header-logo' : ''} />
          </Link>
          <div id="home-text" className={context.selectedTabBasicDetails ? 'home-text-faded' : ''}
            style={{
              fontFamily: homeTextStyle.font_family, fontSize: homeTextStyle.font_size + "px",
              color: homeTextStyle.text_color
            }}>
            {ReactHtmlParser(homeText)}
          </div>
          <div className="primaryMenu">
            {context.primaryMenu.map((item, index) => (
              <div onClick={(event) => OpenMenuItem(event, item, context)}
                className={context.selectedTabBasicDetails === null ? 'menu-item' :
                  ['menu-item',
                    context.selectedTabBasicDetails.ID === item.ID ? 'full-menu-item' : 'small-menu-item'].join(' ')}
                key={index}
                style={{
                  fontFamily: item.header_settings.font_family,
                  fontSize: item.header_settings.font_size + "px",
                  fontStyle: item.header_settings.font_style,
                  backgroundColor: item.background_color,
                  width: `${100 / context.primaryMenu.length}%`                  
                }}>
                <p
                  className={context.selectedTabBasicDetails ? ['menu-title', 'full-menu-title'].join(' ') : 'menu-title'}
                  style={{
                    color: item.header_settings.text_color,
                    opacity: index === context.primaryMenu.length - 1 ? 1 : 0
                  }}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MyContext.Consumer>
  );
}

export default HomePage;
