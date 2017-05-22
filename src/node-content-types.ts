import { MarkdownNode } from './node';

export type h1Content = string;

export type h2Content = string;

export type textContent = string;

export type linkContent = {
    linkTo: string;
    linkLabel: string;
};

export type codeContent = string;

export type listContent = Array<MarkdownNode<any>>;

export type orderedListContent = listContent;

export type unorderedListContent = listContent;