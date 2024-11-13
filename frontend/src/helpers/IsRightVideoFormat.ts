const allowedMimes = ["video/mp4"];

function IsRightVideoFormat(input: HTMLInputElement | null): boolean {
  try {
    let type = input?.files![0].type;
    let have = false;

    for (const element of allowedMimes) {
      if (type === element) have = true;
    }

    return have;
  } catch {
    return false;
  }
}

export default IsRightVideoFormat;
