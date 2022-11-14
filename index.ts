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

  // チャネルを開いて「おはよう」を入力
  await page.goto(
    isDev
      ? "https://app.slack.com/client/T02CW9KLLBD/D02CWBKTH8S"
      : "https://app.slack.com/client/T02CW9KLLBD/C047WUSRDSM"
  );
  await textbox.fill(":ohayo:");
  await textbox.focus();

  // 手動でのクリックを待つ
  await sendButton.evaluate(async (el) => {
    el.insertAdjacentHTML("afterbegin", "出勤");
    return new Promise((resolve) => el.addEventListener("click", resolve));
  });

  // 「人事労務freee」アプリで出勤の打刻をする

  await page.goto("https://app.slack.com/client/T02CW9KLLBD/D02D05JQ4V9");
  // 最後のメッセージの ID を取得
  const lastMessageId = await page
    .getByRole("listitem")
    .last()
    .getAttribute("id");
  // スラッシュコマンド `/freee_dakoku` を実行
  await textbox.fill("/freee_dakoku");
  await sendButton.click();

  // 新たな [出勤] ボタンの出現を待ってクリック
  const shukkinButton = page
    .locator(`${lastMessageId} + *`)
    .getByRole("button", { name: "出勤" });
  if (!isDev) {
    await shukkinButton.click();
  }

  if (isDev) {
    await page.pause();
  }

  // ---------------------
  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
  await browser.close();
})();
