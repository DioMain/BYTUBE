class SelectOptions {
  ignore?: number[];
  namePattern?: string;

  take: number = 8;
  skip: number = 0;

  favorite?: boolean = false;
  subscribes?: boolean = false;

  orderBy?: SelectOrderBy = SelectOrderBy.None;
}

enum SelectOrderBy {
  None,
  Creation,
  CreationDesc,
  Reports,
  ReportsDesc,
}

export default SelectOptions;

export { SelectOrderBy };
