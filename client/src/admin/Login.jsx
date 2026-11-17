import { useState } from 'react';
import { api } from '../lib/api.js';

export default function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await api('/admin/login', { method: 'POST', body: { email, password } }); onDone(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <main id="main" className="min-h-screen grid place-items-center bg-lx-palegrey p-6">
      <form onSubmit={submit} className="w-full max-w-[400px] bg-white border-t-2 border-lx-orange p-8 grid gap-5" aria-labelledby="login-h">
        <h1 id="login-h" className="text-[1.75rem]">Lexium CMS</h1>
        <div><label htmlFor="em" className="label-lx">Email</label><input id="em" type="email" autoComplete="username" className="input-lx" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label htmlFor="pw" className="label-lx">Password</label><input id="pw" type="password" autoComplete="current-password" className="input-lx" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {err && <p role="alert" className="field-error">{err}</p>}
        <button className="btn btn-navy" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
