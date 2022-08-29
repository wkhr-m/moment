# moment
単語帳
Google SheetsとGoogleDriveから単語帳の情報をインポートする(ようになりたいな)

## 使用しているAPI
  - [WordsAPI](https://rapidapi.com/dpventures/api/wordsapi)
    - 英単語の意味を調べるAPI

## デプロイ
GitHub ActionsからGAEにデプロイ

## 作成したサービスアカウント
- github-actions@サービスアカウント
  - GitHubからデプロイするためのアカウント
  - 付与したロール
    - App Engine サービス管理者
    - App Engine デプロイ担当者
    - Cloud Build サービス アカウント
    - Cloud Datastore インデックス管理者
    - Storage オブジェクト閲覧者
    - サービス アカウント ユーザー
- spreadsheet-reader@サービスアカウント
  - Google Sheetssから内容を読むためのアカウント
  - 付与したロール


## GitHubに登録した秘密キー
Repository > Settings > secrets > Actions
- GCP_PROJECT_ID
  - GCPのプロジェクトID
- GCP_SA_KEY
  - github-actions@サービスアカウントのJSONキー
- API_KEY_FOR_BACK
  - Google Sheets APIを許可したAPIキー
- SA_KEY_FOR_BACK
  - spreadsheet-reader@サービスアカウントのJSONキー
- ENV_FOR_FRONT
  - firebaseのキーとWordsAPIのキー

## アイコン
[FLAT ICON DESIGN](http://flat-icon-design.com/)を利用