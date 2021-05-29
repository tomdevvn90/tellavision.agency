import React, { useState, useEffect, createRef } from 'react'
import Styled from 'styled-components'
import { useTransitionHistory } from 'react-route-transition'
import './nav.scss'
import {MenuItem, PrimaryMenu} from "../../@types/primary-menu";
import {useSelector} from "react-redux";
import {RootReducer} from "../../store/reducers";

const MenuContainer = Styled('div')<{show: string}>`
  opacity: ${ props => props.show };
  transition: .5s ease;
  -webkit-transition: .5s ease;
  `;

/**
 *
 * @param {*} props
 * @returns
 */

interface HomeNavPropType {
    onUpdateTab: (menu: MenuItem) => void;
    menu: PrimaryMenu | undefined;
    currentMenu: MenuItem | null,
}
const HomeNav: React.FC<HomeNavPropType> = (props) => {
    const { menu, currentMenu, onUpdateTab } = props;
    const [ show, setShow ] = useState( 1 );

    return (
        <div className="home-nav">
            <MenuContainer show={ String(show) }>
                <MainMenu
                    menu={ menu }
                    activeid={ currentMenu?.ID }
                    onGoMenu={ ( menu: MenuItem ) => {
                        if( onUpdateTab ) {
                            onUpdateTab( menu )
                        }
                    } }/>
            </MenuContainer>
        </div>
    )
};


interface MainMenuPropType {
    menu: PrimaryMenu | undefined;
    activeid?: number;
    onGoMenu: (menu: MenuItem) => void;
}

declare global {
    interface Window {
        menuItemHeight:any;
        menuItemHeightCache: any;
    }
}

const MainMenu: React.FC<MainMenuPropType> = ( props ) => {
    let { menu, activeid, onGoMenu } = props;
    const history = useTransitionHistory();
    const ulRef  = createRef<HTMLUListElement>();
    const selectedTabBasicDetails = useSelector((state: RootReducer) => state.landData.selectedTabBasicDetails);


    useEffect( () => {

        const updateMenuHeight = () => {
            let liChild = ulRef.current?.querySelectorAll( 'li' );
            if (liChild) {
                let width = liChild[0]?.clientWidth;

                window.menuItemHeight = window.menuItemHeightCache ? window.menuItemHeightCache : width

                liChild.forEach( ( li, index ) => {
                    li.style.setProperty( '--height-value', `${ window.menuItemHeight }px` )
                    li.style.setProperty( '--total-nav-item', String(liChild?.length) )
                } )
            }
        };

        updateMenuHeight();
    } )

    const goLink = ( evt: any, menu: MenuItem ) => {

        if( onGoMenu ) {
            onGoMenu.call( evt, menu )
        }
    }

    return (
        <div className="main-menu">
            <ul ref={ ulRef }>
                { menu?.items.map(item => {
                    let menu_bg_style = {
                        '--menu-color': item.background_color,
                        backgroundColor: item.background_color
                    }

                    return (
                        <li
                            className={ [ 'menu-item', `menu-id-${ item.ID }`, ( (activeid && activeid == item.ID) ? '__is-current' : '' ) ].join( ' ' ) }
                            onClick={ event => { goLink( event, item ) } } key={ item.ID }>
                            <div className={ [ 'menu-color-background', (selectedTabBasicDetails?.ID == item.ID ? '__is-full-color--test' : '') ].join( ' ' ) } style={ menu_bg_style }></div>
                            <span className={ [ 'menu-text' ].join( ' ' ) } style={ { color: item.select_logo_color.toLowerCase() } }>{ item.title }</span>
                        </li>
                    )
                } ) }
            </ul>
        </div>
    )
}

export default HomeNav
