import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, accept, origin, priority, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, sec-fetch-dest, sec-fetch-mode, sec-fetch-site, sec-gpc, user-agent',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, organization, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for registration' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const userName = name || email.split('@')[0];
    const userOrg = organization || 'TokenTrail Organization';
    const userRole = role || 'AI Platform Engineer';

    const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tokentrail.xyz';

    // Attempt to register/login with the backend API
    try {
      const loginRes = await fetch(`${apiBase}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'default_pass', name: userName }),
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        if (data.token) {
          const profile = {
            ...(data.profile || {}),
            name: userName,
            email,
            organization: userOrg,
            organizationId: userOrg.toLowerCase().replace(/\s+/g, '_'),
            role: userRole,
            provider: 'email',
          };

          return NextResponse.json(
            {
              token: data.token,
              profile,
              message: 'Account created successfully',
            },
            {
              status: 200,
              headers: { 'Access-Control-Allow-Origin': '*' },
            }
          );
        }
      }
    } catch (e) {
      console.warn('Backend login pass-through failed during signup:', e);
    }

    // Direct token creation fallback for standalone/Vercel deployment
    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: userId,
        email,
        name: userName,
        organizationId: userOrg.toLowerCase().replace(/\s+/g, '_'),
        organization: userOrg,
        role: userRole,
        provider: 'email',
        permissions: ['metrics:read', 'metrics:write', 'mcp:read', 'mcp:admin'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      })
    ).toString('base64url');
    const signature = Buffer.from(`tokentrail_sig_${Date.now()}`).toString('base64url');
    const token = `${header}.${payload}.${signature}`;

    const profile = {
      userId,
      email,
      name: userName,
      organization: userOrg,
      organizationId: userOrg.toLowerCase().replace(/\s+/g, '_'),
      role: userRole,
      provider: 'email',
      permissions: ['metrics:read', 'metrics:write', 'mcp:read', 'mcp:admin'],
    };

    return NextResponse.json(
      {
        token,
        profile,
        message: 'Account created successfully',
      },
      {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
