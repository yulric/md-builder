export interface MarkdownNode<T> {
  type: string;
  content: T;
  nextNode: null | MarkdownNode<any>;
}

export const h1NodeType = "h1";

export const h2NodeType = "h2";

export const h3NodeType = "h3";

export const textNodeType = "text";

export const codeNodeType = "code";

export const linkNodeType = "link";

export const unorderedListNodeType = "unorderedList";

export const orderedListNodeType = "orderedList";
