import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home/Home.tsx';
import Project from './pages/Project/Project.tsx';
import Task from './pages/Task/Task.tsx';

const router = createBrowserRouter([
	{ path: '/', element: <Home /> },
	{ path: '/project/:id', element: <Project /> },
	{ path: '/task/:id', element: <Task /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
);
