import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    // Same base as vite.config.ts (/tutorcat/ on GitHub Pages).
    basepath: import.meta.env.BASE_URL,
    scrollRestoration: true,
  });
