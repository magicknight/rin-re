import { types, flow, getEnv } from "mobx-state-tree";
import uuid from "uuid/v4";

const fetch = () => {
  return types
    .model({
      state: types.optional(
        types.enumeration(["initial", "loading", "done", "error"]),
        "initial",
      ),
    })
    .actions(self => {
      let currentId = null;

      return {
        fetch: flow(function*(factory) {
          const http = getEnv(self).http;

          const id = uuid();
          currentId = id;

          self.state = "loading";
          try {
            const response = yield factory(http);
            if (currentId === id) {
              self.state = "done";
            }
            return response.data;
          } catch (error) {
            if (currentId === id) {
              self.state = "error";
            }
            throw error;
          }
        }),
      };
    });
};

export default fetch;
