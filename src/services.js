import axios from "axios";

// const API_ENDPOINT = "http://192.168.0.158/tellavision/wp-json/";
// const API_ENDPOINT = "https://tellvisionagency.aliansoftware.net/wp-json/";
const API_ENDPOINT = "https://admin.tellavision.agency/wp-json/";
const API = {
  fetchLogo: function () {
    return axios.get(API_ENDPOINT + `mytheme/v1/settings/`);
  },
  fetchHomeContent: function () {
    return axios.get(API_ENDPOINT + "wp/v2/pages/23/");
  },
  fetchFeaturedImageUrl: function (id) {
    return axios.get(API_ENDPOINT + "wp/v2/media/" + id);
  },
  fetchPrimaryMenu: function () {
    return axios.get(API_ENDPOINT + "menus/v1/locations/primary-menu");
  },
  fetchAboutUsContent: function () {
    return axios.get(API_ENDPOINT + "menus/v1/locations/about-menu");
  },
  fetchMenuItemStyle: function () {
    return axios.get(API_ENDPOINT + "acf/v2/options/");
  },
  fetchMenuItemMainPageData: function (menuTitle) {
    return axios.get(API_ENDPOINT + "wp/v2/" + menuTitle + "/?per_page=50");
  },
  fetchMenuItemSubPageData: function (menuTitle, subMenuId) {
    return axios.get(API_ENDPOINT + "wp/v2/" + menuTitle + '/' + subMenuId);
  },
  fetchPageContent: function (pageId) {
    return axios.get(API_ENDPOINT + "wp/v2/pages/" + pageId);
  }
};

export default API;
