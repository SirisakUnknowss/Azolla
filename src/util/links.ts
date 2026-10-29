/**
 * Every link out of the app lands on the GitHub Pages site, whose path is the
 * repository name. Keep `SITE` in step with `experiments.baseUrl` in app.json —
 * if the two drift, the web build serves one path while these links point at
 * another.
 */
const SITE = 'https://sirisakunknowss.github.io/Azolla';

export const PRIVACY_URL = `${SITE}/privacy.html`;
export const TERMS_URL = `${SITE}/terms.html`;
/** The PromptPay "buy me a coffee" page. */
export const COFFEE_URL = `${SITE}/coffee.html`;
