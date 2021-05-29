import React, {MouseEventHandler, useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTransitionHistory} from "react-route-transition";
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import {motion} from "framer-motion"

import "./tab-page.css";
import {ReactComponent as LeftArrow} from "../../assets/left-arrow.svg";
import {ReactComponent as RightArrow} from "../../assets/right-arrow.svg";
import {MenuItem} from "../../@types/primary-menu";
import {useDispatch, useSelector} from "react-redux";
import {RootReducer} from "../../store/reducers";
import {TabData} from "../../@types/tab-data";
import CustomTypeContent from "./CustomTypeContent";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "../../store/actions/action-types";
import AboutUsPageContent from './AboutUsPageContent'
import {AboutSubPageData} from "../../@types/about-sub-page-data";
import {AboutMenuItem} from "../../@types/about-menu";
import PageTypeContent from "./PageTypeContent";

// Tab page component
const TabPage: React.FC = () => {
    let { menuTitle } = useParams<{menuTitle: string}>();
    let sliderAnimation = 0;
    const [nextMenuItem, setNextMenuItem] = useState<MenuItem | undefined>();
    const [prevMenuItem, setPrevMenuItem] = useState<MenuItem | undefined>();
    const [animate, setAnimate] = useState({x: '0vh'});
    // const [initial, setInitial] = useState({x: '0vh'});
    const [animateNext, setAnimateNext] = useState({x: '200vh'});
    const [animatePrevious, setAnimatePrevious] = useState({x: '-200vh'});

    const history = useTransitionHistory();

    const menuData = useSelector((state: RootReducer) => state.menusData);
    const primaryMenus = useSelector((state: RootReducer) => state.landData.menus)?.data;
    const options = useSelector((state: RootReducer) => state.landData.options?.data);
    const selectedMenu = useSelector((state: RootReducer) => state.landData.selectedTabBasicDetails);
    const appName = useSelector((state: RootReducer) => state.landData.appName);
    const aboutContent = useSelector((state: RootReducer) => state.landData.aboutPageContent?.data);
    const aboutTabContent = useSelector((state: RootReducer) => state.aboutTabData.aboutTabData);
    const selectedAboutTab = useSelector((state: RootReducer) => state.aboutTabData.selectedAboutPage);
    const objectPageData = useSelector((state: RootReducer) => state.objectPageData.pageData);

    const dispatch = useDispatch<(action: Action) => void>();

    useEffect(() => {
        console.log('rerendered');
    }, []);

    useEffect(() => {
        let searchby = menuTitle;
        if (menuTitle === 'visuals') {
            searchby = 'home';
        }
        if ((!selectedMenu || selectedMenu.post_name !== searchby || selectedMenu.slug !== searchby) && primaryMenus) {
            const searched_menu = primaryMenus.items.find((item) => item.post_name === searchby || item.slug === searchby);
            console.log(searched_menu);
            if (searched_menu) {
                dispatch({
                    type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                    payload: searched_menu
                });
            }
        }
    }, [primaryMenus]);

    useEffect(() => {
        console.log(primaryMenus);
        console.log(selectedMenu);
        if (primaryMenus?.items && selectedMenu) {
            let flag = 0;
            for(let i = 0; i < primaryMenus.items.length; i++) {
                if (primaryMenus.items[i].ID === selectedMenu.ID) {
                    flag = i;
                    break;
                }
            }
            if (flag === 0) {
                setNextMenuItem(primaryMenus.items[flag + 1]);
                setPrevMenuItem(primaryMenus.items[primaryMenus.items.length - 1]);
            } else if (flag === primaryMenus.items.length -1) {
                setNextMenuItem(primaryMenus.items[0]);
                setPrevMenuItem(primaryMenus.items[flag - 1]);
            } else {
                setPrevMenuItem(primaryMenus.items[flag - 1]);
                setNextMenuItem(primaryMenus.items[flag + 1])
            }
            setTimeout(() => {
                setAnimate({x: '0vh'});
                setTimeout(() => {
                    let tabPage = (document.getElementById('tab-page') as HTMLElement);
                    let nextPage = (document.getElementById('next-page') as HTMLElement);
                    let previousPage = (document.getElementById('prev-page') as HTMLElement);
                    if (tabPage) {
                        tabPage.style.width = '100%';
                        tabPage.style.opacity = String(1);
                    }
                    if (nextPage) {
                        nextPage.style.width = '0%';
                        nextPage.style.opacity = String(0);
                    }
                    if (previousPage) {
                        previousPage.style.width = '0%';
                        previousPage.style.opacity = String(0);
                    }
                    setAnimateNext({x: '200vh'})
                    setAnimatePrevious({x: '-200vh'});
                }, 500);
            }, 500);
        }
    }, [selectedMenu, primaryMenus]);

    useEffect(() => {
        // setSliderAnimation();
    }, [menuTitle]);

    const formateTabData = (tabData: TabData[]) => {
        // tabData.splice(13);
        if (!tabData) {
            return [[]];
        }
        let formatedData = [];
        let dataLength = tabData?.length;
        if(dataLength <= 5){
            formatedData = chunkify(tabData, 1);
        }
        else if (dataLength <= 30) {
            formatedData = chunkify(tabData, 2);
        } else {
            formatedData = chunkify(tabData, 3);
        }
        return formatedData;
    };

    const chunkify = (a: any[], n: number) => {
        let len = a.length,
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

    const closeMenuItem: MouseEventHandler<HTMLElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        history.push("/");
    };

    const openSubmenuItem = (event: Event, id: number) => {
        event.preventDefault();
        history.push(`/${menuTitle}/${id}`);
    }

    const nextBtn: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let tabPage = (document.getElementById('tab-page') as HTMLElement);
        let nextPage = (document.getElementById('next-page') as HTMLElement);
        if (tabPage && nextPage) {
            tabPage.style.opacity = String(0);
            tabPage.style.width = '0%'; 
            nextPage.style.opacity = String(1);
            nextPage.style.width = '100%';
        }
        setAnimate({x: '-200vh'});
        setAnimateNext({x: '0vh'});

        if (nextMenuItem) {
            dispatch({
                type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                payload: nextMenuItem
            });
            history.push(`/${getUrl(nextMenuItem)}`)
        }
    };

    const prevBtn: MouseEventHandler<HTMLButtonElement>  = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let tabPage = (document.getElementById('tab-page') as HTMLElement);
        let previousPage = (document.getElementById('prev-page')) as HTMLElement;
        if (tabPage && previousPage) {
            tabPage.style.width = '0%';
            tabPage.style.opacity = String(0);
            previousPage.style.width = '100%';
            previousPage.style.opacity = String(1);
        }

        setAnimate({x: '200vh'});
        setAnimatePrevious({x: '0vh'});
        // event.target.closest('button').style.display="none";
        if (prevMenuItem) {
            dispatch({
                type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                payload: prevMenuItem
            });
            history.push(`/${getUrl(prevMenuItem)}`)
        }
    };

    const changeSelectedItemMenu = (event: MouseEvent, data: AboutMenuItem) => {
        event.preventDefault();
        if (data) {
            dispatch({
                type: ActionTypes.SET_SELECTED_ABOUT_TAB,
                payload: data.object_id
            })
        }
    }

    const setSliderAnimation = () => {
        let tabPage = (document.getElementById('tab-page') as HTMLElement);
        let nextPage = (document.getElementById('next-page') as HTMLElement);
        let previousPage = (document.getElementById('prev-page') as HTMLElement);

        tabPage.style.transition = 'all 1s';
        tabPage.style.transitionTimingFunction = 'transition-timing-function: ease-in';
        nextPage.style.transition = 'all 1s';
        nextPage.style.transitionTimingFunction = 'transition-timing-function: ease-in';
        previousPage.style.transition = 'all 1s';
        previousPage.style.transitionTimingFunction = 'transition-timing-function: ease-in';

        tabPage.style.width = '100%';
        tabPage.style.opacity = String(1);
        nextPage.style.width = '0%';
        nextPage.style.opacity = String(0);
        previousPage.style.width = '0%';
        previousPage.style.opacity = String(0);
        sliderAnimation = 1;
    }


    const getUrl = (menuItem: MenuItem) => {
        if (menuItem.slug) {
            return menuItem.slug
        } else {
            const post_title = menuItem.post_name;
            if (post_title === 'home') {
                return 'visuals'
            } else {
                return post_title;
            }
        }
    };

    return(
        <div style={{ height: '100%', position: 'relative' }}>
                <motion.div animate={animatePrevious} transition={{ type:"tween"}} id="prev-page" style={{
                    backgroundColor: selectedMenu
                        ? selectedMenu.background_color
                        : "inherit",
                }}>
                    <Link to="/" className="header_logo_img">
                        <img
                            id="header-logo"
                            src={
                                selectedMenu && selectedMenu.select_logo_color === "White"
                                    ? options?.acf.white_logo
                                    : options?.acf.site_logo
                            }
                            alt="logo"
                        />
                    </Link>
                    <p
                        className="tab-title"
                        onClick={(event) => closeMenuItem(event)}
                        style={{
                            color: selectedMenu ? selectedMenu.header_settings.text_color : 'inherit',
                            fontFamily:
                                selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                            fontSize:
                                selectedMenu ? selectedMenu.header_settings.font_size +
                                    "px" : 'inherit',
                            fontStyle:
                                selectedMenu ? selectedMenu.header_settings.font_style : 'inherit',
                        }}
                    >
                        {selectedMenu ? selectedMenu.title : ''}
                    </p>
                    {
                        selectedMenu?.type === "custom" && menuData.tabData ? [menuTitle] === null || menuData.tabData[menuTitle] && Object.keys(menuData.tabData[menuTitle]).length === 0 && menuData.tabData[menuTitle].constructor === Object || (menuData.tabData[menuTitle] && menuData.tabData[menuTitle].length === 0)
                            &&
                            <p
                                style={{
                                    fontFamily:
                                        selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                                    fontSize: '45px', textAlign: 'center'
                                }}
                            >COMING SOON... </p> : null
                    }
                    {
                        selectedMenu?.type === "custom" &&
                        <CustomTypeContent
                            pageContent={formateTabData(menuData?.tabData ? menuData?.tabData[menuTitle] : [])}
                            OpenSubmenuItem={openSubmenuItem}
                            tabListingStyle={options?.acf.add_typography}
                        />
                    }

                    {
                        selectedMenu?.object === "page" && selectedMenu?.object_id === "13" && aboutTabContent &&
                        <AboutUsPageContent
                            pageContent={aboutContent}
                            subPageContent={aboutTabContent[selectedAboutTab || '13']}
                            getMenuItemContent={changeSelectedItemMenu}
                            selectedAboutPage={selectedAboutTab || '13'}
                        />


                    }

                    {
                        selectedMenu?.object === "page" && selectedMenu?.object_id !== "13" && objectPageData && objectPageData[selectedMenu.object_id] &&
                        <>
                            <PageTypeContent pageContent={objectPageData[selectedMenu.object_id]} />
                        </>
                    }
                </motion.div>
            {menuTitle && <motion.div
                animate={animate}
                id="tab-page"
                transition={{ type:"tween"}}
                style={{
                backgroundColor: selectedMenu
                    ? selectedMenu.background_color
                    : "inherit",
            }}
                >
                <Helmet>
                <title>
                {selectedMenu
                    ? appName + " | " +
                    selectedMenu.title
                    : appName}
                </title>
                </Helmet>
                <Link to="/" className="header_logo_img">
                <img
                id="header-logo"
                src={
                selectedMenu && selectedMenu.select_logo_color === "White"
                    ? options?.acf.white_logo
                    : options?.acf.site_logo
            }
                alt="logo"
                />
                </Link>
                <p
                className="tab-title"
                onClick={(event) => closeMenuItem(event)}
                style={{
                color: selectedMenu ? selectedMenu.header_settings.text_color : 'inherit',
                fontFamily:
                    selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                fontSize:
                    selectedMenu ? selectedMenu.header_settings.font_size +
                        "px" : 'inherit',
                fontStyle:
                    selectedMenu ? selectedMenu.header_settings.font_style : 'inherit',
            }}
                >
                {selectedMenu ? selectedMenu.title : ''}
                </p>
                <div className="close_right">
                <a
                className="close-btn"
                onClick={(event) => closeMenuItem(event)}
                >
                X
                </a>
                </div>


                <button className={(selectedMenu && selectedMenu.ID === 16) ? ['prev_btn', 'about_prev_next_btn'].join(' ') : 'prev_btn'} onClick={(event) => prevBtn(event)}
                style={{
                display: selectedMenu && prevMenuItem ? 'block' : 'none',
                fill: prevMenuItem ? prevMenuItem.background_color : 'inherit'
            }}
                >
                <LeftArrow />
                </button>
                <br />
                <button className={(selectedMenu && selectedMenu.ID === 16) ? ['next_btn', 'about_prev_next_btn'].join(' ') : 'next_btn'} onClick={(event) => nextBtn(event)}
                style={{
                display: selectedMenu && nextMenuItem ? 'block' : 'none',
                fill: nextMenuItem ? nextMenuItem.background_color : 'inherit'
            }}
                >
                <RightArrow />
                </button>
                {
                    selectedMenu?.type === "custom" && menuData.tabData ? [menuTitle] === null || menuData.tabData[menuTitle] && Object.keys(menuData.tabData[menuTitle]).length === 0 && menuData.tabData[menuTitle].constructor === Object || (menuData.tabData[menuTitle] && menuData.tabData[menuTitle].length === 0)
                        &&
                        <p
                            style={{
                                fontFamily:
                                    selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                                fontSize: '45px', textAlign: 'center'
                            }}
                        >COMING SOON... </p> : null
                }
                {
                    selectedMenu?.type === "custom" &&
                    <CustomTypeContent
                        pageContent={formateTabData(menuData?.tabData ? menuData?.tabData[menuTitle] : [])}
                        OpenSubmenuItem={openSubmenuItem}
                        tabListingStyle={options?.acf.add_typography}
                    />
                }
                {/*{JSON.stringify(selectedMenu)}*/}
                {
                    selectedMenu?.object === "page" && selectedMenu?.object_id === "13" && aboutTabContent &&
                    <AboutUsPageContent
                        pageContent={aboutContent}
                        subPageContent={aboutTabContent[selectedAboutTab || '13']}
                        getMenuItemContent={changeSelectedItemMenu}
                        selectedAboutPage={selectedAboutTab || '13'}
                    />


                }

                {
                    selectedMenu?.object === "page" && selectedMenu?.object_id !== "13" && objectPageData && objectPageData[selectedMenu.object_id] &&
                        <>
                        <PageTypeContent pageContent={objectPageData[selectedMenu.object_id]} />
                        </>
                }

                </motion.div>
            }
            <motion.div animate={animateNext} transition={{ type:"tween"}} id="next-page" style={{
                backgroundColor: selectedMenu
                    ? selectedMenu.background_color
                    : "inherit",
            }} >
                <Link to="/" className="header_logo_img">
                    <img
                        id="header-logo"
                        src={
                            selectedMenu && selectedMenu.select_logo_color === "White"
                                ? options?.acf.white_logo
                                : options?.acf.site_logo
                        }
                        alt="logo"
                    />
                </Link>
                <p
                    className="tab-title"
                    onClick={(event) => closeMenuItem(event)}
                    style={{
                        color: selectedMenu ? selectedMenu.header_settings.text_color : 'inherit',
                        fontFamily:
                            selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                        fontSize:
                            selectedMenu ? selectedMenu.header_settings.font_size +
                                "px" : 'inherit',
                        fontStyle:
                            selectedMenu ? selectedMenu.header_settings.font_style : 'inherit',
                    }}
                >
                    {selectedMenu ? selectedMenu.title : ''}
                </p>
                {
                    selectedMenu?.type === "custom" && menuData.tabData ? [menuTitle] === null || menuData.tabData[menuTitle] && Object.keys(menuData.tabData[menuTitle]).length === 0 && menuData.tabData[menuTitle].constructor === Object || (menuData.tabData[menuTitle] && menuData.tabData[menuTitle].length === 0)
                        &&
                        <p
                            style={{
                                fontFamily:
                                    selectedMenu ? selectedMenu.header_settings.font_family : 'inherit',
                                fontSize: '45px', textAlign: 'center'
                            }}
                        >COMING SOON... </p> : null
                }
                {
                    selectedMenu?.type === "custom" &&
                    <CustomTypeContent
                        pageContent={formateTabData(menuData?.tabData ? menuData?.tabData[menuTitle] : [])}
                        OpenSubmenuItem={openSubmenuItem}
                        tabListingStyle={options?.acf.add_typography}
                    />
                }

                {
                    selectedMenu?.object === "page" && selectedMenu?.object_id === "13" && aboutTabContent &&
                    <AboutUsPageContent
                        pageContent={aboutContent}
                        subPageContent={aboutTabContent[selectedAboutTab || '13']}
                        getMenuItemContent={changeSelectedItemMenu}
                        selectedAboutPage={selectedAboutTab || '13'}
                    />


                }

                {
                    selectedMenu?.object === "page" && selectedMenu?.object_id !== "13" && objectPageData && objectPageData[selectedMenu.object_id] &&
                    <>
                        <PageTypeContent pageContent={objectPageData[selectedMenu.object_id]} />
                    </>
                }
            </motion.div>
        </div>
    )
}

export default TabPage;
