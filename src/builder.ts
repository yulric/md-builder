import { NodeStringifiers, NodeStringifier } from "./node-stringifiers";
import {
  h1Content,
  h2Content,
  textContent,
  codeContent,
  linkContent,
  orderedListContent,
  unorderedListContent,
  h3Content
} from "./node-content-types";
import {
  MarkdownNode,
  h1NodeType,
  h2NodeType,
  textNodeType,
  linkNodeType,
  codeNodeType,
  orderedListNodeType,
  unorderedListNodeType,
  h3NodeType
} from "./node";

export type NodeBuilderFunction<T> = (content: T) => IMarkdownBuilder;

export interface IMarkdownBuilder {
  h1: NodeBuilderFunction<h1Content>;
  h2: NodeBuilderFunction<h2Content>;
  h3: NodeBuilderFunction<h3Content>;
  text: NodeBuilderFunction<textContent>;
  link: NodeBuilderFunction<linkContent>;
  code: NodeBuilderFunction<codeContent>;
  orderedList: NodeBuilderFunction<orderedListContent>;
  unorderedList: NodeBuilderFunction<unorderedListContent>;
  toMarkdownNode(): MarkdownNode<any>;
  toMarkdown: () => string;
}

function getNodeBuilderFunctionForType<T>(
  type: string,
  rootNode: MarkdownNode<any> | null,
  currentNode: null | MarkdownNode<any>
) {
  return function(content: T): IMarkdownBuilder {
    //The node object
    const node = {
      type,
      content,
      nextNode: null
    };

    //If the tree has not been intialised yet
    if (!rootNode) {
      //Return a new markdown instance where the rootNode and the currentNode is the node object
      return markdownBuilderFactory(node, node);
    }
    //if this is not the first node in the tree
    else if (currentNode) {
      //link the last node in the tree to the build node object
      currentNode.nextNode = node;
    }

    //Return a new instance of the markdown builder with the updated tree of nodes
    return markdownBuilderFactory(rootNode, node);
  };
}

export function toMarkdownString(node: MarkdownNode<any> | null): string {
  //null return empty string. Case when a user does not add anything to the tree of nodes and called toMarkdownString
  if (node === null) {
    return "";
  } else {
    //Initialise the current node we are converting to string to the node param
    let currentNode: MarkdownNode<any> | null = node;
    //Initialise the markdown string to an empty string
    let markdownString = "";

    //Until we run out of nodes to convert to markdown string
    while (currentNode !== null) {
      //Find a node stringifier for the current node
      let nodeStringifierForCurrentNode = NodeStringifiers.find(
        nodeStringifier => {
          return (nodeStringifier as NodeStringifier<any>).canStringifyNode(
            currentNode as MarkdownNode<any>
          );
        }
      );

      //Did not find one. Something is wrong
      if (!nodeStringifierForCurrentNode) {
        throw new Error(`Unknown node type ${currentNode.type}`);
      }
      //Otherwise convert the current node to a string and add it to the markdownString var
      else {
        markdownString += `${
          markdownString === "" ? "" : "\n"
        }${(nodeStringifierForCurrentNode as NodeStringifier<any>).toMarkdown(
          currentNode
        )}\n`;
      }

      //Update the currentNode to the next node in the string
      currentNode = currentNode.nextNode;
    }

    //Done
    return markdownString;
  }
}

function markdownBuilderFactory(
  rootNode: MarkdownNode<any> | null,
  node: null | MarkdownNode<any>
): IMarkdownBuilder {
  return {
    h1: getNodeBuilderFunctionForType(h1NodeType, rootNode, node),
    h2: getNodeBuilderFunctionForType(h2NodeType, rootNode, node),
    h3: getNodeBuilderFunctionForType(h3NodeType, rootNode, node),
    text: getNodeBuilderFunctionForType(textNodeType, rootNode, node),
    link: getNodeBuilderFunctionForType(linkNodeType, rootNode, node),
    code: getNodeBuilderFunctionForType(codeNodeType, rootNode, node),
    orderedList: getNodeBuilderFunctionForType(
      orderedListNodeType,
      rootNode,
      node
    ),
    unorderedList: getNodeBuilderFunctionForType(
      unorderedListNodeType,
      rootNode,
      node
    ),
    toMarkdown: function() {
      return toMarkdownString(rootNode);
    },
    toMarkdownNode: function() {
      if (rootNode) {
        return rootNode;
      } else {
        throw new Error(`node is null`);
      }
    }
  };
}

export const MarkdownBuilder = markdownBuilderFactory(null, null);
