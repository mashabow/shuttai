import { chromium } from "playwright";

const STORAGE_STATE_PATH = "auth.json";

const isDev = Boolean(process.env.DEV);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 500, height: 400 });

  const textbox = page.getByRole("textbox");
  const sendButton = page.getByRole("button", { name: "Send now" });

  // 「人事労務freee」アプリで出勤の打刻をする
  await page.goto("https://app.slack.com/client/T02CW9KLLBD/D02D05JQ4V9");
  await textbox.fill("/freee_dakoku");
  await sendButton.click();
  if (!isDev) {
    const shukkinButtonHandle = await page
      .getByRole("button", { name: "出勤" })
      .elementHandle();
    await shukkinButtonHandle?.click();
    await shukkinButtonHandle?.waitForElementState("hidden");
  }

  // daily チャンネルを開いて「おはよう」を投稿
  await page.goto(
    isDev
      ? "https://app.slack.com/client/T02CW9KLLBD/D02CWBKTH8S"
      : "https://app.slack.com/client/T02CW9KLLBD/C047WUSRDSM"
  );
  await textbox.fill(":ohayo:");
  await sendButton.click();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (isDev) {
    await page.pause();
  }

  // ---------------------
  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
  await browser.close();
})();
