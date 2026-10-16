import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, CirclePlus, ListPlus, Trash2 } from "lucide-react";
import api, { getApiError } from "../api";
import Alert from "../components/Alert";

const blankQuestion = () => ({ questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 });

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "", questions: [blankQuestion()] });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updateQuestion(index, changes) {
    setForm((prev) => ({ ...prev, questions: prev.questions.map((q, i) => i === index ? { ...q, ...changes } : q) }));
  }
  function updateOption(qIndex, optionIndex, value) {
    const question = form.questions[qIndex];
    updateQuestion(qIndex, { options: question.options.map((option, i) => i === optionIndex ? value : option) });
  }
  function addQuestion() {
    if (form.questions.length >= 100) return;
    setForm((prev) => ({ ...prev, questions: [...prev.questions, blankQuestion()] }));
  }
  function removeQuestion(index) {
    if (form.questions.length === 1) return;
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.questions.some((q) => !q.questionText.trim() || q.options.some((o) => !o.trim()))) {
      setError("Please fill in the question text and all four options for every question.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/quizzes", {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        questions: form.questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((o) => o.trim()),
          correctAnswerIndex: Number(q.correctAnswerIndex),
        })),
      });
      navigate(`/quiz/${data.quiz._id}`, { replace: true, state: { created: true } });
    } catch (err) {
      setError(getApiError(err, "Could not create your quiz."));
    } finally {
      setBusy(false);
    }
  }

  return <main className="container-page max-w-4xl py-10 sm:py-14">
    <button onClick={()=>navigate(-1)} className="btn-ghost mb-5 !px-0"><ArrowLeft size={17}/> Back</button>
    <p className="eyebrow">BUILD SOMETHING GREAT</p><h1 className="section-title mt-2">Create a quiz</h1><p className="mt-3 text-slate-600">Write your questions, choose the right answers, and share your quiz.</p>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && <Alert>{error}</Alert>}
      <section className="card space-y-5 p-5 sm:p-7"><div><h2 className="text-lg font-bold text-slate-900">Quiz details</h2><p className="mt-1 text-sm text-slate-500">Give your quiz a clear title and topic.</p></div>
        <div><label className="field-label" htmlFor="title">Quiz title *</label><input id="title" required minLength={3} maxLength={120} value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="field-input mt-2" placeholder="e.g. JavaScript Fundamentals"/></div>
        <div><label className="field-label" htmlFor="description">Description</label><textarea id="description" maxLength={1000} rows={3} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="field-input mt-2" placeholder="What will people learn?"/></div>
        <div><label className="field-label" htmlFor="category">Category *</label><input id="category" required maxLength={60} value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="field-input mt-2" placeholder="e.g. Programming, Science, History"/></div>
      </section>
      <div className="flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Questions <span className="text-slate-400">({form.questions.length})</span></h2><p className="mt-1 text-sm text-slate-500">Each question needs four options.</p></div><button type="button" onClick={addQuestion} disabled={form.questions.length>=100} className="btn-secondary shrink-0"><CirclePlus size={17}/> Add question</button></div>
      {form.questions.map((q, qIndex)=><section key={qIndex} className="card p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">Question {qIndex+1}</span><button type="button" disabled={form.questions.length===1} onClick={()=>removeQuestion(qIndex)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={16}/> Remove</button></div>
        <div className="mt-5"><label className="field-label" htmlFor={`question-${qIndex}`}>Question text *</label><textarea id={`question-${qIndex}`} required maxLength={1000} rows={2} value={q.questionText} onChange={(e)=>updateQuestion(qIndex,{questionText:e.target.value})} className="field-input mt-2" placeholder="Type your question here..."/></div>
        <fieldset className="mt-5"><legend className="field-label">Answer options * <span className="font-normal text-slate-500">— select the correct answer</span></legend><div className="mt-3 space-y-3">{q.options.map((option, oIndex)=><label key={oIndex} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${q.correctAnswerIndex===oIndex ? "border-emerald-300 bg-emerald-50/70" : "border-slate-200 hover:border-slate-300"}`}><input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswerIndex===oIndex} onChange={()=>updateQuestion(qIndex,{correctAnswerIndex:oIndex})} className="h-4 w-4 accent-emerald-600" aria-label={`Mark option ${oIndex+1} as correct`}/><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{String.fromCharCode(65+oIndex)}</span><input required maxLength={300} value={option} onChange={(e)=>updateOption(qIndex,oIndex,e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder={`Option ${oIndex+1}`}/>{q.correctAnswerIndex===oIndex && <CheckCircle2 size={18} className="shrink-0 text-emerald-600"/>}</label>)}</div></fieldset>
      </section>)}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={()=>navigate("/quizzes")} className="btn-secondary">Cancel</button><button type="submit" disabled={busy} className="btn-primary">{busy ? "Publishing..." : "Publish quiz"} {!busy && <ArrowRight size={18}/>}</button></div>
    </form>
  </main>;
}
