'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { Problem } from '@/types'
import Explanation from '@/components/problems/Explanation'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  problem: Problem
  onSubmit: (answer: string, correct: boolean) => void
  initialAnswer?: string
  onRetry?: () => void
}

/** iframe에 렌더링할 HTML 문서 생성 */
function buildIframeDoc(html: string, css: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#1e1e2e;color:#cdd6f4;font-family:system-ui,sans-serif;padding:24px;}</style>
<style>${css}</style>
</head><body>${html}</body></html>`
}

/** 핵심 CSS 속성들이 포함되어 있는지 확인 */
function evaluate(userCss: string, correctCss: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, ' ').replace(/;\s*/g, ';').trim().toLowerCase()
  const userNorm = normalize(userCss)

  // correctAnswer의 각 선언(property: value)을 추출
  const declRegex = /([a-z-]+)\s*:\s*([^;{}]+)/g
  const requiredDecls: string[] = []
  let m: RegExpExecArray | null
  while ((m = declRegex.exec(correctCss)) !== null) {
    requiredDecls.push(normalize(`${m[1]}:${m[2]}`))
  }

  if (requiredDecls.length === 0) return false
  const matched = requiredDecls.filter((d) => userNorm.includes(d))
  return matched.length / requiredDecls.length >= 0.7
}

export default function CssVisual({ problem, onSubmit, initialAnswer, onRetry }: Props) {
  const htmlTemplate = problem.code ?? '<div class="box">Hello</div>'
  const correctCss = problem.correctAnswer as string
  const [css, setCss] = useState(initialAnswer ?? '/* 여기에 CSS를 작성하세요 */\n\n')
  const [submitted, setSubmitted] = useState(!!initialAnswer)
  const [showHints, setShowHints] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const targetDoc = useMemo(() => buildIframeDoc(htmlTemplate, correctCss), [htmlTemplate, correctCss])
  const userDoc = useMemo(() => buildIframeDoc(htmlTemplate, css), [htmlTemplate, css])

  const handleSubmit = () => {
    const trimmed = css.trim()
    const correct = evaluate(trimmed, correctCss)
    setSubmitted(true)
    onSubmit(trimmed, correct)
  }

  const handleReset = () => setCss('/* 여기에 CSS를 작성하세요 */\n\n')

  return (
    <div className="space-y-5">
      {/* HTML 구조 표시 */}
      <div>
        <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          HTML 구조 (수정 불가)
        </p>
        <pre className="text-sm text-gray-300 bg-gray-800 rounded-lg p-4 overflow-x-auto border border-gray-700">
          <code>{htmlTemplate}</code>
        </pre>
      </div>

      {/* 목표 vs 내 결과 분할 뷰 */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2">
              목표 화면
            </p>
            <div className="rounded-lg overflow-hidden border border-green-500/30 bg-[#1e1e2e]">
              <iframe
                srcDoc={targetDoc}
                className="w-full border-0"
                style={{ height: 200, pointerEvents: 'none' }}
                title="target"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">
              내 결과
            </p>
            <div className="rounded-lg overflow-hidden border border-blue-500/30 bg-[#1e1e2e]">
              <iframe
                srcDoc={userDoc}
                className="w-full border-0"
                style={{ height: 200 }}
                title="preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS 에디터 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">CSS 작성</p>
          {!submitted && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <MonacoEditor
            height="250px"
            language="css"
            theme="vs-dark"
            value={css}
            onChange={(val) => setCss(val ?? '')}
            loading={
              <div className="h-[250px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">
                에디터 로딩 중...
              </div>
            }
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              readOnly: submitted,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
            }}
          />
        </div>
      </div>

      {/* 힌트 */}
      {problem.hints && problem.hints.length > 0 && !submitted && (
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-sm text-gray-500 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
        >
          {showHints ? '힌트 숨기기' : '힌트 보기'}
        </button>
      )}
      {showHints && problem.hints && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-1.5">
          {problem.hints.map((hint, i) => (
            <p key={i} className="text-yellow-400 text-sm">
              {i + 1}. {hint}
            </p>
          ))}
        </div>
      )}

      {/* 제출 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!css.trim() || css.trim() === '/* 여기에 CSS를 작성하세요 */'}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          제출하기
        </button>
      )}

      {/* 결과 */}
      {submitted && (
        <>
          <div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 hover:text-green-300 transition-colors"
            >
              {showAnswer ? '정답 CSS 숨기기' : '정답 CSS 보기'}
            </button>
            {showAnswer && (
              <pre className="text-sm text-gray-300 bg-gray-800 rounded-lg p-4 overflow-x-auto border border-green-500/30">
                <code>{correctCss}</code>
              </pre>
            )}
          </div>
          <Explanation
            correct={evaluate(css.trim(), correctCss)}
            explanation={problem.explanation}
            deepDive={problem.deepDive}
            relatedProblemIds={problem.relatedProblems}
            problemId={problem.id}
            onRetry={onRetry}
          />
        </>
      )}
    </div>
  )
}
