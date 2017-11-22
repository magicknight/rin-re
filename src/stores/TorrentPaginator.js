import { types, flow } from "mobx-state-tree";

import Fetch from "./Fetch";

const TorrentItem = types.model({
  id: types.identifier(),
  title: types.string,
  publishTime: types.string,
  uploader: types.model({
    id: types.identifier(),
    username: types.string,
  }),
  team: types.maybe(
    types.model({
      id: types.identifier(),
      name: types.string,
    }),
  ),
  downloads: types.number,
  leechers: types.number,
  seeders: types.number,
  finished: types.number,
});

const TorrentPage = types.array(TorrentItem);

const TorrentPaginator = types.compose(
  Fetch,
  types
    .model({
      pageCount: 0,
      pages: types.optional(types.map(TorrentPage), {}),
    })
    .views(self => ({
      has: page => self.pages.has(page),
      get: page => self.pages.get(page),
    }))
    .actions(self => ({
      load: flow(function*(page) {
        const result = yield self.fetch(http =>
          http.get(`/api/v2/torrent/page/${page}`),
        );
        self.pageCount = result.pageCount;
        self.pages.set(page, result.torrents);
      }),
    })),
);

export default types.optional(TorrentPaginator, {});
