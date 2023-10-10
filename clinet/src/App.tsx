import "./App.css";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";
import BuilderLayout from "./pages/BuilderLayout";
import Template from "./pages/Builder/Template";
import Portfolio from "./pages/Builder/Portfolio/Portfolio";
import Home from "./pages/Home/index";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Preview from "./pages/Builder/Preview/Preview";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* all page */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<Home />} />
        <Route path="pricing" element={<Home />} />
      </Route>

      {/* dashboard route */}
      <Route path="/dashboard" element={<Home />}>
        <Route index element={<Home />} />

      </Route>

      {/* builder route */}
      <Route path="/builder" element={<BuilderLayout />}>
        <Route index element={<Template />} />
        <Route path=":portfolio" element={<Portfolio />} />
        <Route path="preview/:id" element={<Preview/>} />
      </Route>


      {/* auth route */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Home />} />
        <Route path="singup" element={<Home />} />
        <Route path="forgot" element={<Home />} />
        <Route path="change_passeord" element={<Home />} />
      </Route>
    </Route>
  )
);


function App() {

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
