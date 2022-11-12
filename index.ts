import { chromium } from "playwright";

const STORAGE_STATE_PATH = "auth.json";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 500, height: 400 });

  const textbox = page.getByRole("textbox");
  const sendButton = page.getByRole("button", { name: "Send now" });

  // チャネルを開いて「おはよう」を入力
  await page.goto("https://app.slack.com/client/T02CW9KLLBD/D02CWBKTH8S");
  await textbox.fill(":ohayo:");
  await textbox.focus();

  // クリックを待つ
  await sendButton.evaluate(async (el) => {
    el.insertAdjacentHTML("afterbegin", "出勤");
    return new Promise((resolve) => el.addEventListener("click", resolve));
  });

  // 「人事労務freee」アプリで出勤の打刻をする
  await page.goto("https://app.slack.com/client/T02CW9KLLBD/D02D05JQ4V9");
  await page.getByRole("textbox").fill("/freee_dakoku");
  await sendButton.click();
  // // 出勤ボタンをクリック
  // await page.getByRole("button", { name: "出勤" }).click();

  // Pause the page, and start recording manually.
  await page.pause();

  // ---------------------
  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
  await browser.close();
})();
