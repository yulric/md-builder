import {toMarkdownString } from './builder';
import { h1Content, h2Content, textContent, linkContent, codeContent, orderedListContent, unorderedListContent } from './node-content-types';
import { MarkdownNode, h1NodeType, h2NodeType, textNodeType, linkNodeType, codeNodeType, orderedListNodeType, unorderedListNodeType } from './node';

export interface NodeStringifier<T> {
    toMarkdown: (node: MarkdownNode<T>) => string;
    canStringifyNode: (node: MarkdownNode<T>) => boolean;
}

const h1NodeStringifier: NodeStringifier<h1Content> = {
    toMarkdown: function(node) {
        return `# ${node.content}`;
    },
    canStringifyNode: function(node) {
        return node.type === h1NodeType;
    }
}

const h2NodeStringifier: NodeStringifier<h2Content> = {
    toMarkdown: function(node) {
        return `## ${node.content}`;
    },
    canStringifyNode: function(node) {
        return node.type === h2NodeType;
    }
}

const textNodeStringifier: NodeStringifier<textContent> = {
    toMarkdown: function(node) {
        return `${node.content}`;
    },
    canStringifyNode: function(node) {
        return node.type === textNodeType;
    }
}

const linkNodeStringifier: NodeStringifier<linkContent> = {
    toMarkdown: function(node) {
        return `[${node.content.linkLabel}](${node.content.linkTo})`;
    },
    canStringifyNode: function(node) {
        return node.type === linkNodeType;
    }
}

const codeNodeStringifier: NodeStringifier<codeContent> = {
    toMarkdown: function(node) {
        return `\`\`\`\n${node.content}\n\`\`\``;
    },
    canStringifyNode: function(node) {
        return node.type === codeNodeType;
    }
}

function getTabsForList(listLevel: number) {
    let tabs = '';

    for(let listLevelIndex=listLevel; listLevelIndex>0; listLevelIndex--) {
        tabs+='\t';
    }

    return tabs;
}

function getListStringifier(getListPlaceholder: (contentItem: MarkdownNode<any>, index: number) => string) {
    return function(node: MarkdownNode<Array<MarkdownNode<any>>>, listLevel: number=0) {
        const tabs = getTabsForList(listLevel);

        return node.content.map((contentItem, index) => {
            if(orderedListNodeStringifier.canStringifyNode(contentItem)) {
                return orderedListNodeStringifier.toMarkdown(contentItem);
            }
            else if(unorderedListNodeStringifier.canStringifyNode(contentItem)) {
                return unorderedListNodeStringifier.toMarkdown(contentItem);
            }
            else {
                return `${tabs}${getListPlaceholder(contentItem, index)} ${toMarkdownString(contentItem)}` 
            }
        })
        .join('\n');
    }
}

const orderedListNodeStringifier: NodeStringifier<orderedListContent> = {
    toMarkdown: getListStringifier(function(contentItem, index) {
        contentItem;

        return `${index}. `
    }),
    canStringifyNode: function(node) {
        return node.type === orderedListNodeType;
    }
}

const unorderedListNodeStringifier: NodeStringifier<unorderedListContent> = {
    toMarkdown: getListStringifier(function() {
        return '* ';
    }),
    canStringifyNode: function(node) {
        return node.type === unorderedListNodeType;
    }
}

export const NodeStringifiers = [
    h1NodeStringifier,
    h2NodeStringifier,
    textNodeStringifier,
    linkNodeStringifier,
    codeNodeStringifier,
    orderedListNodeStringifier,
    unorderedListNodeStringifier
]

