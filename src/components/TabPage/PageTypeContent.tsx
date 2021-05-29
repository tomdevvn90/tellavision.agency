import React from "react";
import PageDataDiv from "./PageDataDiv";
import ReactHtmlParser from "react-html-parser";

interface PageTypeContentPropType {
    pageContent: any;
}

const PageTypeContent: React.FC<PageTypeContentPropType> = ({ pageContent }) => {
    return (<div
        className="menu-item-main-content contact-page"
        style={{
            display: pageContent ? "flex" : "none",
            width: '40%'
        }}
    >
        {pageContent && pageContent.content && pageContent.content.rendered &&
        <PageDataDiv
            pageData={pageContent}>
            {ReactHtmlParser(pageContent.content.rendered)}
        </PageDataDiv>}
    </div>)
};

export default PageTypeContent;
