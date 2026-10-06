import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";
import "../localization/i18n";
import i18n, { LANGUAGE_STORAGE_KEY } from "../localization/i18n";

beforeEach(async () => {
  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  await i18n.changeLanguage("en");
});

Object.assign(globalThis, { TextDecoder, TextEncoder });
