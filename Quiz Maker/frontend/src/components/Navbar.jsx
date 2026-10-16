import { Link, NavLink, useNavigate } from "react-router-dom";
import { Brain, LogOut, Menu, PlusCircle, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><Brain size={21} /></span>
          <span className="text-xl text-[#fb923c]">Quizly<span className="text-black">.</span></span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/quizzes" className={linkClass}>Quiz listed</NavLink>
          {isAuthenticated && <NavLink to="/create-quiz" className={linkClass}>Create quiz</NavLink>}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <span className="mr-1 flex items-center gap-2 text-sm text-black"><UserRound size={16} />{user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2"><LogOut size={16} /> Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary !py-2">Get started</Link>
            </>
          )}
        </div>
        <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => 
          setOpen(!open)} 
          style={{color:"black"}} className="rounded-lg p-2 text-slate-900 hover:bg-slate-100 md:hidden">
          {open ? <X size={23} className="text-black" /> : <Menu size={23} className="text-black" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-100 bg-white p-4 md:hidden">
          <div className="container-page flex flex-col gap-1">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/quizzes" className={linkClass} onClick={() => setOpen(false)}>Quiz listed</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/create-quiz" className={linkClass} onClick={() => setOpen(false)}><span className="inline-flex items-center gap-2"><PlusCircle size={16}/>Create quiz</span></NavLink>
                <p className="px-3 py-2 text-sm text-slate-500">Signed in as {user?.name}</p>
                <button onClick={handleLogout} className="btn-secondary mt-1 w-full"><LogOut size={16}/> Log out</button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
