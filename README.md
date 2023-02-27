# shuttai

Slack 上で freee 打刻して挨拶 with [Playwright Library](https://playwright.dev/docs/library)

## Setup

1. `$ yarn install`
2. `$ yarn login` すると Slack のログイン画面が開くので、ログインしてウィンドウを閉じる
   - ログインした状態の Cookie が `auth.json` に保存される
3. `index.ts` を適宜カスタマイズ

## Usage

出勤 & おはよう

```console
$ yarn shukkin
```

退勤 & お疲れ様です

```console
$ yarn taikin
```
