import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import UserInfoPage from "./pages/Myinfo";
import Review from "./pages/Review";
import PostWrite from "./pages/PostWrite";
import PostEdit from "./pages/PostEdit";
import EditProfile from "./pages/EditProfile";
import SignupInfo from "./pages/SignupInfo";
import MyComments from "./pages/Mycomments";
import MyPost from "./pages/Mypost";
import BlockUserInfo from "./pages/BlockUser";
import MatchingBoard from "./pages/MatchingBoard";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "postWrite",
        element: <PostWrite />,
      },
      {
        path: "postEdit/:id",
        element: <PostEdit />,
      },
      {
        path: "matchingBoard",
        element: <MatchingBoard />,
      },
      {
        path: "matchingBoard/:id",
        element: <MatchingBoard />,
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Signup",
        element: <SignUp />,
      },
      {
        path: "myinfo",
        element: <UserInfoPage />,
      },
      {
        path: "review",
        element: <Review />,
      },
      {
        path: "/EditProfile",
        element: <EditProfile />,
      },
      {
        path: "/SignupInfo",
        element: <SignupInfo />,
      },
      {
        path: "/Mycomments",
        element: <MyComments />,
      },
      {
        path: "/Mypost",
        element: <MyPost />,
      },
      {
        path: "/BlockUserInfo",
        element: <BlockUserInfo />,
      },
      {
        path: "apply/:postSEQ",
        element: <Apply />,
      },
      {
        path: "search/:keyword",
        element: <Search />,
      },
    ],
  },
]);
export default router;
