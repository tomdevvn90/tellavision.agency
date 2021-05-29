import styled from "styled-components";
import {SubPageContentType} from "../../@types/sub-page-content-type";

interface SubMenuTitlePropType {
    currentTabSubPageData: SubPageContentType
}

const SubMenuTitle = styled('div')<SubMenuTitlePropType>`
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

export default SubMenuTitle;
