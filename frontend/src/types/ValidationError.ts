class ValidationError {
  type: string = "";
  title: string = "";
  status: number = 400;

  errors: any;

  constructor(error: any) {
    this.type = error.type;
    this.title = error.title;
    this.status = error.status;

    this.errors = error.errors;
  }

  getFirstError(): string {
    for (const key in this.errors) {
      const element = this.errors[key];

      if (element.length > 0) return element[0] as string;
    }

    return "";
  }
}

export default ValidationError;
