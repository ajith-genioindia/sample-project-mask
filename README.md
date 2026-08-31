# sample-coupon-master (proper sample project)

⚠️ **This is a throwaway sample project.** It exists only to test the
`test-doc-generator` flow end-to-end — including the **detailed, field-level**
Japanese test doc generator — before pointing it at a real project.

## What's in here

A small but realistic CRUD feature (Reward Coupon Master), matching the
structure of a real 単体テスト仕様書 (List → Detail → Register → Confirm):

- `src/components/CouponList.jsx` — search (クーポンID / クーポン名称 / 期間 / 種別 / 承認),
  sortable table, pagination, role-based buttons (新規登録・編集・削除)
- `src/components/CouponDetail.jsx` — read-only detail view + 一覧へ戻る / 編集 buttons
- `src/components/CouponForm.jsx` — register/edit input form with validation
- `src/components/CouponConfirm.jsx` — confirmation screen before submit
- `src/api/couponApi.js` — fetch calls to a (fake) backend
- `src/__tests__/CouponList.test.js`, `CouponForm.test.js` — jest tests
- `.env` — **fake/dummy values only** (excluded via `.gitignore`, never gets pushed)
- `screen_spec.json` — field-by-field description of the 4 screens above,
  written to match this project's actual components exactly
- `単体テスト仕様書.xlsx` — the detailed, 6-sheet test doc already generated
  from `screen_spec.json` (open it and compare against your own company template)

## How to use this to test the flow

**Locally:**
```bash
cd test-doc-generator
pip install -r requirements.txt

# Basic analysis (detects language/framework/test files)
python scripts/analyze_project.py --repo-path ../sample-react-project --out analysis.json

# Simple stub doc (one sheet, generic — good for projects with no screen_spec yet)
python scripts/generate_test_doc_ja.py --analysis analysis.json \
  --design-doc "設計書サンプル.xlsx" --owner "カルティク" --out simple_doc.xlsx

# Detailed, 6-sheet doc driven by screen_spec.json (recommended — this is what
# was used to generate the 単体テスト仕様書.xlsx already sitting in this folder)
python scripts/generate_test_doc_ja_detailed.py \
  --spec ../sample-react-project/screen_spec.json \
  --out ../sample-react-project/単体テスト仕様書.xlsx
```

**On GitHub:** same steps as the main README — create a throwaway repo, push
this folder (the real `.env` stays out thanks to `.gitignore`), copy the
workflow file from `sample-consumer-repo/`, and test a push + a merge.

## Using this pattern on your real project

1. Copy `screen_spec.json` into your real project repo.
2. Edit the `fields`, `list_buttons`, `detail_buttons`, `form_buttons`,
   `confirm_buttons` sections to match your actual screen(s) — field names,
   widget types (`text` / `date` / `radio`), default values, and options.
3. Point `generate_test_doc_ja_detailed.py --spec` at that file.
4. If you have multiple screens/features, keep one `screen_spec.json` per
   feature (e.g. `screen_spec_coupon.json`, `screen_spec_user.json`).
