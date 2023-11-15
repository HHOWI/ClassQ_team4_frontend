import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Mini from './pages/Mini';
import Apply from './pages/Apply';
import MatchingBoard from './pages/MatchingBoard';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import UserInfoPage from './pages/Myinfo';
import Review from './pages/Review';
import MiniUp from './pages/MiniUp';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';
import EditProfile from './pages/EditProfile';
import SignupInfo from './pages/SignupInfo';
import Myactive from './pages/Myactive';
import MyComments from './pages/Mycomments';
import MyPost from './pages/Mypost';
import FindPasswordByEmail from './pages/FindPasswordByEmail';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'postWrite',
                element: <PostWrite />,
            },
            {
                path: 'postEdit/:id',
                element: <PostEdit />,
            },
            {
                path: 'matchingBoard',
                element: <MatchingBoard />,
            },
            {
                path: 'matchingBoard/:id',
                element: <MatchingBoard />,
            },
            {
                path: 'Login',
                element: <Login />,
            },
            {
                path: 'Signup',
                element: <SignUp />,
            },
            {
                path: 'myinfo',
                element: <UserInfoPage />,
            },
            {
                path: 'review',
                element: <Review />,
            },
            {
                path: '/EditProfile',
                element: <EditProfile />,
            },
            {
                path: '/SignupInfo',
                element: <SignupInfo />,
            },
            {
                path: '/Mycomments',
                element: <MyComments />,
            },
            {
                path: '/Mypost',
                element: <MyPost />,
            },
            {
                path: '/myMatching',
                element: <Myactive />,
            },
            {
                path: 'apply/:postSEQ',
                element: <Apply />,
            },
            {
                path: '/FindPasswordByEmail',
                element: <FindPasswordByEmail />,
            },
        ],
    },
    {
        path: '/miniup/:userId',
        element: <MiniUp />,
    },
    {
        path: '/mini/:userId',
        element: <Mini />,
    },
]);
export default router;
