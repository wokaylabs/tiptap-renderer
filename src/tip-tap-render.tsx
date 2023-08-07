import React from 'react';

import { CodeBlockNode, HeadingNode, LinkMark, TextNode, TipTapBaseNode, TipTapRenderHandlers } from './interfaces';

/**
 * Render a tip tap JSON node and all its children
 * @param { TipTapBaseNode} node JSON node to render
 * @param { TipTapNodeHandlers} handlers a handler for each node type
 * @returns tree of components as react elements
 */
export function TipTapRender(props: { node: TipTapBaseNode; handlers: TipTapRenderHandlers }): JSX.Element {
  const { node, handlers: mapping } = props;
  // recursively render child content
  const children: JSX.Element[] = [];
  node.content &&
    node.content.forEach((child, ix) => {
      children.push(React.createElement(TipTapRender, { node: child, handlers: mapping, key: `${child.type}-${ix}` }));
    });

  const nodeType = node.type;
  // return empty if we are missing a handler for this type
  if (!(nodeType in props.handlers)) {
    console.info(`tiptap renderer, missing node type`, nodeType, node);
    return React.createElement(React.Fragment, null);
  }

  let renderedElement: JSX.Element | null = null;
  if (nodeType === 'text') {
    renderedElement = React.createElement(mapping[nodeType], { node: node as TextNode, children }, children);
  } else if (nodeType === 'heading') {
    renderedElement = React.createElement(mapping[nodeType], { node: node as HeadingNode, children }, children);
  } else if (nodeType === 'codeBlock') {
    renderedElement = React.createElement(mapping[nodeType], { node: node as CodeBlockNode, children }, children);
  } else if (nodeType === 'paragraph' && !node.content) {
    // special case for empty paragraphs, make it hard break
    renderedElement = React.createElement(mapping['hardBreak'], { node: node, children }, children);
  } else {
    renderedElement = React.createElement(mapping[nodeType], { node: node, children }, children);
  }

  // now wrap all the marks
  if (node.marks) {
    node.marks.forEach((mark) => {
      const markType = mark.type;
      if (markType in props.handlers) {
        switch (markType) {
          case 'link':
            renderedElement = React.createElement(mapping[markType], {
              node: mark as LinkMark,
              children: renderedElement,
            });
            break;
          default:
            renderedElement = React.createElement(mapping[markType], {
              node: mark,
              children: renderedElement,
            });
            break;
        }
      } else {
        console.info(`tiptap renderer, missing mark type`, markType, mark);
      }
    });
  }
  return renderedElement;
}
