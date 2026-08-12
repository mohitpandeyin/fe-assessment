# Before malformed content

This emphasis is *not closed.

[This link is not closed](https://example.com

> A quote that still contains readable content

1. A list item
   - A nested item
  - An inconsistently indented item remains readable

| Broken | Table |
| --- | ---
| one | two |

```javascript
const fenceWasNeverClosed = true

## This heading remains literal inside the unclosed fence
