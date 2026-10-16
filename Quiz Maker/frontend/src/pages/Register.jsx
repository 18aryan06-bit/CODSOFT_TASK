import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../api";
import Alert from "../components/Alert";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getApiError(err, "Unable to create your account."));
    } finally {
      setBusy(false);
    }
  }

  return <div className="container-page flex min-h-[calc(100vh-9rem)] items-center justify-center py-12">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-indigo-600 p-10 text-white md:flex"><Link to="/" className="flex items-center gap-2 text-xl font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Brain/></span>Quizly.</Link><div><p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">Make learning yours</p><h2 className="mt-4 text-3xl font-bold leading-tight">Create. Challenge. Celebrate progress.</h2><p className="mt-4 leading-7 text-indigo-100">Build quizzes around what you love and share them with curious minds.</p></div><p className="text-sm text-indigo-200">Your next chapter starts now.</p></div>
      <div className="p-6 sm:p-10"><p className="eyebrow">JOIN THE COMMUNITY</p><h1 className="mt-2 text-3xl font-extrabold text-slate-950">Create account</h1><p className="mt-2 text-slate-500">It only takes a minute to get started.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <Alert>{error}</Alert>}
          <div><label className="field-label" htmlFor="name">Full name</label><div className="relative mt-2"><UserRound className="field-icon" size={18}/><input id="name" required minLength={2} maxLength={60} autoComplete="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="field-input pl-11" placeholder="Your name"/></div></div>
          <div><label className="field-label" htmlFor="email">Email address</label><div className="relative mt-2"><Mail className="field-icon" size={18}/><input id="email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="field-input pl-11" placeholder="you@example.com"/></div></div>
          <div><label className="field-label" htmlFor="password">Password</label><div className="relative mt-2"><LockKeyhole className="field-icon" size={18}/><input id="password" type={showPassword ? "text" : "password"} required minLength={8} maxLength={128} autoComplete="new-password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="field-input pl-11 pr-12" placeholder="At least 8 characters"/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
          <div><label className="field-label" htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={form.confirmPassword} onChange={(e)=>setForm({...form,confirmPassword:e.target.value})} className="field-input mt-2" placeholder="Enter password again"/></div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Creating account..." : "Create account"} {!busy && <ArrowRight size={18}/>}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Log in</Link></p>
      </div>
    </div>
  </div>;
}
