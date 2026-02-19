# UI_INTEGRATION 1차 점검 대상 (CRITICAL/I18N)

## 고정 대상 파일

1. `src/app/[locale]/page.tsx`
2. `src/app/[locale]/concerts/page.tsx`
3. `src/app/[locale]/concerts/[concertId]/page.tsx`
4. `src/components/ui/language-toggle.tsx`
5. `src/components/map/locker-widget.tsx`

## 선정 근거

- 현재 빌드의 핵심 사용자 동선(홈 -> 목록 -> 상세)을 직접 구성한다.
- locale 전환 및 query 보존 리스크가 집중되어 있다.
- 하드코딩 문자열과 CJK 타이포 불균일이 반복적으로 발생한 구간이다.
- API 상태(락커)와 UX 폴백(오류/로딩)이 동시에 드러나는 화면이다.

## 점검 우선순위

- P0: locale 전환 시 query 유실 여부 (`language-toggle`)
- P1: 하드코딩 문자열 및 번역 키 누락
- P1: CJK line-height/word-break 누락 후보
- P2: 로딩/빈 상태/오류 폴백의 일관성
