export interface AboutMenuContent {
    term_id:          number;
    name:             string;
    slug:             string;
    term_group:       number;
    term_taxonomy_id: number;
    taxonomy:         string;
    description:      string;
    parent:           number;
    count:            number;
    filter:           string;
    items:            AboutMenuItem[];
}

export interface AboutMenuItem {
    ID:                    number;
    post_author:           string;
    post_date:             Date;
    post_date_gmt:         Date;
    post_content:          string;
    post_title:            string;
    post_excerpt:          string;
    post_status:           string;
    comment_status:        string;
    ping_status:           string;
    post_password:         string;
    post_name:             string;
    to_ping:               string;
    pinged:                string;
    post_modified:         Date;
    post_modified_gmt:     Date;
    post_content_filtered: string;
    post_parent:           number;
    guid:                  string;
    menu_order:            number;
    post_type:             string;
    post_mime_type:        string;
    comment_count:         string;
    filter:                string;
    db_id:                 number;
    menu_item_parent:      string;
    object_id:             string;
    object:                string;
    type:                  string;
    type_label:            string;
    url:                   string;
    title:                 string;
    target:                string;
    attr_title:            string;
    description:           string;
    classes:               string[];
    xfn:                   string;
    slug:                  string;
}
