import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../api";
import Alert from "../components/Alert";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(getApiError(err, "Unable to log in."));
    } finally {
      setBusy(false);
    }
  }

  return <div className="container-page flex min-h-[calc(100vh-9rem)] items-center justify-center py-12">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white md:flex"><Link to="/" className="flex items-center gap-2 text-xl font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600"><Brain/></span>Quizly.</Link><div><p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">Welcome back</p><h2 className="mt-4 text-3xl font-bold leading-tight">Your next lightbulb moment is one quiz away.</h2><p className="mt-4 leading-7 text-slate-300">Pick up where you left off and keep growing your knowledge.</p></div><p className="text-sm text-slate-500">Learn a little. Every day.</p></div>
      <div className="p-6 sm:p-10"><p className="eyebrow">YOUR LEARNING SPACE</p><h1 className="mt-2 text-3xl font-extrabold text-slate-950">Log in</h1><p className="mt-2 text-slate-500">Enter your details to continue.</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {error && <Alert>{error}</Alert>}
          <div><label className="field-label" htmlFor="email">Email address</label><div className="relative mt-2"><Mail className="field-icon" size={18}/><input id="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} className="field-input pl-11" placeholder="you@example.com"/></div></div>
          <div><label className="field-label" htmlFor="password">Password</label><div className="relative mt-2"><LockKeyhole className="field-icon" size={18}/><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} className="field-input pl-11 pr-12" placeholder="Your password"/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Logging in..." : "Log in"} {!busy && <ArrowRight size={18}/>}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">New to Quizly? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link></p>
      </div>
    </div>
  </div>;
}
