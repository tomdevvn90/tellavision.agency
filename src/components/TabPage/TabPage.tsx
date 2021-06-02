import Tab from './Tab';
import {useDispatch, useSelector} from "react-redux";
import {RootReducer} from "../../store/reducers";
import {useParams} from "react-router";
import {motion} from "framer-motion";
import {ActionTypes} from "../../store/actions/action-types";
import {Action} from "../../@types/redux-types";
import {useTransitionHistory} from "react-route-transition";
import {MenuItem} from "../../@types/primary-menu";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "./tab-page.css";

const TabPage: React.FC = () => {
    const primaryMenus = useSelector((state: RootReducer) => state.landData.menus)?.data;
    const menuData = useSelector((state: RootReducer) => state.menusData);

    let { menuTitle } = useParams<{menuTitle: string}>();

    const dispatch = useDispatch<(action: Action) => void>();

    const history = useTransitionHistory();

    const nextBtn = (event: Event, menuItem: MenuItem) => {
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

        if (menuItem) {
            dispatch({
                type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                payload: menuItem
            });
            history.push(`/${getUrl(menuItem)}`)
        }
    };

    const prevBtn = (event: Event, menuItem: MenuItem) => {
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

        // event.target.closest('button').style.display="none";
        if (menuItem) {
            dispatch({
                type: ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS,
                payload: menuItem
            });
            history.push(`/${getUrl(menuItem)}`)
        }
    };

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

    const handleChange = (index: any, data: any) => {
        const menu = data.props.children.props.menu;
        // console.log(data);
        console.log(index);
        history.push(`/${getUrl(menu)}`)
    }

    return(<>
        <Carousel onChange={handleChange}>
            {primaryMenus?.items.map((menuItem) => (
                <div>
                    <Tab menu={menuItem} menuData={ menuData.tabData ? menuData.tabData[menuItem.post_name] : null } prevBtn={prevBtn} nextBtn={nextBtn}/>
                </div>
            ))}
        </Carousel>

    </>)
};

export default TabPage;
