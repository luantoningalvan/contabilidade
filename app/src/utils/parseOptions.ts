export const parseOptions = (options: any) => {
  let params: string[] = [];

  Object.entries(options).map(([key, value]) => {
    if (
      !!value &&
      ["string", "number"].includes(typeof value) &&
      value !== ""
    ) {
      params.push(`${key}=${value}`);
    }
  });

  return params.join("&");
};
