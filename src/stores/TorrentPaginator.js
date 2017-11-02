import { types } from "mobx-state-tree";

import api from "./utils/api";

const TorrentItem = types.model({
  id: types.identifier(),
  title: types.string,
});

const TorrentPage = types.array(TorrentItem);

const TorrentPaginator = types
  .model({
    pageCount: 0,
    pages: types.optional(types.map(TorrentPage), {}),
  })
  .views(self => ({
    has: page => self.pages.has(page),
    get: page => self.pages.get(page),
  }))
  .props(api.props)
  .extend(self =>
    api(self, function*({ api, token }, page) {
      const request = api.torrents.getPage(page, { cancelToken: token });
      const result = (yield request).data;
      self.pageCount = result.pageCount;
      self.pages.set(page, result.torrents);
    }),
  );

export default types.optional(TorrentPaginator, {});
