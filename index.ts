import { chromium } from "playwright";

const STORAGE_STATE_PATH = "auth.json";

const isDev = Boolean(process.env.DEV);
const isShukkin = process.argv[2] === "shukkin";

console.log(process.argv);

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
    const buttonHandle = await page
      .getByRole("button", { name: isShukkin ? "出勤" : "退勤" })
      .elementHandle();
    await buttonHandle?.click();
    await buttonHandle?.waitForElementState("hidden");
  }

  // daily チャンネルを開いて挨拶を投稿
  await page.goto(
    isDev
      ? "https://app.slack.com/client/T02CW9KLLBD/D02CWBKTH8S"
      : "https://app.slack.com/client/T02CW9KLLBD/C047WUSRDSM"
  );
  await textbox.fill(isShukkin ? ":ohayo:" : ":otukaresamadesu:");
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
