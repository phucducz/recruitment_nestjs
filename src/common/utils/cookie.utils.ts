export const getCookieValue = (cookieString: string, cookieName: string) => {
  const cookieStringSplited: string[] = cookieString.split('; ');
  const name = `${cookieName}=`;

  for (let value of cookieStringSplited)
    if (value.startsWith(name)) return value.substring(name.length);

  return null;
};
