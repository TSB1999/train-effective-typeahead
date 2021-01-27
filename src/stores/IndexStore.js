import { extendObservable } from "mobx";

/**
 * UserStore
 */
class IndexStore {
  constructor() {
    extendObservable(this, {
      index: [0]
    });
  }
}

export default new IndexStore();
