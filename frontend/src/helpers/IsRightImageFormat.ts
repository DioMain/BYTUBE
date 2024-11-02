const imageTypes = ["png", "jpg", "jpeg"];

function IsRightImageFormat(input: HTMLInputElement | null): boolean {
  try {
    let names = input?.files?.item(0)?.name.split(".")!;

    let have = false;

    for (const element of imageTypes) {
      if (names[names.length - 1] === element) have = true;
    }

    return have;
  } catch {
    return false;
  }
}

export default IsRightImageFormat;
