import type { ZodError } from "zod";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

export function flatten(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    out[String(issue.path[0])] = issue.message;
  }
  return out;
}

export function cleanEmpty<T extends Record<string, unknown>>(data: T): T {
  const copy = { ...data };
  for (const key in copy) {
    if (copy[key] === "") copy[key] = undefined as never;
  }
  return copy;
}
