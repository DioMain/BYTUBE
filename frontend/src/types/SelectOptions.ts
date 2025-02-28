class SelectOptions {
  ignore?: string[];
  searchPattern?: string; //SearchPattern

  take: number = 8;
  skip: number = 0;

  favorite?: boolean = false;
  subscribes?: boolean = false;

  orderBy?: SelectOrderBy = SelectOrderBy.None;

  asAdmin?: boolean = false;
}

enum SelectOrderBy {
  None,
  Creation,
  CreationDesc,
  Reports,
  ReportsDesc,
  Views,
}

export default SelectOptions;

export { SelectOrderBy };
