Used to build markdown strings

# Installation

```
npm install --save md-builder
```

The --save option adds the library to the list of dependencies in your package.json file

# Getting Started

## ES6 Javascript

``` javascript
const mdBuilder = require('md-builder');
const {
    MarkdownBuilder
} = mdBuilder;

const markdownString = MarkdownBuilder
    .h1('First title')
    .h2('Second title')
    .text('Some text')
    .link({
        linkTo: 'http://somewebsite.com',
        linkLabel: 'Link to some website'
    })
    .code('var code = "sample code"')
    .orderedList(
        [
            MarkdownBuilder.text('First item').toMarkdownNode(),
            MarkdownBuilder.text('Second item').toMarkdownNode()
        ]
    )
    .unorderedList(
        [
            MarkdownBuilder.text('Random item').toMarkdownNode(),
            MarkdownBuilder.text('Randomz item').toMarkdownNode()
        ]
    )
    .toMarkdown();
```

## Typescript
``` javascript
import { MarkdownBuilder } from 'md-builder';

const markdownString = MarkdownBuilder
    .h1('First title')
    .h2('Second title')
    .text('Some text')
    .link({
        linkTo: 'http://somewebsite.com',
        linkLabel: 'Link to some website'
    })
    .code('var code = "sample code"')
    .orderedList(
        [
            MarkdownBuilder.text('First item').toMarkdownNode(),
            MarkdownBuilder.text('Second item').toMarkdownNode()
        ]
    )
    .unorderedList(
        [
            MarkdownBuilder.text('Random item').toMarkdownNode(),
            MarkdownBuilder.text('Randomz item').toMarkdownNode()
        ]
    )
    .toMarkdown();
```

## ES5 Javascript
``` javascript
var mdBuilder = require('builder');
var markdownBuilder = mdBuilder.MarkdownBuilder;

var markdownString = MarkdownBuilder
    .h1('First title')
    .h2('Second title')
    .text('Some text')
    .link({
        linkTo: 'http://somewebsite.com',
        linkLabel: 'Link to some website'
    })
    .code('var code = "sample code"')
    .orderedList(
        [
            MarkdownBuilder.text('First item').toMarkdownNode(),
            MarkdownBuilder.text('Second item').toMarkdownNode()
        ]
    )
    .unorderedList(
        [
            MarkdownBuilder.text('Random item').toMarkdownNode(),
            MarkdownBuilder.text('Randomz item').toMarkdownNode()
        ]
    )
    .toMarkdown();
```