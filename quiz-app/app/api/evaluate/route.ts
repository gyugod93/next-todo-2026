import { NextRequest, NextResponse } from 'next/server'

export interface EvaluateResult {
  score: number
  passed: boolean
  feedback: string
  goodPoints: string[]
  missedPoints: string[]
}

export async function POST(req: NextRequest) {
  const { title, description, correctAnswer, explanation, userAnswer } = await req.json()

  if (!userAnswer?.trim()) {
    return NextResponse.json({ error: '답변을 입력해주세요' }, { status: 400 })
  }

  const prompt = `당신은 시니어 개발자로서 주니어 개발자의 답안을 채점합니다. 반드시 한국어로 응답하세요.

문제 제목: ${title}
문제 설명: ${description}

모범 답안:
${correctAnswer}

해설 (채점 기준으로 활용):
${explanation}

유저 작성 답안:
${userAnswer}

다음 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{
  "score": 0에서 100 사이 숫자,
  "passed": score가 60 이상이면 true,
  "feedback": "전체적인 피드백을 2-3문장으로",
  "goodPoints": ["잘 이해한 점1", "잘 이해한 점2"],
  "missedPoints": ["놓친 개념이나 부족한 부분1", "놓친 개념2"]
}`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err)
    }

    const data = await res.json()
    const text = data.choices[0].message.content.trim()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format')

    const parsed: EvaluateResult = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[evaluate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
