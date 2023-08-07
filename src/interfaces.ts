// https://tiptap.dev/guide/output
/**
 * There are two types of things which render.
 * Node - text, paragraph, mention etc. - https://tiptap.dev/api/nodes
 * Marks - wraps around the node, like bold, italic, link etc. - https://tiptap.dev/api/marks
 * "bold" | "code" | "italic" | "link" | "strike" | "underline" | "textStyle"
 *
 * Nodes can be nested within each other. Any node can have multiple marks associated with it.
 * A mark doesn't have a standalone existence. It is always associated with a node.
 */

type NodeTypes = keyof TipTapNodeHandlers;
type MarkTypes = keyof TipTapMarkHandlers;

export interface TipTapBaseNode {
  type: NodeTypes;
  attrs?: Record<string, any>;
  marks?: TipTapBaseMark[];
  content?: TipTapBaseNode[];
  readonly [attr: string]: any;
}

export interface TipTapBaseMark {
  type: MarkTypes;
  attrs?: Record<string, any>;
}

export type TipTapNodeHandler<T extends TipTapBaseNode = TipTapBaseNode> = (props: {
  children: React.ReactNode;
  node: T;
}) => JSX.Element;

export type TipTapMarkHandler<T extends TipTapBaseMark = TipTapBaseMark> = (props: {
  children: React.ReactNode;
  node: T;
}) => JSX.Element;

export interface TipTapNodeHandlers {
  text: TipTapNodeHandler<TextNode>;
  doc: TipTapNodeHandler;
  paragraph: TipTapNodeHandler;
  heading: TipTapNodeHandler<HeadingNode>;
  hardBreak: TipTapNodeHandler;
  bulletList: TipTapNodeHandler;
  listItem: TipTapNodeHandler;
  orderedList: TipTapNodeHandler;
  horizontalRule: TipTapNodeHandler;
  codeBlock: TipTapNodeHandler<CodeBlockNode>;
  blockquote: TipTapNodeHandler;
}

export interface TipTapMarkHandlers {
  link: TipTapMarkHandler<LinkMark>;
  bold: TipTapMarkHandler;
  code: TipTapMarkHandler;
  italic: TipTapMarkHandler;
  strike: TipTapMarkHandler;
  underline: TipTapMarkHandler;
}

// this is the interface the renderer needs to implement
export type TipTapRenderHandlers = TipTapNodeHandlers & TipTapMarkHandlers;

export interface TextNode extends TipTapBaseNode {
  type: 'text';
  text: string;
  content?: undefined;
}

export interface HeadingNode extends TipTapBaseNode {
  type: 'heading';
  attrs: {
    level: '1' | '2' | '3';
  };
}

export interface CodeBlockNode extends TipTapBaseNode {
  type: 'codeBlock';
  attrs: {
    language: string;
  };
}

export interface LinkMark extends TipTapBaseMark {
  type: 'link';
  attrs: {
    href: string;
  };
}
