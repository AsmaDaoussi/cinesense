// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// (optionnel) Devtools: npm i @tanstack/react-query-devtools
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Layout from "./layout/Layout";
import SearchPage from "./routes/Search";
import MovieDetails from "./routes/MovieDetails";
import FavoritesPage from "./routes/Favorites";
import { FavesProvider } from "./contexts/FavesContext";
import "./index.css";

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
      { path: "favorites", element: <FavoritesPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
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
      <FavesProvider>
        <RouterProvider router={router} />
      </FavesProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
