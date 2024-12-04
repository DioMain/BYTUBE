import SelectOptions, { SelectOrderBy } from "@type/SelectOptions";
import { makeAutoObservable } from "mobx";

enum MainPageFilter {
  Main,
  Subs,
  Favorite,
}

class SearchDataStore {
  selectOptions: SelectOptions = {
    skip: 0,
    take: 8,
  };

  mainPageFilter: MainPageFilter = MainPageFilter.Main;

  constructor() {
    makeAutoObservable(this);
  }

  setOptions = (value: SelectOptions) => {
    this.selectOptions = value;
  };

  setMainPageFilter = (value: MainPageFilter) => {
    this.mainPageFilter = value;
  };

  setFilter = (value: SelectOrderBy) => {
    if (this.selectOptions === undefined) return;

    this.selectOptions!.orderBy = value;
  };
}

export default new SearchDataStore();

export { MainPageFilter };
