import crypto from "crypto";

const generateUniqueNumber = async (
  prefix: string,
  digits: number,
  exists: (value: string) => Promise<boolean>
): Promise<string> => {
  let value: string;
  let alreadyExists: boolean;

  do {
    const randomDigits = crypto
      .randomInt(0, 10 ** digits)
      .toString()
      .padStart(digits, "0");
    value = `${prefix}-${randomDigits}`;
    alreadyExists = await exists(value);
  } while (alreadyExists);

  return value;
};

export default generateUniqueNumber;
