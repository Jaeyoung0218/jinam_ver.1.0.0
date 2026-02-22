# -*- coding: utf-8 -*-
"""
KSPO 콘서트 JSON 템플릿 생성기 (년도+분기 파일명 반영, 3개 이상 입력용)
- 콘서트 정보 직접 입력용 JSON 템플릿을 저장합니다.
- 템플릿 구조: [concerts] 배열 내 객체 구조(name, place, date, time, link)
- 최소 3개 이상의 예시가 포함된 템플릿입니다.
- 파일명은 'kspo_concert_26_Q1.json'과 같은 방식으로 생성됩니다.
"""

import json
from pathlib import Path

# === 설정값: 아래 값만 변경하면 됨 ===
YEAR_SHORT = "26"  # 연도 마지막 2자리 (예: 2026년 → "26")
QUARTER = "Q1"     # 분기 (예: "Q1", "Q2", "Q3", "Q4")
# ================================

# JSON 파일 저장 위치(현재 스크립트 위치 기준)
OUTPUT_DIR = Path(__file__).resolve().parent
FILE_NAME = f"kspo_concert_{YEAR_SHORT}_{QUARTER}.json"
JSON_PATH = OUTPUT_DIR / FILE_NAME

TEMPLATE = {
    "concerts": [
        {
            "name": "2026 TXT MOA CON",
            "place": "KSPO DOME",
            "date": ["2026-02-27", "2026-02-28", "2026-03-01"],
            "time": ["19:00", "18:00", "17:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5064"
        },
        {
            "name": "wave to earth - 사랑으로 0.3",
            "place": "올림픽홀",
            "date": ["2026-02-27", "2026-02-28", "2026-03-01"],
            "time": ["20:00", "18:00", "17:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5065"
        },
        {
            "name": "2026 i-dle WORLD TOUR [Syncopation] IN SEOUL",
            "place": "KSPO DOME",
            "date": ["2026-02-21", "2026-02-22"],
            "time": ["18:00", "17:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5059"
        },
        {
            "name": "2026 Hearts2Hearts FANMEETING 〈HEARTS 2 HOUSE〉",
            "place": "올림픽홀",
            "date": ["2026-02-21", "2026-02-22"],
            "time": ["17:00", "16:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5060"
        },
        {
            "name": "2026 i-dle WORLD TOUR [Syncopation] IN SEOUL",
            "place": "KSPO DOME",
            "date": ["2026-02-21", "2026-02-22"],
            "time": ["18:00", "17:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5059"
        },
        {
            "name": "2026 i-dle WORLD TOUR [Syncopation] IN SEOUL",
            "place": "KSPO DOME",
            "date": ["2026-02-21", "2026-02-22"],
            "time": ["18:00", "17:00"],
            "link": "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoView.es?mid=a20301010100&evtSeq=5059"
        }
        # 필요한 만큼 객체를 복사해서 사용할 수 있습니다.
    ]
}

def main():
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(TEMPLATE, f, ensure_ascii=False, indent=2)
    print(f"콘서트 JSON 템플릿이 생성되었습니다: {JSON_PATH}")
    print("아래와 같은 형식으로 concerts 배열에 값을 직접 입력하세요:\n")
    print(json.dumps(TEMPLATE, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
