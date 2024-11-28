class SelectOptions {
  ignore?: number[];
  namePattern?: string;

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
}

export default SelectOptions;

export { SelectOrderBy };
