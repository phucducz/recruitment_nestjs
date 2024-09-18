export const getCookieValue = (cookieString: string, cookieName: string) => {
  const cookieStringSplited: string[] = cookieString.split('; ');

  for (let value of cookieStringSplited)
    if (value.startsWith(cookieName)) return value.substring(cookieName.length);

  return null;
};
