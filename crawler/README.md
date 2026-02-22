# Crawler Pipeline

## Install

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install
```

## Run

```bash
python run_pipeline.py
```

## Required ENV

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (optional, for ZH-TW translation)

---

## KSPO 콘서트 엑셀 → JSON 변환

엑셀(`콘서트명`, `콘서트 장소`, `콘서트 날짜`, `콘서트 시간`, 상세 링크)을 JSON으로 저장하고, 월별·키워드 주석을 붙입니다.

```bash
# 기본 경로(바탕화면 KSPO 콘서트 폴더) 사용
python excel_to_json.py

# 엑셀 경로 지정
python excel_to_json.py "C:\경로\kspo_concert_3months.xlsx"
```

**출력 파일**
- `kspo_concert_3months.json` — 표준 JSON
- `kspo_concert_3months.jsonc` — JSON + 월별/키워드 주석

**콘서트 썸네일 폴더**
- `crawler/concert_thumbnails` — 썸네일 이미지 저장 경로
- 절대 경로: 프로젝트 내 `jinam_ver.1.0.0-main\crawler\concert_thumbnails`
