import "./globals.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import { SigninForm, SignupForm } from "./_auth/forms";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* publick routes (sign in, sign up) */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* publick routes (can see only sign in) */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
