import { NodeStringifiers, NodeStringifier } from './node-stringifiers';
import { h1Content, h2Content, textContent, codeContent, linkContent, orderedListContent, unorderedListContent } from './node-content-types';
import { MarkdownNode, h1NodeType, h2NodeType, textNodeType, linkNodeType, codeNodeType, orderedListNodeType, unorderedListNodeType } from './node';

/**
 * Function which returns the a MarkdownBuilder instance with the updated tree of nodes. The generic parameter T is the information needed to build this node object which will be used to update the tree of nodes
 */
export type NodeBuilderFunction<T> = (content: T) => IMarkdownBuilder;

/**
 * An instance of the MarkdownBuilder
 * 
 * @export
 * @interface IMarkdownBuilder
 */
export interface IMarkdownBuilder {
    /**
     * Adds an h1 node
     * 
     * @type {NodeBuilderFunction<h1Content>}
     * @memberof IMarkdownBuilder
     */
    h1: NodeBuilderFunction<h1Content>;
    /**
     * Adds an h2 node
     * 
     * @type {NodeBuilderFunction<h2Content>}
     * @memberof IMarkdownBuilder
     */
    h2: NodeBuilderFunction<h2Content>;
    /**
     * Adds a text node
     * 
     * @type {NodeBuilderFunction<textContent>}
     * @memberof IMarkdownBuilder
     */
    text: NodeBuilderFunction<textContent>;
    /**
     * Adds a link node
     * 
     * @type {NodeBuilderFunction<linkContent>}
     * @memberof IMarkdownBuilder
     */
    link: NodeBuilderFunction<linkContent>;
    /**
     * Adds a link node
     * 
     * @type {NodeBuilderFunction<codeContent>}
     * @memberof IMarkdownBuilder
     */
    code: NodeBuilderFunction<codeContent>;
    /**
     * Adds an ordered list node
     * 
     * @type {NodeBuilderFunction<orderedListContent>}
     * @memberof IMarkdownBuilder
     */
    orderedList: NodeBuilderFunction<orderedListContent>;
    /**
     * Adds a unordered list node
     * 
     * @type {NodeBuilderFunction<unorderedListContent>}
     * @memberof IMarkdownBuilder
     */
    unorderedList: NodeBuilderFunction<unorderedListContent>;
    /**
     * Returns the current tree of nodes 
     * 
     * @returns {MarkdownNode<any>} 
     * 
     * @memberof IMarkdownBuilder
     */
    toMarkdownNode(): MarkdownNode<any>;
    /**
     * Returns the markdown string for the current tree of nodes
     * 
     * 
     * @memberof IMarkdownBuilder
     */
    toMarkdown: () => string;
}

/**
 * Returns the NodeBuilder function for the node type specififed in the type paramater
 * 
 * @template T The type of the content parameter in the returned NodeBuilder function
 * @param {string} type The unique identifier for the node this NodeBuilder function is for
 * @param {(null | MarkdownNode<any>)} rootNode The root node in the tree for the current MarkdownBuilder instance. null if nothing has been added to the tree
 * @param {(null | MarkdownNode<any>)} currentNode The last node added to the tree. null if there are no nodes in tree
 * @returns 
 */
function getNodeBuilderFunctionForType<T>(type: string, rootNode: MarkdownNode<any> | null, currentNode: null | MarkdownNode<any>) {
    return function(content: T): IMarkdownBuilder {
        //The node object
        const node = {
            type,
            content,
            nextNode: null
        };

        //If the tree has not been intialised yet
        if(!rootNode) {
            //Return a new markdown instance where the rootNode and the currentNode is the node object
            return markdownBuilderFactory(node, node);
        }
        //if this is not the first node in the tree
        else if(currentNode) {
            //link the last node in the tree to the build node object
            currentNode.nextNode = node
        }

        //Return a new instance of the markdown builder with the updated tree of nodes
        return markdownBuilderFactory(rootNode, node);
    }
}

/**
 * Converts the passed node into it's markdown string
 * 
 * @export
 * @param {(MarkdownNode<any> | null)} node The root node in the tree of nodes we need to convert to a Markdown string
 * @returns {string} 
 */
export function toMarkdownString(node: MarkdownNode<any> | null): string {
    //null return empty string. Case when a user does not add anything to the tree of nodes and called toMarkdownString
    if(node === null) {
        return '';
    }
    else {
        //Initialise the current node we are converting to string to the node param
        let currentNode: MarkdownNode<any> | null = node;
        //Initialise the markdown string to an empty string
        let markdownString = '';

        //Until we run out of nodes to convert to markdown string
        while(currentNode !== null) {
            //Find a node stringifier for the current node
            let nodeStringifierForCurrentNode = NodeStringifiers
                .find((nodeStringifier) => {
                    return (nodeStringifier as NodeStringifier<any>)
                        .canStringifyNode(currentNode as MarkdownNode<any>)
                });
            
            //Did not find one. Something is wrong
            if(!nodeStringifierForCurrentNode) {
                throw new Error(`Unknown node type ${currentNode.type}`);
            }
            //Otherwise convert the current node to a string and add it to the markdownString var
            else {
                markdownString+= `${markdownString === '' ? '' : '\n'}${(nodeStringifierForCurrentNode as NodeStringifier<any>).toMarkdown(currentNode)}\n`;
            }

            //Update the currentNode to the next node in the string
            currentNode = currentNode.nextNode;
        }

        //Done
        return markdownString;
    }
}

/**
 * Returns a new MarkdownBuilder instance 
 * 
 * @param {(MarkdownNode<any> | null)} rootNode The top most object in the tree of nodes
 * @param {(null | MarkdownNode<any>)} node The bottom node in the tree
 * @returns {IMarkdownBuilder} 
 */
function markdownBuilderFactory(rootNode: MarkdownNode<any> | null, node: null | MarkdownNode<any>): IMarkdownBuilder {
    return {
        h1: getNodeBuilderFunctionForType(h1NodeType, rootNode, node),
        h2: getNodeBuilderFunctionForType(h2NodeType, rootNode, node),
        text: getNodeBuilderFunctionForType(textNodeType, rootNode, node),
        link: getNodeBuilderFunctionForType(linkNodeType, rootNode, node),
        code: getNodeBuilderFunctionForType(codeNodeType, rootNode, node),
        orderedList: getNodeBuilderFunctionForType(orderedListNodeType, rootNode, node),
        unorderedList: getNodeBuilderFunctionForType(unorderedListNodeType, rootNode, node),
        toMarkdown: function() {
            return toMarkdownString(rootNode);
        },
        toMarkdownNode: function() {
            if(rootNode) {
                return rootNode;
            }
            else {
                throw new Error(`node is null`);
            }
        }
    }
}

export const MarkdownBuilder = markdownBuilderFactory(null, null);