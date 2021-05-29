export interface SubPageContentType {
    id:             number;
    date:           Date;
    date_gmt:       Date;
    guid:           GUID;
    modified:       Date;
    modified_gmt:   Date;
    slug:           string;
    status:         string;
    type:           string;
    link:           string;
    title:          GUID;
    content:        Content;
    excerpt:        Content;
    author:         number;
    featured_media: number;
    comment_status: string;
    ping_status:    string;
    template:       string;
    acf:            Acf;
    _links:         Links;
}

export interface Links {
    self:            About[];
    collection:      About[];
    about:           About[];
    author:          Author[];
    replies:         Author[];
    "wp:attachment": About[];
    curies:          Cury[];
}

export interface About {
    href: string;
}

export interface Author {
    embeddable: boolean;
    href:       string;
}

export interface Cury {
    name:      string;
    href:      string;
    templated: boolean;
}

export interface Acf {
    add_slider_data:                   AddSliderDatum[] | boolean;
    title_css_settings:                PostAttributeListingTypography;
    typography:                        PostAttributeListingTypography;
    background_color:                  string;
    post_attribute_listing_typography: PostAttributeListingTypography;
    navigation_arrow_color:            NavigationArrowColor;
    featured_image_gallery:            boolean;
}

export interface AddSliderDatum {
    add_attribute_name:        string;
    add_content_for_attribute: AddContentForAttribute[];
}

export interface AddContentForAttribute {
    select_content_type: SelectContentType;
    add_attribute_data:  AddAttributeData;
}

export interface AddAttributeData {
    add_attribute_image:   string;
    add_attribute_content: string;
    add_attribute_link:    string;
}

export enum SelectContentType {
    Image = "Image",
    URL = "Url",
}

export interface NavigationArrowColor {
    text_color: string;
}

export interface PostAttributeListingTypography {
    font_size:       string;
    font_family:     string;
    text_color:      string;
    text_transform?: string;
    font_weight?:    string;
}

export interface Content {
    rendered:  string;
    protected: boolean;
}

export interface GUID {
    rendered: string;
}
