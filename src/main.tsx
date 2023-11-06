import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home/Home.tsx';
import Project from './pages/Project/Project.tsx';
import Task from './pages/Task/Task.tsx';
import Admin from './pages/Admin/Admin.tsx';

import './main.css';
const router = createBrowserRouter([
	{ path: '/', element: <Home /> },
	{ path: '/project/:id', element: <Project /> },
	{ path: '/task/:id', element: <Task /> },
	{ path: '/admin', element: <Admin /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
);
