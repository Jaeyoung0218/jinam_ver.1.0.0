# UI Integration Iterate Report Template

- Generated at: <ISO_DATETIME>
- Targets:
  - src/app/[locale]/page.tsx
  - src/app/[locale]/concerts/page.tsx
  - src/app/[locale]/concerts/[concertId]/page.tsx
  - src/components/ui/language-toggle.tsx
  - src/components/map/locker-widget.tsx

## [CRITICAL]
- <logic/build/runtime issue>

## [I18N]
- <hard-coded strings / locale switch / layout expansion risk>

## [VISUAL]
- <tailwind responsiveness / cjk rhythm / spacing issue>

## [SUGGESTION]
- <iterate optimization suggestion>

## Next Fix Batch
- src/components/ui/language-toggle.tsx: locale 전환 시 query 파라미터 보존
- src/app/[locale]/concerts/[concertId]/page.tsx: 하드코딩 문자열 messages 키 치환
- src/components/map/locker-widget.tsx: 오류/정렬/업데이트 문구 i18n 키 분리

## 결론
- <DO 복귀 | E2E 진행 가능>
