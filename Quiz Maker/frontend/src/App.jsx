import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResult from "./pages/QuizResult";

function NotFound() {
  return <main className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">404 error</p><h1 className="mt-3 text-4xl font-black text-slate-950">Page not found</h1><p className="mt-3 text-slate-500">That page doesn't exist or may have moved.</p><a href="/" className="btn-primary mt-6">Back home</a></main>;
}

export default function App() {
  return <div className="min-h-screen"><Navbar/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/quizzes" element={<QuizList/>}/>
    <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz/></ProtectedRoute>}/>
    <Route path="/quiz/:id" element={<TakeQuiz/>}/>
    <Route path="/quiz-result" element={<QuizResult/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes><footer className="border-t border-slate-200 bg-white"><div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} Quizly. Learn something every day.</span><span>Built for curious minds.</span></div></footer></div>;
}
