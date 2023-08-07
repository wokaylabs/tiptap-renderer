import React, { useMemo } from 'react';
import { TipTapMarkHandlers, TipTapNodeHandlers, TipTapRenderHandlers } from './interfaces';
import { TipTapRender } from './tip-tap-render';

/**
 * this is an implementation of the renderer interface using html native tags, a similar renderer can be written for react-native or using any UI library
 */

const Heading = (props: { level: '1' | '2' | '3'; children: React.ReactNode }) => {
  switch (props.level) {
    case '1':
      return <h1>{props.children}</h1>;
    case '2':
      return <h2>{props.children}</h2>;
    case '3':
      return <h3>{props.children}</h3>;
    default:
      return <h3>{props.children}</h3>;
  }
};

const markHandlers: TipTapMarkHandlers = {
  link: (props) => (
    <a href={props.node.attrs.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  ),
  bold: (props) => <b>{props.children}</b>,
  italic: (props) => <i>{props.children}</i>,
  underline: (props) => <u>{props.children}</u>,
  strike: (props) => <s>{props.children}</s>,
  code: (props) => <code>{props.children}</code>,
};

const nodeHandlers: TipTapNodeHandlers = {
  doc: (props) => <>{props.children}</>,
  text: (props) => <span>{props.node.text}</span>,
  paragraph: (props) => <p>{props.children}</p>,
  heading: (props) => <Heading level={props.node.attrs.level}>{props.children}</Heading>,
  hardBreak: () => <br />,
  bulletList: (props) => <ul>{props.children}</ul>,
  orderedList: (props) => <ol>{props.children}</ol>,
  listItem: (props) => <li>{props.children}</li>,
  codeBlock: (props) => (
    <pre>
      <code>{props.children}</code>
    </pre>
  ),
  horizontalRule: () => <hr />,
  blockquote: (props) => <blockquote>{props.children}</blockquote>,
};

const handlers: TipTapRenderHandlers = {
  ...markHandlers,
  ...nodeHandlers,
};

export const SampleRenderer = ({ content }: { content: string }) => {
  const contentJson = useMemo(() => JSON.parse(content), [content]);

  return (
    <div className="renderer-container">
      <TipTapRender node={contentJson} handlers={handlers} />
    </div>
  );
};
