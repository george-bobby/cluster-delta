import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword,Admin, Notifications ,Ai, Hackathon} from "./pages";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
         
        </Route>
        <Route path='/notifications' element={<Notifications/>} />
        <Route path='/profile/:id?' element={<Profile />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/feed' element={<Home />} />
        <Route path='/ai' element={<Ai />} />
        <Route path='/hackathons' element={<Hackathon />} />
      </Routes>
    </div>
  );
}

export default App;
