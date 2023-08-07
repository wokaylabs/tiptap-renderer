# Tiptap Renderer For React Environments

[![npm](https://img.shields.io/npm/v/@wokaylabs/tiptap-react-render.svg?style=flat)](https://www.npmjs.com/package/@wokaylabs/tiptap-react-render)

A typescript lightweight library for rendering TipTap JSON payloads in React or React like Environment. Zero Depedencies.

# TipTap React Render

This library gives an interface to render [TipTap](https://tiptap.dev/) JSON payloads in React and React Native Client.

### Installation

```sh
# npm
npm install @wokaylabs/tiptap-react-render

# yarn
yarn add @wokaylabs/tiptap-react-render
```

### Usage

Check `./src/example.tsx` file for a simple renderer example.

### Why?

- Rendering a lot of rich text elements efficiently for e.g. chat messages
- Rendering single instance read-only use cases like blog, without adding TipTap as a dependency
- Rendering on platforms which don't support Tiptap like [React Native](https://reactnative.dev/), [term.ink](term.ink) or [React Email](https://react.email/)
- A performant alternative to Read Only mode of TipTap

Many folks render TipTap rich text by embedding the TipTap editor in a "read-only" mode. However, if you don't want to add TipTap as a dependency (or, like us, you're using a platform that can't support it like React Native), then this is a simple, lightweight tool for mapping TipTap nodes to presentation components!

### Acknowledgements

This library started as a fork of [troop's renderer](https://github.com/troop-dev/tiptap-react-render) with strict typescript types aligning more closely with the tiptap schema.
