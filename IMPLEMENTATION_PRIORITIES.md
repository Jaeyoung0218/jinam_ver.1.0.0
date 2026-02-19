# I18N 보류 기반 UX/API 우선순위

이 문서는 `I18N namespace 정리`를 보류한 상태에서, 현재 버전에 즉시 반영할 핵심 UX/API 우선순위를 확정한다.

## 적용 원칙

- I18N 리팩터링(`common/concert/map/tips` 분리, 메시지 키 재구성)은 이번 범위에서 제외한다.
- 사용자 체감이 큰 UX와 데이터 신뢰도에 직접 연결되는 API 항목을 먼저 처리한다.
- 단계별 완료 기준을 통과해야 다음 단계로 이동한다.

## 우선순위 확정 (High -> Low)

### P1. 상세 CTA 동선 복구 (가장 먼저)

- 대상: `src/app/[locale]/concerts/[concertId]/page.tsx`
- 반영 범위:
  - CTA 우선순위를 `티켓 -> LINE -> 주소 복사`로 고정
  - `Travel Tips (Notion)` 보조 버튼 제공
- 완료 기준:
  - 상세 화면에서 상기 4개 액션이 동시에 보이고 클릭 동작이 정상이다.

### P2. 홈 진입점 강화

- 대상: `src/app/[locale]/page.tsx`
- 반영 범위:
  - 우하단 `Survival Map` 플로팅 진입점 노출
- 완료 기준:
  - 홈에서 플로팅 버튼이 항상 노출되고 외부 링크 이동이 동작한다.

### P3. Locker API/위젯 신뢰도 강화

- 대상:
  - `src/app/api/lockers/route.ts`
  - `src/components/map/locker-widget.tsx`
- 반영 범위:
  - API 실패 시 LINE 폴백 액션
  - KSPO 기준 거리순 토글 정렬
  - 30초 단위 재검증 및 Last updated 표시
  - API `revalidate = 30`
- 완료 기준:
  - 정상/실패 케이스 모두 사용자 액션이 끊기지 않는다.
  - 최신 시각과 정렬 동작이 UI에서 확인된다.

### P4. 공연 API 정합 보강

- 대상:
  - `src/app/api/concerts/route.ts`
  - `src/types/concert.ts` (필요 시)
- 반영 범위:
  - `/api/concerts` 필터/정렬 응답 스키마를 실제 소비 화면과 일치시킨다.
- 완료 기준:
  - 날짜/장소/정렬 쿼리 조합에서 스키마 불일치가 없다.

## 제외 항목 (이번 턴)

- I18N namespace 구조 정리 및 메시지 키 대규모 개편
- locale별 텍스트 체계 통합 리팩터링

## 검증 기준

- `npm run lint`
- `npm run build`
- 홈/상세/락커 핵심 플로우 수동 점검
