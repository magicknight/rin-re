import React from "react";
import { inject, observer } from "mobx-react";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import SearchIcon from "react-icons/lib/md/search";
import RSSFeedIcon from "react-icons/lib/md/rss-feed";

import * as link from "../utils/link";
import injectSearchParams from "../utils/injectSearchParams";

import IconButton from "../views/IconButton";
import SectionTitle from "../views/SectionTitle";
import SearchEditor from "../views/SearchEditor";
import TorrentList from "../views/TorrentList";

import SearchContainer from "../containers/SearchContainer";

class Search extends React.Component {
  get paginator() {
    return this.props.store.searchPaginator;
  }

  get query() {
    return this.props.searchParams.get("query") || "";
  }

  get page() {
    return Number(this.props.searchParams.get("page")) || 1;
  }

  handleSubmit = query => {
    if (query) {
      this.props.history.push(`/search?query=${encodeURIComponent(query)}`);
    } else {
      this.props.history.push("/search");
    }
  };

  handlePageChange = page => {
    this.props.history.push(
      `/search?query=${encodeURIComponent(this.query)}&page=${page}`,
    );
  };

  render() {
    const { t } = this.props;
    return (
      <div className="Search">
        <Helmet title={t("Search")} />

        <SearchEditor
          key={this.query}
          autoFocus={!this.query}
          defaultValue={this.query}
          onSubmit={this.handleSubmit}
        />

        {this.query && (
          <React.Fragment>
            <SectionTitle
              icon={SearchIcon}
              title={
                t("Search Results") +
                (this.paginator.count ? ` (${this.paginator.count})` : "")
              }
              actions={
                <IconButton
                  component="a"
                  target="_blank"
                  href={link.searchRSS(this.query)}
                  title={t("RSS Feed")}
                  aria-label={t("RSS Feed")}
                >
                  <RSSFeedIcon />
                </IconButton>
              }
            />
            <SearchContainer
              store={this.paginator}
              query={this.query}
              page={this.page}
              onPageChange={this.handlePageChange}
            >
              {torrents => <TorrentList list={torrents} />}
            </SearchContainer>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default translate()(
  injectSearchParams(inject("store")(observer(Search))),
);
