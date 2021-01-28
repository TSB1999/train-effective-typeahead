import { extendObservable } from "mobx";

/**
 * UserStore
 */
class IndexStore {
  constructor() {
    extendObservable(this, {
      index: [0],
      cache: new Set(),
    });
  }
}

export default new IndexStore();
