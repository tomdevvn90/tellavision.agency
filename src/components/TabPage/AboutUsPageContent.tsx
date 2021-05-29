import React from "react";
import PageDataDiv from "./PageDataDiv";
import ReactHtmlParser from "react-html-parser";
import {AboutMenuContent} from "../../@types/about-menu";
import {AboutSubPageData} from "../../@types/about-sub-page-data";

interface AboutUsPageContentPropTypes {
    pageContent?: AboutMenuContent;
    subPageContent?: any;
    getMenuItemContent?: any;
    selectedAboutPage: string;
}

const AboutUsPageContent: React.FC<AboutUsPageContentPropTypes> = ({ pageContent, subPageContent, getMenuItemContent, selectedAboutPage }) => {
    return (<div
        className="menu-item-main-content about_page"
        style={{
            display: pageContent ? "flex" : "none",
            alignItems: "flex-start",
            height: "462px",

        }}
    >
        <div className="menu_list">
            <ul>
                {pageContent?.items && pageContent.items.map(
                    (data, index: number) => (
                        <li key={index} onClick={(event) => getMenuItemContent(event, data)} className={
                            data.object_id === selectedAboutPage
                                ? "active"
                                : ""
                        }>
                            {data.title}
                        </li>
                    )
                )}
            </ul>
        </div>
        {subPageContent && subPageContent.content && subPageContent.content.rendered &&
        <PageDataDiv
            pageData={subPageContent}>
            {ReactHtmlParser(subPageContent.content.rendered)}
        </PageDataDiv>}
    </div>)
}

export default AboutUsPageContent;
