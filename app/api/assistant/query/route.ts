import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { NLQueryPolicyEngine } from '@/lib/nl-query-policy-engine';

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);

  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const question = body.question || body.query || body.prompt || 'Show at-risk students';

    const result = await NLQueryPolicyEngine.executeQuery(question, scope);

    return NextResponse.json({
      success: true,
      ...result,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'ASSISTANT_ERROR', message: err.message } }, { status: 500 });
  }
}
