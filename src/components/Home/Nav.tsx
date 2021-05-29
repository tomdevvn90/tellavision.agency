import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useTransition, useTransitionHistory } from 'react-route-transition';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import "./home.css";
import client from "../../client/tellavision-client";
import {useDispatch, useSelector} from "react-redux";
import {RootReducer} from "../../store/reducers";
import {Typography} from "../../@types/home-page";
import {MenuItem} from "../../@types/primary-menu";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "../../store/actions/action-types";

// Home page component
function HomePage() {
    const [homeText, setHomeText] = useState<string | undefined>();
    const [homeTextStyle, setHomeTextStyle] = useState<Typography | undefined>();
    const [homePageFeaturedImage, setHomePageFeaturedImage] = useState<string | undefined>();
    const history = useTransitionHistory();

    const homeContent = useSelector((state: RootReducer) => state.landData.homePageContent?.data);
    const primaryMenu = useSelector((state: RootReducer) => state.landData.menus?.data);
    const options = useSelector((state: RootReducer) => state.landData.options?.data);
    const appName = useSelector((state: RootReducer) => state.landData.appName);
    const selectedTabBasicDetails = useSelector((state: RootReducer) => state.landData.selectedTabBasicDetails);
    const dispatch = useDispatch<(action: Action) => void>();


    // Fetch all required data from API
    useEffect(() => {
        if (homeContent) {
            ApplyClosingEffectOnLoad();
            setHomeText(homeContent?.content.rendered);
            setHomeTextStyle(homeContent?.acf.typography);
            client.fetchFeaturedImageUrl(homeContent.featured_media)
                .then((res) => {
                    const featuredImageResponseData = res.data;
                    setHomePageFeaturedImage(featuredImageResponseData.guid.rendered);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [homeContent]);


    // Open menu on menu item click
    const OpenMenuItem = (event: any, menuDetails: MenuItem) => {
        dispatch({
                    type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                    payload: menuDetails
                });
        let currentMenuItem = event.target;
        let headerLogo = document.getElementById('header-logo');
        let homeText = document.getElementById("home-text");

        if (!event.target.classList.contains('menu-item')) {
            currentMenuItem = currentMenuItem.closest('.menu-item');
        }
        const primaryMenuItem = document.getElementsByClassName('primaryMenu');
        console.log(primaryMenuItem);
        if (!currentMenuItem.classList.contains('full-menu-item')) {
            let divElements = document.getElementsByClassName("menu-item");
            headerLogo?.classList.add('small-header-logo');
            homeText?.classList.add('home-text-faded');
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
                setTimeout(function (logo) { (document.getElementById('header-logo') as HTMLImageElement).src = logo; }, 1000, options?.acf.white_logo);
            }
            let menuTitle = menuDetails.title.toLowerCase().replace(' ', '-');
            setTimeout(function () { history.push(`${menuTitle}`); }, 1200);
        }
    }

    // Apply closing effect on some elements, if navigated from the tab page
    const ApplyClosingEffectOnLoad = () => {
        // document.getElementById('header-logo').classList.remove('small-header-logo');
        (document.getElementById("home-text") as HTMLElement).classList.remove('home-text-faded');
        var divElements = document.getElementsByClassName("menu-item");
        for (var i = 0; i < divElements.length; i++) {
            divElements[i].classList.remove("small-menu-item");
            divElements[i].classList.remove("full-menu-item");
            divElements[i].firstElementChild?.classList.remove("full-menu-title");
        }
    }

    return (
                <div style={{ backgroundImage: `url(${homePageFeaturedImage})` }} className="home-content">
                    <Helmet><title>{appName}</title></Helmet>
                    <Link to="/" className="header_logo_img" style={{paddingLeft: '28px', display: 'block'}}>
                        <img id="header-logo" src={options?.acf.site_logo} alt="logo" className={selectedTabBasicDetails ? 'small-header-logo' : ''} />
                    </Link>
                    <div id="home-text" className={selectedTabBasicDetails ? 'home-text-faded' : ''}
                         style={{
                             fontFamily: homeTextStyle?.font_family, fontSize: homeTextStyle?.font_size + "px",
                             color: homeTextStyle?.text_color
                         }}>
                        {homeText && ReactHtmlParser(homeText)}
                    </div>
                    <div className="primaryMenu">
                        {primaryMenu?.items?.map((item: MenuItem, index: number) => (
                            <div onClick={(event) => OpenMenuItem(event, item)}
                                 className={selectedTabBasicDetails === null ? 'menu-item' :
                                     ['menu-item',
                                         selectedTabBasicDetails.ID === item.ID ? 'full-menu-item' : 'small-menu-item'].join(' ')}
                                 key={index}
                                 style={{
                                     fontFamily: item.header_settings.font_family,
                                     fontSize: item.header_settings.font_size + "px",
                                     fontStyle: item.header_settings.font_style,
                                     backgroundColor: item.background_color,
                                     width: `${100 / primaryMenu?.items.length}%`
                                 }}>
                                <p
                                    className={selectedTabBasicDetails ? ['menu-title', 'full-menu-title'].join(' ') : 'menu-title'}
                                    style={{
                                        color: item.header_settings.text_color,
                                        opacity: index === primaryMenu?.items.length - 1 ? 1 : 0
                                    }}
                                >
                                    {item.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
    );
}

export default HomePage;
