import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/concerts/page.tsx",
  "src/app/[locale]/concerts/[concertId]/page.tsx",
  "src/components/ui/language-toggle.tsx",
  "src/components/map/locker-widget.tsx",
];

const reportPath = path.join(
  root,
  "docs",
  "verification",
  "reports",
  "ui-integration-iterate-001.md",
);

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function collectHardcodedLines(relPath, content) {
  const findings = [];
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineNo = i + 1;
    const hasCjk = /[가-힣一-龯]/.test(line);
    const hasQuote = /["'`]/.test(line);
    const isImport = /^\s*import\s+/.test(line);
    const isComment = /^\s*\/\//.test(line);

    if (hasCjk && hasQuote && !isImport && !isComment && !line.includes("t(")) {
      findings.push({
        file: relPath,
        line: lineNo,
        message: "하드코딩된 CJK 문자열 후보",
      });
      continue;
    }

    const jsxLiteralMatch = line.match(/>\s*[A-Za-z][^<{]{2,}\s*</);
    if (jsxLiteralMatch && !line.includes("{t(") && !isComment) {
      findings.push({
        file: relPath,
        line: lineNo,
        message: "하드코딩된 JSX 영문 문자열 후보",
      });
    }
  }

  return findings;
}

function cjkTypographyRisk(relPath, content) {
  const hasCjk = /[가-힣一-龯]/.test(content);
  const hasCjkClass = /(text-cjk-body|leading-relaxed)/.test(content);
  const hasWordBreak = /(break-words|break-all)/.test(content);

  if (!hasCjk) return [];

  const issues = [];
  if (!hasCjkClass) {
    issues.push({
      file: relPath,
      message: "CJK 본문 line-height 유틸리티 적용 후보 점검 필요",
    });
  }
  if (!hasWordBreak) {
    issues.push({
      file: relPath,
      message: "긴 CJK 문자열 대비 word-break 유틸리티 점검 필요",
    });
  }
  return issues;
}

function queryPreservationRisk(content) {
  const hasSearchParamsHook = /useSearchParams/.test(content);
  const pathnameOnlyReplace = /router\.replace\(\s*pathname\s*,\s*\{\s*locale\s*:/.test(
    content,
  );

  if (pathnameOnlyReplace && !hasSearchParamsHook) {
    return [
      {
        file: "src/components/ui/language-toggle.tsx",
        message: "locale 전환 시 query 파라미터 유실 위험 (pathname-only replace)",
      },
    ];
  }
  return [];
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function formatFindings(findings, includeLine = false) {
  if (findings.length === 0) return "- 없음";
  return findings
    .map((item) => {
      if (includeLine && typeof item.line === "number") {
        return `- ${item.file}:${item.line} - ${item.message}`;
      }
      return `- ${item.file} - ${item.message}`;
    })
    .join("\n");
}

function main() {
  const contents = targets.map((file) => ({ file, content: read(file) }));

  const critical = [];
  const i18n = [];
  const visual = [];
  const suggestion = [];

  for (const { file, content } of contents) {
    i18n.push(...collectHardcodedLines(file, content));
    visual.push(...cjkTypographyRisk(file, content));
  }

  const languageToggleContent = read("src/components/ui/language-toggle.tsx");
  critical.push(...queryPreservationRisk(languageToggleContent));

  const hasLanguageToggleCritical = critical.some(
    (item) => item.file === "src/components/ui/language-toggle.tsx",
  );
  const hasDetailI18n = i18n.some(
    (item) => item.file === "src/app/[locale]/concerts/[concertId]/page.tsx",
  );
  const hasLockerI18n = i18n.some(
    (item) => item.file === "src/components/map/locker-widget.tsx",
  );

  if (hasLanguageToggleCritical) {
    suggestion.push({
      file: "src/components/ui/language-toggle.tsx",
      message: "useSearchParams를 사용해 locale 전환 시 query를 유지",
    });
  }
  if (hasDetailI18n) {
    suggestion.push({
      file: "src/app/[locale]/concerts/[concertId]/page.tsx",
      message: "CTA/상태 문구 하드코딩을 messages 기반으로 점진 치환",
    });
  }
  if (hasLockerI18n) {
    suggestion.push({
      file: "src/components/map/locker-widget.tsx",
      message: "오류/정렬/업데이트 문구를 메시지 키로 분리",
    });
  }

  const decision = critical.length > 0 ? "DO 복귀" : "E2E 진행 가능";
  const generatedAt = new Date().toISOString();
  const nextFixBatch = [];
  if (hasLanguageToggleCritical) {
    nextFixBatch.push(
      "src/components/ui/language-toggle.tsx: locale 전환 시 query 파라미터 보존(useSearchParams 기반)",
    );
  }
  if (hasDetailI18n) {
    nextFixBatch.push(
      "src/app/[locale]/concerts/[concertId]/page.tsx: 상세 CTA/상태 하드코딩 문구를 messages 키로 점진 치환",
    );
  }
  if (hasLockerI18n) {
    nextFixBatch.push(
      "src/components/map/locker-widget.tsx: 오류/정렬/업데이트 텍스트를 메시지 키로 분리",
    );
  }

  const report = `# UI Integration Iterate Report 001

- Generated at: ${generatedAt}
- Targets:
${targets.map((t) => `  - ${t}`).join("\n")}

## [CRITICAL]
${formatFindings(critical)}

## [I18N]
${formatFindings(i18n, true)}

## [VISUAL]
${formatFindings(visual)}

## [SUGGESTION]
${formatFindings(suggestion)}

## Next Fix Batch
${nextFixBatch.length === 0 ? "- 없음" : nextFixBatch.map((item) => `- ${item}`).join("\n")}

## 결론
- ${decision}
`;

  ensureParentDir(reportPath);
  fs.writeFileSync(reportPath, report, "utf8");

  const summary = {
    critical: critical.length,
    i18n: i18n.length,
    visual: visual.length,
    report: path.relative(root, reportPath),
    decision,
  };
  console.log(JSON.stringify(summary, null, 2));
}

main();
