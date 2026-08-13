import { createLowlight } from 'lowlight'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import lua from 'highlight.js/lib/languages/lua'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

import {
  getNotionCodeLanguageClassToken,
  normalizeNotionCodeLanguage,
} from './code-languages.js'

const languages = {
  bash,
  css,
  javascript,
  json,
  lua,
  markdown,
  plaintext,
  python,
  sql,
  typescript,
  xml,
  yaml,
}

const highlighter = createLowlight(languages)

highlighter.registerAlias({
  bash: ['shell', 'sh'],
  javascript: ['js', 'jsx'],
  markdown: ['md'],
  plaintext: ['text', 'txt'],
  typescript: ['ts', 'tsx'],
  xml: ['html'],
  yaml: ['yml'],
})

function getLanguage(node) {
  const classNames = node.properties?.className

  if (!Array.isArray(classNames)) {
    return ''
  }

  for (const className of classNames) {
    const match = String(className).match(/^(?:lang|language)-(.+)$/)

    if (match) {
      return match[1].toLowerCase()
    }
  }

  return ''
}

function getText(node) {
  if (node.type === 'text') {
    return node.value
  }

  return Array.isArray(node.children) ? node.children.map(getText).join('') : ''
}

function visit(node) {
  if (!Array.isArray(node.children)) {
    return
  }

  for (const child of node.children) {
    if (child.type === 'element' && child.tagName === 'pre') {
      const code = child.children?.[0]
      const sourceLanguage = code?.type === 'element' ? getLanguage(code) : ''
      const language = normalizeNotionCodeLanguage(sourceLanguage)
      const classToken = getNotionCodeLanguageClassToken(language)

      child.properties = {
        ...child.properties,
        dataCodeLanguage: language,
        dataLanguage: language,
      }

      if (code?.type === 'element') {
        const classNames = Array.isArray(code.properties?.className)
          ? code.properties.className
          : []
        code.properties = {
          ...code.properties,
          className: [
            `language-${classToken}`,
            ...classNames.filter(
              (name) =>
                name !== 'hljs' && !/^(?:lang|language)-/.test(name),
            ),
          ],
          dataCodeLanguage: language,
          dataLanguage: language,
        }

        const highlightLanguage = sourceLanguage || classToken

        if (highlighter.registered(highlightLanguage)) {
          code.properties.className.unshift('hljs')
          code.children = highlighter.highlight(
            highlightLanguage,
            getText(code),
          ).children
        }
      }
    }

    visit(child)
  }
}

export function highlightCode() {
  return (tree) => {
    visit(tree)
  }
}
