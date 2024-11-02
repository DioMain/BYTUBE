function GetFileUrl(input: HTMLInputElement | null): string {
  try {
    return URL.createObjectURL(input?.files?.item(0) as Blob);
  } catch {
    return "";
  }
}

export default GetFileUrl;
