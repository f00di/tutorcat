import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    // Same base as vite.config.ts (/tutorcat/ on GitHub Pages).
    basepath: import.meta.env.BASE_URL,
    // Pages are prerendered as <path>/index.html, so links end in "/" and GitHub Pages never redirects.
    trailingSlash: "always",
    scrollRestoration: true,
  });
