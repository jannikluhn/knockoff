export const corsProxy = "http://localhost:8081/";

export function getCORSProxyURL(url) {
  return corsProxy + url;
}
