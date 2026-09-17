
const BASEURL = import.meta.env.VITE_API_URL;
const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY_SECRET;
const AI_TESTCASE_BASEURL = import.meta.env.VITE_AI_TESTCASE_API_URL;

const config = {
  BASEURL: BASEURL,
  cryptoKey: CRYPTO_KEY,
  AI_TESTCASE_BASEURL: AI_TESTCASE_BASEURL,

  headersCommon: {
    "Content-Type": "application/json"
  },

};

export default config;
