import styled from "styled-components";
import {SubPageContentType} from "../../@types/sub-page-content-type";

interface PortfolioListPropType {
    currentTabSubPageData:  SubPageContentType
}

const PortfolioList = styled('ul')<PortfolioListPropType>`
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

export default PortfolioList;
