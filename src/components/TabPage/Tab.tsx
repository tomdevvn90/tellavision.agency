import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import {ReactComponent as LeftArrow} from "../../assets/left-arrow.svg";
import {ReactComponent as RightArrow} from "../../assets/right-arrow.svg";
import CustomTypeContent from "./CustomTypeContent";
import AboutUsPageContent from "./AboutUsPageContent";
import PageTypeContent from "./PageTypeContent";
import React, {MouseEventHandler, useEffect, useState} from "react";
import {MenuItem} from "../../@types/primary-menu";
import {useDispatch, useSelector} from "react-redux";
import {RootReducer} from "../../store/reducers";
import {useTransitionHistory} from "react-route-transition";
import {TabData} from "../../@types/tab-data";
import {AboutMenuItem} from "../../@types/about-menu";
import {useParams} from "react-router";
import {ActionTypes} from "../../store/actions/action-types";
import {Action} from "../../@types/redux-types";
import "./tab-page.css";

interface TabPropType {
    menu: MenuItem;
    menuData: TabData[] | null;
    prevBtn: any;
    nextBtn: any;
}

const Tab: React.FC<TabPropType> = ({menu,  menuData, prevBtn, nextBtn}) => {

    const options = useSelector((state: RootReducer) => state.landData.options?.data);
    const appName = useSelector((state: RootReducer) => state.landData.appName);
    const aboutContent = useSelector((state: RootReducer) => state.landData.aboutPageContent?.data);
    const aboutTabContent = useSelector((state: RootReducer) => state.aboutTabData.aboutTabData);
    const selectedAboutTab = useSelector((state: RootReducer) => state.aboutTabData.selectedAboutPage);
    const objectPageData = useSelector((state: RootReducer) => state.objectPageData.pageData);
    const primaryMenus = useSelector((state: RootReducer) => state.landData.menus)?.data;


    const dispatch = useDispatch<(action: Action) => void>();

    let { menuTitle } = useParams<{menuTitle: string}>();

    const history = useTransitionHistory();

    const [nextMenuItem, setNextMenuItem] = useState<MenuItem | undefined>();
    const [prevMenuItem, setPrevMenuItem] = useState<MenuItem | undefined>();

    useEffect(() => {
        console.log(primaryMenus);
        console.log(menu);
        if (primaryMenus?.items && menu) {
            let flag = 0;
            for(let i = 0; i < primaryMenus.items.length; i++) {
                if (primaryMenus.items[i].ID === menu.ID) {
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
        }
    }, [menu]);



    const closeMenuItem: MouseEventHandler<HTMLElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        history.push("/");
    };

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

    const openSubmenuItem = (event: Event, id: number) => {
        event.preventDefault();
        history.push(`/${menuTitle}/${id}`);
    };

    const changeSelectedItemMenu = (event: MouseEvent, data: AboutMenuItem) => {
        event.preventDefault();
        if (data) {
            dispatch({
                type: ActionTypes.SET_SELECTED_ABOUT_TAB,
                payload: data.object_id
            })
        }
    };

    return (
        <div
            id="tab-page"
            style={{
                backgroundColor: menu
                    ? menu.background_color
                    : "inherit",
            }}
        >
            <Helmet>
                <title>
                    {menu
                        ? appName + " | " +
                        menu.title
                        : appName}
                </title>
            </Helmet>
            <Link to="/" className="header_logo_img">
                <img
                    id="header-logo"
                    src={
                        menu && menu.select_logo_color === "White"
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
                    color: menu ? menu.header_settings.text_color : 'inherit',
                    fontFamily:
                        menu ? menu.header_settings.font_family : 'inherit',
                    fontSize:
                        menu ? menu.header_settings.font_size +
                            "px" : 'inherit',
                    fontStyle:
                        menu ? menu.header_settings.font_style : 'inherit',
                }}
            >
                {menu ? menu.title : ''}
            </p>
            <div className="close_right">
                <a
                    className="close-btn"
                    onClick={(event) => closeMenuItem(event)}
                >
                    X
                </a>
            </div>


            {/*<button className={(menu && menu.ID === 16) ? ['prev_btn', 'about_prev_next_btn'].join(' ') : 'prev_btn'} onClick={(event) => prevBtn(event)}*/}
            {/*        style={{*/}
            {/*            display: menu && prevMenuItem ? 'block' : 'none',*/}
            {/*            fill: prevMenuItem ? prevMenuItem.background_color : 'inherit'*/}
            {/*        }}*/}
            {/*>*/}
            {/*    <LeftArrow />*/}
            {/*</button>*/}
            <br />
            {/*<button className={(menu && menu.ID === 16) ? ['next_btn', 'about_prev_next_btn'].join(' ') : 'next_btn'} onClick={(event) => nextBtn(event)}*/}
            {/*        style={{*/}
            {/*            display: menu && nextMenuItem ? 'block' : 'none',*/}
            {/*            fill: nextMenuItem ? nextMenuItem.background_color : 'inherit'*/}
            {/*        }}*/}
            {/*>*/}
            {/*    <RightArrow />*/}
            {/*</button>*/}
            {
                menu?.type === "custom" && menuData && Object.keys(menuData).length === 0 && menuData.constructor === Object || (menuData && menuData.length === 0)
                    &&
                    <p
                        style={{
                            fontFamily:
                                menu ? menu.header_settings.font_family : 'inherit',
                            fontSize: '45px', textAlign: 'center'
                        }}
                    >COMING SOON... </p>
            }
            {
                menu?.type === "custom" &&
                <CustomTypeContent
                    pageContent={formateTabData( menuData ? menuData : [])}
                    OpenSubmenuItem={openSubmenuItem}
                    tabListingStyle={options?.acf.add_typography}
                />
            }
            {
                menu?.object === "page" && menu?.object_id === "13" && aboutTabContent &&
                <AboutUsPageContent
                    pageContent={aboutContent}
                    subPageContent={aboutTabContent[selectedAboutTab || '13']}
                    getMenuItemContent={changeSelectedItemMenu}
                    selectedAboutPage={selectedAboutTab || '13'}
                />


            }

            {
                menu?.object === "page" && menu?.object_id !== "13" && objectPageData && objectPageData[menu.object_id] &&
                <>
                    <PageTypeContent pageContent={objectPageData[menu.object_id]} />
                </>
            }

        </div>
    )
}

export default Tab;
