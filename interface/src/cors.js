const corsProxy = "https://cors.knockoff.lol/";
const corsWhitelist = {
  "api.ethlings.com": true,
};

export function getCORSProxyURL(url) {
  const urlObj = new URL(url);
  if (corsWhitelist[urlObj.host]) {
    return url;
  }
  return corsProxy + url;
}
