import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import api, { getApiError } from "../api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

export default function QuizList() {
  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/quizzes", { params: { search, page, limit: 12 } });
        if (active) {
          setQuizzes(data.quizzes || []);
          setPagination(data.pagination || { pages: 1, total: 0 });
        }
      } catch (err) {
        if (active) setError(getApiError(err, "Could not load quizzes."));
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search, page]);

  function changeSearch(value) { setSearch(value); setPage(1); }

  return <main className="container-page py-10 sm:py-14">
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">THE QUIZ LIBRARY</p><h1 className="section-title mt-2">Find your next challenge</h1><p className="mt-3 max-w-xl text-slate-600">Explore community-made quizzes and see what you know.</p></div><div className="w-full sm:max-w-sm"><label htmlFor="search" className="sr-only">Search quizzes</label><div className="relative"><Search className="field-icon" size={19}/><input id="search" value={search} onChange={(e)=>changeSearch(e.target.value)} className="field-input pl-11" placeholder="Search title or category..."/></div></div></div>
    <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><Sparkles size={16} className="text-indigo-500"/>{pagination.total} {pagination.total === 1 ? "quiz" : "quizzes"} to explore</div>
    {error && <div className="mt-6"><Alert>{error}</Alert></div>}
    {loading ? <Loader label="Finding quizzes..."/> : !error && quizzes.length === 0 ? <div className="card mt-8 px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><BookOpen size={26}/></div><h2 className="mt-4 text-xl font-bold text-slate-900">No quizzes found</h2><p className="mt-2 text-slate-500">{search ? "Try another search term." : "Be the first to create a quiz for the community."}</p><Link to="/create-quiz" className="btn-primary mt-6">Create a quiz <ArrowRight size={17}/></Link></div> : !error && <>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{quizzes.map((quiz, index)=><article key={quiz._id} className="card flex min-h-64 flex-col p-5 transition hover:-translate-y-1 hover:shadow-soft"><div className="flex items-start justify-between gap-3"><span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${["bg-indigo-50 text-indigo-700","bg-sky-50 text-sky-700","bg-emerald-50 text-emerald-700"][index%3]}`}>{quiz.category}</span><span className="text-xs text-slate-400">{quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}</span></div><h2 className="mt-4 text-xl font-bold text-slate-900">{quiz.title}</h2><p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{quiz.description || "A community quiz. Ready to test your knowledge?"}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="max-w-[55%] truncate text-xs text-slate-500">By {quiz.createdBy?.name || "Quizly member"}</span><Link to={`/quiz/${quiz._id}`} className="btn-primary !gap-2 !px-3 !py-2 text-sm">Take quiz <ArrowRight size={15}/></Link></div></article>)}</div>
      {pagination.pages > 1 && <div className="mt-8 flex items-center justify-center gap-4"><button className="btn-secondary" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>Previous</button><span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span><button className="btn-secondary" disabled={page>=pagination.pages} onClick={()=>setPage((p)=>p+1)}>Next</button></div>}
    </>}
  </main>;
}
