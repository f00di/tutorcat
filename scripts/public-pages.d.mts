export const STATIC_PAGES: string[];
export const LEGAL_PAGES: Record<string, string>;
export const legalStatus: Record<string, "draft" | "final">;
export function draftPages(): string[];
export function profilePages(): string[];
export function publicPages(): string[];
export function sitemapPages(): string[];
