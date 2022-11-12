import { chromium } from "playwright";

const STORAGE_STATE_PATH = "auth.json";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
  });
  const page = await context.newPage();
  await page.goto("https://app.slack.com/client/T02CW9KLLBD/D02CWBKTH8S");
  await page.getByRole("textbox").fill(":ohayo:");

  await page.evaluate(async () => {
    const sendButton = document.querySelector('[aria-label="Send now"]');
    sendButton?.insertAdjacentHTML("afterbegin", "出勤");
    return new Promise((resolve) =>
      sendButton?.addEventListener("click", resolve)
    );
  });

  await page.getByRole("textbox").fill(":yay:");

  // Pause the page, and start recording manually.
  await page.pause();

  // ---------------------
  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
  await browser.close();
})();
