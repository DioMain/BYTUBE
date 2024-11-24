import SelectOptions from "@type/SelectOptions";
import { makeAutoObservable } from "mobx";

enum MainPageFilter {
  Main,
  Subs,
  Favorite,
}

class SearchDataStore {
  selectOptions?: SelectOptions = undefined;

  mainPageFilter: MainPageFilter = MainPageFilter.Main;

  constructor() {
    makeAutoObservable(this);
  }

  setOptions = (value: SelectOptions) => {
    this.selectOptions = value;
  };

  dropOptions = () => {
    this.selectOptions = undefined;
  };

  setMainPageFilter = (value: MainPageFilter) => {
    this.mainPageFilter = value;
  };
}

export default new SearchDataStore();

export { MainPageFilter };
