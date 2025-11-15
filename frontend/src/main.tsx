// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// (optionnel) Devtools: npm i @tanstack/react-query-devtools
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from './App.tsx'
import Login from './routes/Auth.tsx'
  import WatchlistPage from "./routes/Watchlist";


import Dashboard from './routes/Dashboard'
import Layout from "./layout/Layout";
import SearchPage from "./routes/Search";
import MovieDetails from "./routes/MovieDetails";
import FavoritesPage from "./routes/Favorites";
// main.tsx (ajouts)

import "./index.css";
import Comments from "./routes/Comments.tsx";

function ErrorPage() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Oups… page introuvable.
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: "title/:id", element: <MovieDetails /> },
       { path: "comments/:id", element: <Comments/> },
      

      { path: "favorites", element: <FavoritesPage /> },
      { path: "*", element: <ErrorPage /> },
            { path: "watchlist", element: <WatchlistPage /> }, // <-- nouveau

      { path: '/home', element: <App /> },
  
  { path: '/dashboard', element: <Dashboard /> },
    ],
  },
  {
    path:'/login', element: <Login /> 
  }
]);

// Tu peux ajuster ces options si tu veux
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

