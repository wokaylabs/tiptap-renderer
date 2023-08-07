import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import React from 'react';

import { TipTapRender } from './tip-tap-render';
import { TipTapBaseNode, TipTapNodeHandler, TipTapRenderHandlers } from './interfaces';

function elem(tag: string, props?: { [attr: string]: any }, children?: React.ReactNode): TipTapNodeHandler {
  return (nodeProps) => React.createElement(tag, props, children || nodeProps.children);
}

function fragment(node: React.ReactNode): React.ReactElement {
  return React.createElement(React.Fragment, null, node);
}

function renderTipTap(node: TipTapBaseNode, handlers: TipTapRenderHandlers) {
  return render(React.createElement(TipTapRender, { handlers: handlers, node: node }));
}

describe('tiptapParser', () => {
  it('should render an empty node', () => {
    // create a dummy renderer
    const dummy: TipTapNodeHandler = elem('div', { id: 'some-id' }, 'this a doc');
    // create a handler
    const handlers: TipTapRenderHandlers = {
      doc: dummy,
    } as unknown as TipTapRenderHandlers;
    // define a shallow tip tap node
    const node: TipTapBaseNode = {
      type: 'doc',
    };
    // render it!
    const actual = renderTipTap(node, handlers);
    expect(actual.getByText('this a doc')).toBeInTheDocument();
  });

  test('renders a child node', () => {
    // create a dummy renderer
    const parent: TipTapNodeHandler = (props) => fragment(props.children);
    const child: TipTapNodeHandler = (props) => fragment(props.node.text);
    // create a handler
    const handlers: TipTapRenderHandlers = {
      doc: parent,
      text: child,
    } as unknown as TipTapRenderHandlers;
    // define a shallow tip tap node
    const node: TipTapBaseNode = {
      type: 'doc',
      content: [
        {
          type: 'text',
          text: 'child text',
        },
      ],
    };
    // render it!
    const actual = renderTipTap(node, handlers);
    expect(actual.getByText('child text')).toBeInTheDocument();
  });

  test('renders depth 3', () => {
    // create a dummy renderer
    const doc: TipTapNodeHandler = (props) => fragment(props.children);
    const text: TipTapNodeHandler = (props) => fragment(props.node.text);
    const paragraph: TipTapNodeHandler = (props) => fragment(props.children);
    // create a handler
    const handlers: TipTapRenderHandlers = {
      doc: doc,
      text: text,
      paragraph: paragraph,
    } as unknown as TipTapRenderHandlers;
    // paragraph with text in it
    const p1: TipTapBaseNode = {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    };
    // wrap in document
    const node: TipTapBaseNode = {
      type: 'doc',
      content: [p1],
    };
    // render it!
    const actual = renderTipTap(node, handlers);
    expect(actual.getByText('hello')).toBeInTheDocument();
  });

  test('no-op on unhandled type', () => {
    // create a dummy renderer
    const doc: TipTapNodeHandler = (props) => fragment(props.children);
    const paragraph: TipTapNodeHandler = (props) => fragment(props.children);
    const text: TipTapNodeHandler = (props) => fragment(props.node.text);
    // create a handler
    const handlers: TipTapRenderHandlers = {
      doc: doc,
      text: text,
      paragraph: paragraph,
    } as unknown as TipTapRenderHandlers;
    // paragraph with text in it
    const p1: TipTapBaseNode = {
      type: 'paragraph',
      content: [{ type: 'text', text: 'text 1' }],
    };
    // unhandled type with text in it
    const p2: TipTapBaseNode = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: 'bad-type',
      content: [{ type: 'text', text: 'text 2' }],
    };
    // wrap in document
    const node: TipTapBaseNode = {
      type: 'doc',
      content: [p1, p2],
    };
    // render it!
    const actual = renderTipTap(node, handlers);
    // text 1 should render
    expect(actual.getByText('text 1')).toBeInTheDocument();
    // text 2 should not!
    expect(actual.queryByText('text 2')).toBeNull();
  });
});
