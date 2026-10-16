import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Clock3, Send } from "lucide-react";
import api, { getApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/quizzes/${id}`).then(({data}) => {
      if (!active) return;
      setQuiz(data.quiz);
      setAnswers(Array(data.quiz.questions.length).fill(null));
      if (location.state?.created) setNotice("Your quiz has been published. Try it out!");
    }).catch((err) => { if (active) setError(getApiError(err, "Could not load this quiz.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function submitQuiz() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (answers.some((answer) => answer === null)) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post(`/quizzes/${id}/submit`, { answers });
      navigate("/quiz-result", { state: { result: data.result, answers, quizId: id }, replace: true });
    } catch (err) {
      setError(getApiError(err, "Could not submit your answers."));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="container-page py-12"><Loader label="Loading quiz..."/></main>;
  if (error && !quiz) return <main className="container-page max-w-2xl py-12"><Alert>{error}</Alert><Link to="/quizzes" className="btn-secondary mt-5">Back to quizzes</Link></main>;
  if (!quiz) return null;

  const question = quiz.questions[current];
  const total = quiz.questions.length;
  const answered = answers.filter((a) => a !== null).length;
  const progress = ((current + 1) / total) * 100;

  return <main className="container-page max-w-3xl py-8 sm:py-12">
    <Link to="/quizzes" className="btn-ghost mb-6 !px-0"><ArrowLeft size={17}/> All quizzes</Link>
    {notice && <div className="mb-5"><Alert type="success">{notice}</Alert></div>}
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">{quiz.category}</span><span className="flex items-center gap-1.5 text-sm text-slate-500"><Clock3 size={16}/> {answered} of {total} answered</span></div><h1 className="mt-4 text-2xl font-extrabold text-slate-950 sm:text-3xl">{quiz.title}</h1>{quiz.description && <p className="mt-2 text-slate-600">{quiz.description}</p>}<div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-600"><span>Question {current+1} of {total}</span><span>{Math.round(progress)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{width:`${progress}%`}}/></div></div>
      <div className="p-5 sm:p-8"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><CircleHelp size={20}/></span><h2 className="pt-1 text-lg font-bold leading-7 text-slate-900 sm:text-xl">{question.questionText}</h2></div>
        <div className="mt-6 space-y-3">{question.options.map((option, index)=><button type="button" key={index} onClick={()=>{setAnswers((prev)=>prev.map((a,i)=>i===current?index:a));setError("");}} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${answers[current]===index ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${answers[current]===index ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>{String.fromCharCode(65+index)}</span><span className={`flex-1 text-sm font-medium sm:text-base ${answers[current]===index?"text-indigo-900":"text-slate-700"}`}>{option}</span>{answers[current]===index && <Check size={18} className="text-indigo-600"/>}</button>)}</div>
        {error && <div className="mt-5"><Alert>{error}</Alert></div>}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={current===0 || busy} onClick={()=>{setCurrent((n)=>n-1);setError("");}} className="btn-secondary"><ArrowLeft size={17}/> Previous</button>{current < total-1 ? <button type="button" disabled={busy} onClick={()=>{setCurrent((n)=>n+1);setError("");}} className="btn-primary">Next question <ArrowRight size={17}/></button> : <button type="button" disabled={busy} onClick={submitQuiz} className="btn-primary">{busy ? "Submitting..." : "Submit quiz"} <Send size={17}/></button>}</div>
        <div className="mt-5 flex flex-wrap gap-2">{answers.map((answer,index)=><button key={index} type="button" onClick={()=>{setCurrent(index);setError("");}} aria-label={`Go to question ${index+1}`} className={`grid h-9 w-9 place-items-center rounded-lg border text-xs font-bold ${current===index?"border-indigo-600 bg-indigo-600 text-white":answer!==null?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-slate-200 bg-white text-slate-500"}`}>{index+1}</button>)}</div>
      </div>
    </div>
    {!isAuthenticated && <p className="mt-4 text-center text-sm text-slate-500">You'll need to <Link to="/login" state={{from:location}} className="font-semibold text-indigo-600">log in</Link> to submit your answers and see your results.</p>}
  </main>;
}
