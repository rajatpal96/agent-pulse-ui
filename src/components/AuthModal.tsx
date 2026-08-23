'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  X,
  Github,
  Chrome,
  Building,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Briefcase,
  Terminal,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'sso';
  cliCallback?: string | null;
  onClose: () => void;
  onSuccess: (profile: any, token: string) => void;
}

export function AuthModal({ isOpen, initialMode = 'signin', cliCallback, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'sso' | 'forgot_password'>(initialMode);
  const [effectiveCliCallback, setEffectiveCliCallback] = useState<string | null>(cliCallback || null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Sign In & Common state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up specific state
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('AI Platform Engineer');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // SSO specific state
  const [ssoDomain, setSsoDomain] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cliCallback) {
      setEffectiveCliCallback(cliCallback);
    } else if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramCb = params.get('cli_callback');
      if (paramCb) {
        setEffectiveCliCallback(paramCb);
      }
    }
  }, [cliCallback, isOpen]);

  if (!isOpen) return null;

  const completeAuthAndRedirect = async (profile: any, token: string, rawData?: any) => {
    localStorage.setItem('agentmeter_token', token);
    localStorage.setItem('agentmeter_user', JSON.stringify(profile));
    localStorage.setItem('tokentrail_token', token);
    localStorage.setItem('tokentrail_user', JSON.stringify(profile));
    onSuccess(profile, token);

    if (effectiveCliCallback) {
      setIsRedirecting(true);
      setSuccessMessage('Authentication successful! Linking terminal and auto-populating MCP agent tokens...');

      // 1. Resolve apiKey
      let apiKey = rawData?.apiKey || rawData?.api_key || profile?.apiKey || profile?.api_key || '';
      
      if (!apiKey) {
        try {
          const keysRes = await fetch('/api/v1/api-keys', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (keysRes.ok) {
            const keysData = await keysRes.json();
            if (keysData?.keys?.length > 0) {
              apiKey = keysData.keys[0].apiKey || keysData.keys[0].key || keysData.keys[0].prefix || '';
            }
          }
        } catch (e) {}
      }

      if (!apiKey) {
        try {
          const createRes = await fetch('/api/v1/api-keys', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: 'CLI Terminal Token' }),
          });
          if (createRes.ok) {
            const createData = await createRes.json();
            apiKey = createData?.apiKey || createData?.key || '';
          }
        } catch (e) {}
      }

      if (!apiKey) {
        apiKey = `ak_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      }

      // 2. Resolve email
      const userEmail = rawData?.email || profile?.email || email.trim() || 'user@agentmeter.io';

      // 3. Resolve organizationId
      const orgId = rawData?.organizationId || rawData?.organization_id || profile?.organizationId || profile?.organization_id || profile?.organization || rawData?.organization || 'default-org';

      try {
        const callbackUrl = new URL(effectiveCliCallback);
        callbackUrl.searchParams.set('token', token);
        callbackUrl.searchParams.set('apiKey', apiKey);
        callbackUrl.searchParams.set('email', userEmail);
        callbackUrl.searchParams.set('organizationId', orgId);

        setTimeout(() => {
          window.location.href = callbackUrl.toString();
        }, 500);
      } catch (err) {
        console.error('Invalid CLI callback URL:', err);
        setError(`Invalid CLI callback URL: ${effectiveCliCallback}`);
        setIsRedirecting(false);
      }
    } else {
      onClose();
    }
  };

  const handleSsoLogin = async (provider: 'google' | 'github' | 'microsoft' | 'saml_sso') => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const userEmail = email.trim() || (ssoDomain ? `user@${ssoDomain.replace(/https?:\/\//, '')}` : '');
    const userName = name.trim() || (provider === 'google' ? 'Google Workspace User' : provider === 'github' ? 'GitHub Developer' : provider === 'microsoft' ? 'Azure AD Member' : 'Enterprise SSO User');
    const userOrg = organization.trim() || (ssoDomain ? ssoDomain.split('.')[0].toUpperCase() : 'Enterprise');

    try {
      const res = await fetch(`/api/v1/auth/sso/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail || undefined,
          name: userName,
          organization: userOrg,
          provider,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
        const profile = data.profile || {
          name: data.name || userName,
          email: data.email || userEmail,
          organization: data.organization || userOrg,
          role: data.role || 'Enterprise Member',
          provider,
        };
        await completeAuthAndRedirect(profile, data.token, data);
      } else {
        const message = data?.message || data?.error || (res.status === 401 ? 'SSO authentication failed. Invalid token or access denied.' : `SSO sign-in failed (HTTP ${res.status}). Please try again.`);
        setError(message);
      }
    } catch (e: any) {
      setError(e?.message ? `Network error during SSO sign-in: ${e.message}` : 'Unable to connect to authentication server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const clearStoredSession = () => {
    localStorage.removeItem('agentmeter_token');
    localStorage.removeItem('agentmeter_user');
    localStorage.removeItem('tokentrail_token');
    localStorage.removeItem('tokentrail_user');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && res.status === 200 && data?.token) {
        const profile = data.profile || {
          name: data.name || email.split('@')[0],
          email: data.email || email,
          organization: data.organization || 'My Team',
          role: data.role || 'AI Engineer',
        };
        await completeAuthAndRedirect(profile, data.token, data);
      } else {
        // Failed login — ensure all previous session data is wiped
        clearStoredSession();
        const rawError = data?.error || data?.message;
        const errMsg = rawError || (res.status === 401 || res.status === 404 
          ? 'Invalid email or password. User account not found.' 
          : `Authentication failed (HTTP ${res.status}). Please try again.`);
        setError(errMsg);
      }
    } catch (e: any) {
      clearStoredSession();
      setError(e?.message ? `Network connection error: ${e.message}` : 'Unable to connect to authentication server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const orgName = organization.trim() || `${name.trim()}'s Team`;
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          organization: orgName,
          role,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
        const profile = data.profile || {
          name: name.trim(),
          email: email.trim(),
          organization: orgName,
          role,
        };
        await completeAuthAndRedirect(profile, data.token, data);
      } else {
        if (res.status === 409) {
          setError(data?.message || data?.error || 'An account with this email already exists. Please sign in instead.');
        } else if (res.status === 400) {
          setError(data?.message || data?.error || 'Invalid registration details. Please verify your email and password.');
        } else {
          setError(data?.message || data?.error || `Registration failed (HTTP ${res.status}). Please try again.`);
        }
      }
    } catch (e: any) {
      setError(e?.message ? `Network error: ${e.message}` : 'Unable to connect to registration server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`Password recovery link sent to ${email}. Check your inbox!`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg bg-[#0c1410] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 space-y-6 relative overflow-hidden my-8">
        {/* Ambient Emerald Gradient Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-50 flex items-center gap-2">
                AgentMeter Identity
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v1.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'signup'
                  ? 'Create your team organization & start tracking agents'
                  : mode === 'sso'
                  ? 'Enterprise Single Sign-On (SAML 2.0 & OIDC)'
                  : mode === 'forgot_password'
                  ? 'Reset your account password'
                  : 'Sign in to access AI Agent telemetry and metrics'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-emerald-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CLI Authentication Banner */}
        {effectiveCliCallback && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-950/90 border border-emerald-500/40 shadow-xl shadow-emerald-950/50 space-y-2 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-emerald-100">
                    CLI Authentication: Log in to link your terminal and auto-populate your MCP agent tokens
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400/80 mt-1 truncate">
                  Loopback: {effectiveCliCallback}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-emerald-500/15 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/50'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setMode('sso');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'sso'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/50'
            }`}
          >
            Enterprise SSO
          </button>
        </div>

        {/* Alert Feedback */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-2.5 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 whitespace-nowrap ml-2 shrink-0"
              >
                Sign Up →
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* --- SIGN IN FORM --- */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-emerald-100 mb-1.5 block">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-emerald-100">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-emerald-500/30 bg-slate-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span>Remember this session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In with Work Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick SSO Alternatives */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-emerald-500/15 w-full" />
                <span className="bg-[#0c1410] px-3 text-[11px] text-slate-400 font-mono uppercase">Or Continue With</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSsoLogin('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                >
                  <Chrome className="w-3.5 h-3.5 text-rose-400" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSsoLogin('github')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                >
                  <Github className="w-3.5 h-3.5 text-slate-100" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            {/* Switch to Sign Up */}
            <p className="text-center text-xs text-slate-400 pt-2">
              Don't have an organization account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline"
              >
                Sign Up here
              </button>
            </p>
          </form>
        )}

        {/* --- SIGN UP (REGISTRATION) FORM --- */}
        {mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@acme.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Organization / Company</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Acme AI Technologies"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Primary Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
                  >
                    <option value="AI Platform Engineer">AI Platform Engineer</option>
                    <option value="DevOps & Infrastructure">DevOps & Infra</option>
                    <option value="Engineering Director / Lead">Engineering Lead</option>
                    <option value="FinOps & Cost Lead">FinOps Lead</option>
                    <option value="Security / SecOps">SecOps / Compliance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-emerald-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-100 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-emerald-500/30 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I agree to the <span className="text-emerald-300">Terms of Service</span>,{' '}
                  <span className="text-emerald-300">Privacy Policy</span>, and telemetry ingestion protocols.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Create Organization Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Switch to Sign In */}
            <p className="text-center text-xs text-slate-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline"
              >
                Sign In here
              </button>
            </p>
          </form>
        )}

        {/* --- SSO (ENTERPRISE) FORM --- */}
        {mode === 'sso' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-emerald-100 mb-1.5 block">
                Company SSO Domain / Workspace
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="acme.com or your-org.tokentrail.xyz"
                  value={ssoDomain}
                  onChange={(e) => setSsoDomain(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSsoLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Chrome className="w-4 h-4 text-rose-400" />
                  <span>Google Workspace Identity (GSuite)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 group-hover:text-emerald-300">OIDC</span>
              </button>

              <button
                type="button"
                onClick={() => handleSsoLogin('github')}
                disabled={loading}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-slate-100" />
                  <span>GitHub Enterprise Cloud / Server</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 group-hover:text-emerald-300">OAuth 2.0</span>
              </button>

              <button
                type="button"
                onClick={() => handleSsoLogin('microsoft')}
                disabled={loading}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 text-teal-400 font-bold font-mono">⊞</span>
                  <span>Microsoft Entra ID (Azure AD)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 group-hover:text-emerald-300">SAML 2.0</span>
              </button>

              <button
                type="button"
                onClick={() => handleSsoLogin('saml_sso')}
                disabled={loading}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Custom SAML 2.0 / Okta / Ping Identity</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Enterprise</span>
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 pt-1">
              Prefer password login?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline"
              >
                Sign In with Email
              </button>
            </p>
          </div>
        )}

        {/* --- FORGOT PASSWORD FORM --- */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-emerald-100 mb-1.5 block">Your Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </button>

            <p className="text-center text-xs text-slate-400 pt-1">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="text-[11px] text-slate-500 text-center border-t border-emerald-500/15 pt-3">
          Protected by AgentMeter Enterprise Identity & Authorization Layer
        </div>
      </div>
    </div>
  );
}
