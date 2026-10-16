import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, ChartNoAxesColumnIncreasing, CircleCheck, Compass, Plus, Sparkles, Trophy, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: Plus, title: "Create your own", text: "Turn what you know into a quiz others can learn from." },
  { icon: Compass, title: "Explore new topics", text: "Browse community quizzes across technology, science, and more." },
  { icon: Trophy, title: "See how you did", text: "Get instant scores and review every answer after a quiz." },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="overflow-hidden">
      <section className="hero-grid relative">
        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div className="relative z-10">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm"><Sparkles size={15}/> Learning, made interactive</span>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Welcome to <span className="text-gradient">Quizly</span>. Know more.<br/><span className="text-gradient">Quiz yourself.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Create quizzes, challenge your knowledge, and learn something new with every question.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/quizzes" className="btn-primary">Quiz listed<ArrowRight size={18}/></Link>
              <Link to={isAuthenticated ? "/create-quiz" : "/register"} className="btn-secondary">{isAuthenticated ? "Create a quiz" : "Start creating"} <Plus size={18}/></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CircleCheck size={16} className="text-emerald-600"/>Instant feedback</span>
              <span className="flex items-center gap-1.5"><CircleCheck size={16} className="text-emerald-600"/>Free to get started</span>
            </div>
            {isAuthenticated && <p className="mt-5 text-sm font-medium text-indigo-700">Welcome back, {user?.name}!</p>}
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/70 via-sky-100/50 to-violet-200/70 blur-2xl"/>
            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-indigo-900/10 sm:p-7">
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Quick challenge</p><h2 className="mt-2 text-xl font-bold text-slate-900">JavaScript basics</h2></div>
                <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><BookOpenCheck size={24}/></span>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500"><span>Question 2 of 5</span><span>40%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/5 rounded-full bg-indigo-600"/></div>
              <p className="mt-6 font-semibold leading-6 text-slate-800">Which keyword declares a block-scoped variable?</p>
              <div className="mt-4 space-y-3">
                {["var", "let", "define", "static"].map((option, index) => <div key={option} className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm font-medium ${index === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50 text-slate-600"}`}><span className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${index === 1 ? "bg-emerald-600 text-white" : "bg-white text-slate-500"}`}>{String.fromCharCode(65 + index)}</span>{option}{index === 1 && <CircleCheck size={17} className="ml-auto"/>}</div>)}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><Trophy size={18}/> Correct answer! Keep it up.</div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">MADE FOR CURIOUS MINDS</p><h2 className="section-title mt-3">A better way to learn</h2><p className="mt-4 leading-7 text-slate-600">Whether you're revising a topic or sharing what you know, Quizly makes every question count.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({icon: Icon, title, text}, index) => <article key={title} className="card p-6"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${["bg-indigo-50 text-indigo-600","bg-sky-50 text-sky-600","bg-emerald-50 text-emerald-600"][index]}`}><Icon size={23}/></div><h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}</div>
      </section>
      <section className="container-page pb-16 sm:pb-20"><div className="rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-12"><div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-indigo-300">YOUR NEXT BIG IDEA STARTS HERE</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Ready to put your knowledge to the test?</h2><p className="mt-3 text-slate-300">{isAuthenticated ? "Build a quiz and share it with the community." : "Join the community and create your first quiz."}</p></div><Link to={isAuthenticated ? "/create-quiz" : "/register"} className="btn-primary shrink-0">Let's get started <ArrowRight size={18}/></Link></div></div></section>
    </div>
  );
}
