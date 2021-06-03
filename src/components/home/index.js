import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useTransition, useTransitionHistory } from 'react-route-transition';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

import APIService from "../../services";
import MyContext from "../../MyContext";
import HomeNav from './home-nav'
import "./home.css";

// Home page component
function HomePage(props) {
  const [homeText, setHomeText] = useState("");
  const [homeTextStyle, setHomeTextStyle] = useState("");
  const [homePageFeaturedImage, setHomePageFeaturedImage] = useState("");

  useTransition( {
    handlers: [
      {
        path: '/',
        onEnter: async () => {
          if( document.querySelector( '#header-logo' ) )
            document.querySelector( '#header-logo' ).classList.add( 'small-header-logo' )
        }
      }
    ]
  } ) 

  const history = useTransitionHistory();

  useEffect( () => {
    
    const setMainHeight = () => {
      let MainElem = document.querySelector( '#main' )
      MainElem.style.setProperty( 'height', `${ window.innerWidth * 0.5 }px` )
    }

    // setMainHeight()
  } )

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

    setTimeout( () => {
      let menuItem = document.querySelector( `.menu-item-id-${ menuDetails.ID }` )
      // menuItem.classList.add( 'full-box-shadow' )
    }, 10 )
    

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
      setTimeout(function () { history.push(`${menuTitle}`); }, 1500);
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

  /**
   * 
   * @param {Object Menu} menu 
   * @param {Function} callback 
   */
  const AnimRedirectMenu = ( menu, callback ) => {
    let root = document.querySelector( '#root' )
    let main = document.querySelector( '#main' )
    let menuEl = document.querySelector( '.home-nav' )
    let menuItem = document.querySelector( `.menu-item.menu-id-${ menu.ID }` )
    let menuTitle = menuItem.querySelector( `.menu-text` )

    let menuItemLiPos = menuItem.getBoundingClientRect()
    let mainPos = main.getBoundingClientRect()
    let menuItemPos = menuTitle.getBoundingClientRect()

    let data = {
      elems: []
    }

    {
      /**
       * 
       */
      if( [ 16, 19 ].includes( menu.ID ) ) { 
        document.querySelector( '.home-nav' ).style.setProperty( 'transform', 'translateY(100%)' )
        document.querySelector( '.home-nav' ).style.setProperty( '-webkit-transform', 'translateY(100%)' )
      }
    }

    menuItem.style.opacity = 0

    {
      /**
       * background panel
       */
      let backgroundWrap = document.createElement( 'DIV' )
      let backgroundAnim = document.createElement( 'DIV' )
      let _menuTitle = document.createElement( 'DIV' )

      // backgroundWrap.style.zIndex = 9

      data.elems.push( backgroundWrap )

      // Title 
      _menuTitle.style.setProperty( 'color', menuTitle.style.color )
      _menuTitle.style.setProperty( 'position', 'absolute' )
      _menuTitle.style.setProperty( 'z-index', 1 )
      // _menuTitle.style.setProperty( 'top', `${ menuItemPos.y - mainPos.y }px` )
      // _menuTitle.style.setProperty( 'left', `${ menuItemPos.x - mainPos.x }px` )
      _menuTitle.style.setProperty( 'top', `${ menuTitle.offsetTop }px` )
      _menuTitle.style.setProperty( 'left', `${ menuTitle.offsetLeft }px` )
      _menuTitle.style.setProperty( 'font-size', '30px' )
      _menuTitle.style.setProperty( 'font-family', 'Playfair Display SC' )
      _menuTitle.style.setProperty( 'transition', '1.2s' )
      _menuTitle.style.setProperty( '-webkit-transition', '1.2s' )
      _menuTitle.innerHTML = menu.title

      backgroundWrap.classList.add( 'background-shadow-wrap' )
      backgroundWrap.style.setProperty( 'left', (menuItemLiPos.x) + 'px' )
      backgroundWrap.style.setProperty( 'top', (menuItemLiPos.y + menuItemLiPos.height) + 'px' )

      backgroundAnim.classList.add( 'background-shadow-anim' )
      backgroundAnim.appendChild( _menuTitle )

      backgroundWrap.appendChild( backgroundAnim )
      document.body.appendChild( backgroundWrap )

      setTimeout( () => {
        backgroundAnim.style.setProperty( 'left', `${ ((menuItemLiPos.x) - 15) * -1 }px` )
        backgroundAnim.style.setProperty( 'width', `${ root.clientWidth }px` )
        backgroundAnim.style.setProperty( 'height', `${ root.clientHeight - 15 }px` )
        backgroundAnim.style.setProperty( 'background-color', menu.background_color ) 
        // backgroundAnim.style.setProperty( 'box-shadow', `0 300px 0 0 ${ menu.background_color }` )

        _menuTitle.style.setProperty( 'top', '52pt', 'important' )
        _menuTitle.style.setProperty( 'left', `${ (main.offsetLeft - 15) + 376 }px`, 'important' )
      } )
    }

    {
      /**
       * Title
       */
      // let title = document.createElement( 'DIV' )
      // data.elems.push( title )
      
      // title.style.setProperty( 'color', menuTitle.style.color )
      // title.style.setProperty( 'position', 'absolute' )
      // title.style.setProperty( 'z-index', 99 )
      // title.style.setProperty( 'top', `${ menuItemPos.y - mainPos.y }px` )
      // title.style.setProperty( 'left', `${ menuItemPos.x - mainPos.x }px` )
      // title.style.setProperty( 'font-size', '30px' )
      // title.style.setProperty( 'font-family', 'Playfair Display SC' )
      // title.style.setProperty( 'transition', '1.1s cubic-bezier(.48,.05,.73,1.03)' )
      // title.style.setProperty( '-webkit-transition', '1.1s cubic-bezier(.48,.05,.73,1.03)' )
      // title.innerHTML = menu.title
      // document.querySelector( '#main' ).appendChild( title )

      // setTimeout( () => {
      //   title.style.setProperty( 'top', 'calc(52pt + 15px)', 'important' )
      //   title.style.setProperty( 'left', '282pt', 'important' )
      // }, 10 )
    }

    {
      /**
       * hidden menu title
       */
      menuTitle.style.display = 'none'
    }

    {
      /**
       * hide menu
       */
      // menuEl.classList.add( '__hidden' )
    }

    if( callback ) {
      callback.call( '', menu, data )
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
          <HomeNav 
            appContext={ context }
            onUpdateTab={ ( menu ) => {
              let event = this
              let animateTime = 1500
              let menuTitle = menu.title.toLowerCase().replace(' ', '-');

              context.setSelectedTabBasicDetails( menu );

              AnimRedirectMenu( menu, ( menu, data ) => {
                setTimeout( () => {

                  /**
                   * Clear elements
                   */
                  data.elems.map( ( el ) => { el.remove() } )
                  history.push( `${ menuTitle }` )
                }, animateTime )
              } )
              
            } }
            menu={ context.primaryMenu } />

          
        </div>
      )}
    </MyContext.Consumer>
  );
}

export default HomePage;
