import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(value: string) {
  return marked.parse(value) as string;
}
