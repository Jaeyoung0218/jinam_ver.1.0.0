# gap-detector: UI_INTEGRATION Verification Spec

## 목적

`TW_PM_01`의 UI_INTEGRATION 단계에서 Plan vs. Reality 점검을 표준화한다.  
이번 사이클은 ITERATE 단계이며, 신규 기능 개발보다 통합 품질 검증을 우선한다.

## 적용 컨텍스트

- Framework: React / Next.js / Tailwind CSS
- Locale: Primary `zh-TW`, Secondary `ko`
- Mobile-first: 375px 기준 안정성 우선
- I18N 대규모 namespace 개편은 보류 (기존 메시지 구조 내 점진 수정)

## 판정 카테고리

- `[CRITICAL]`: 로직/통합 결함, 빌드/런타임 위험, 상태 불일치
- `[VISUAL]`: Tailwind 클래스 충돌, 반응형 붕괴, 간격/정렬 불일치
- `[I18N]`: 하드코딩 문자열, locale 전환 결함, CJK 타이포 문제
- `[SUGGESTION]`: Iterate 다음 턴 최적화 제안

## 검사 기준

### 1) React Logic Integration

- parent-child props 전달 누락/오용 여부
- 리스트 `key` 안정성
- `useEffect` 의존성으로 인한 재렌더 루프 위험
- 3단계 이상 prop drilling 구간 후보 식별

### 2) Tailwind Visual Integrity

- class 충돌 가능성 (`className` 조건식 포함)
- 고정 크기(`w-*`, `h-*`, 픽셀값)로 인한 모바일 overflow 위험
- 반응형 접두사(`sm:`, `md:`, `lg:`) 누락 후보
- CJK 본문 line-height(`text-cjk-body` / `leading-relaxed`) 적용 상태

### 3) i18n & Content

- 하드코딩 문자열 탐지 (특히 ZH-TW/KO 텍스트)
- locale 전환 시 URL query 보존 여부
- 번역 길이 증가(예: KO +15%) 시 레이아웃 붕괴 위험

### 4) Error Handling

- 로딩 스켈레톤/빈 상태/오류 폴백 존재 여부
- API 실패 시 대체 액션(예: LINE 폴백) 제공 여부

## PDCA Iterate 실행 포인트

1. Component Composition Verification
2. CJK Typography & Layout Stress Test
3. Responsive Breakpoint Analysis
4. State Consistency Check

## 실행 프로토콜

1. 입력: 최근 통합된 Page/Container + 연관 컴포넌트
2. 명령: `[CRITICAL]`, `[I18N]` 우선 분석 실행
3. 분기:
   - `[CRITICAL]` 존재 -> DO 단계 즉시 복귀
   - `[CRITICAL]` 없음 + `[VISUAL]`만 존재 -> Tailwind 보정 스니펫 생성
   - 주요 이슈 없음 -> End-to-End Testing 진행

## 자동화 진입점

- `npm run verify:gap`
- 결과 파일: `docs/verification/reports/ui-integration-iterate-001.md`
