# react-splitter

[![GitHub](https://img.shields.io/badge/source-GitHub-blue)](https://github.com/cabezonidas/react-splitter)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2175e1e9-cbb3-4f8e-9592-7299673a96f5/deploy-status)](https://app.netlify.com/sites/react-splitter/deploys)
[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://react-splitter.netlify.app/)

### Splitter container for React apps

`<div />` component that appends a resizable separator between its children. It accepts keyboard interaction, and can be branded.

**Note:** The separator is appended as long as the `<Splitter />` component has 2 child HTML element nodes.

[Open examples on CodeSandbox](https://codesandbox.io/p/sandbox/react-toast-forked-fz3rrc)

```ts
// Include stylesheet in your application
import "@cabezonidas/react-splitter/index.css";

export const Example = () => {
  return (
    // Render 2 children HTML elements
    <Splitter className="some-class">
      <section />
      <section />
    </Splitter>
  )
}
```

**Resources**

- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

**Horizontal**
[![Horizontal](https://github.com/cabezonidas/react-splitter/blob/main/assets/horizontal-splitter.gif?raw=true)](https://react-splitter.netlify.app/?path=/story/splitter--horizontal)

**Vertical**
[![Vertical](https://github.com/cabezonidas/react-splitter/blob/main/assets/vertical-splitter.gif?raw=true)](https://react-splitter.netlify.app/?path=/story/splitter--vertical)

**Custom navbar**
[![Navbar](https://github.com/cabezonidas/react-splitter/blob/main/assets/splitter-confluence.gif?raw=true)](https://react-splitter.netlify.app/?path=/story/splitter--navbar)
