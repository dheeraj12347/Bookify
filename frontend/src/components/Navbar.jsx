import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'vendor'
    ? '/vendor/dashboard'
    : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/customer/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/90 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-orange font-black text-white">B</span>
          <span className="text-xl font-black tracking-tight text-brand-ink">Bookify</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-brand-blue' : 'hover:text-brand-blue'}>Home</NavLink>
          {user?.role === 'customer' && <NavLink to="/history" className="hover:text-brand-blue">Bookings</NavLink>}
          {user && <NavLink to="/profile" className="hover:text-brand-blue">Profile</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to={dashboardPath} className="hidden rounded-lg px-4 py-2 text-sm font-bold text-brand-blue hover:bg-blue-50 sm:inline-flex">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/customer/login" className="rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">Login</Link>
              <Link to="/customer/signup" className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
