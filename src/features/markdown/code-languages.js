const NOTION_CODE_LANGUAGES = [
  ['ABAP', 'abap'],
  ['Agda', 'agda'],
  ['Arduino', 'arduino'],
  ['ASCII Art', 'ascii art'],
  ['Assembly', 'assembly'],
  ['Bash', 'bash'],
  ['BASIC', 'basic'],
  ['BNF', 'bnf'],
  ['C', 'c'],
  ['C#', 'c#'],
  ['C++', 'c++'],
  ['Clojure', 'clojure'],
  ['CoffeeScript', 'coffeescript'],
  ['CSS', 'css'],
  ['Dart', 'dart'],
  ['Dhall', 'dhall'],
  ['Diff', 'diff'],
  ['Docker', 'docker'],
  ['EBNF', 'ebnf'],
  ['Elixir', 'elixir'],
  ['Elm', 'elm'],
  ['Erlang', 'erlang'],
  ['F#', 'f#'],
  ['Flow', 'flow'],
  ['Fortran', 'fortran'],
  ['Gherkin', 'gherkin'],
  ['GLSL', 'glsl'],
  ['Go', 'go'],
  ['GraphQL', 'graphql'],
  ['Groovy', 'groovy'],
  ['Haskell', 'haskell'],
  ['HCL', 'hcl'],
  ['HTML', 'html'],
  ['Idris', 'idris'],
  ['Java', 'java'],
  ['JavaScript', 'javascript'],
  ['JSON', 'json'],
  ['Julia', 'julia'],
  ['Kotlin', 'kotlin'],
  ['LaTeX', 'latex'],
  ['Less', 'less'],
  ['Lisp', 'lisp'],
  ['LiveScript', 'livescript'],
  ['LLVM IR', 'llvm ir'],
  ['Lua', 'lua'],
  ['Makefile', 'makefile'],
  ['Markdown', 'markdown'],
  ['Markup', 'markup'],
  ['Mathematica', 'mathematica'],
  ['MATLAB', 'matlab'],
  ['Mermaid', 'mermaid'],
  ['Nix', 'nix'],
  ['Notion Formula', 'notion formula'],
  ['Objective-C', 'objective-c'],
  ['OCaml', 'ocaml'],
  ['Pascal', 'pascal'],
  ['Perl', 'perl'],
  ['PHP', 'php'],
  ['Plain Text', 'plain text'],
  ['PowerShell', 'powershell'],
  ['Prolog', 'prolog'],
  ['Protobuf', 'protobuf'],
  ['PureScript', 'purescript'],
  ['Python', 'python'],
  ['R', 'r'],
  ['Racket', 'racket'],
  ['Reason', 'reason'],
  ['Rocq', 'rocq'],
  ['Ruby', 'ruby'],
  ['Rust', 'rust'],
  ['Sass', 'sass'],
  ['Scala', 'scala'],
  ['Scheme', 'scheme'],
  ['SCSS', 'scss'],
  ['Shell', 'shell'],
  ['Smalltalk', 'smalltalk'],
  ['Solidity', 'solidity'],
  ['SQL', 'sql'],
  ['Swift', 'swift'],
  ['TOML', 'toml'],
  ['TypeScript', 'typescript'],
  ['VB.Net', 'vb.net'],
  ['Verilog', 'verilog'],
  ['VHDL', 'vhdl'],
  ['Visual Basic', 'visual basic'],
  ['WebAssembly', 'webassembly'],
  ['XML', 'xml'],
  ['YAML', 'yaml'],
]

const LANGUAGE_LABELS = new Map(
  NOTION_CODE_LANGUAGES.map(([label, value]) => [value, label]),
)

const LANGUAGE_ALIASES = new Map([
  ['asm', 'assembly'],
  ['ascii-art', 'ascii art'],
  ['c-sharp', 'c#'],
  ['cpp', 'c++'],
  ['csharp', 'c#'],
  ['dockerfile', 'docker'],
  ['f-sharp', 'f#'],
  ['fsharp', 'f#'],
  ['js', 'javascript'],
  ['jsx', 'javascript'],
  ['llvm', 'llvm ir'],
  ['llvm-ir', 'llvm ir'],
  ['md', 'markdown'],
  ['notion-formula', 'notion formula'],
  ['objectivec', 'objective-c'],
  ['obj-c', 'objective-c'],
  ['objc', 'objective-c'],
  ['plain', 'plain text'],
  ['plaintext', 'plain text'],
  ['ps1', 'powershell'],
  ['pure-script', 'purescript'],
  ['py', 'python'],
  ['sh', 'shell'],
  ['text', 'plain text'],
  ['ts', 'typescript'],
  ['tsx', 'typescript'],
  ['txt', 'plain text'],
  ['vb', 'visual basic'],
  ['vb-net', 'vb.net'],
  ['vbnet', 'vb.net'],
  ['visual-basic', 'visual basic'],
  ['wasm', 'webassembly'],
  ['yml', 'yaml'],
])

const LANGUAGE_CLASS_TOKENS = new Map([
  ['ascii art', 'ascii-art'],
  ['c#', 'csharp'],
  ['c++', 'cpp'],
  ['f#', 'fsharp'],
  ['llvm ir', 'llvm-ir'],
  ['notion formula', 'notion-formula'],
  ['plain text', 'plaintext'],
  ['vb.net', 'vbnet'],
  ['visual basic', 'visual-basic'],
])

export function normalizeNotionCodeLanguage(language) {
  const normalized = String(language ?? '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')

  if (!normalized) {
    return 'plain text'
  }

  const alias = LANGUAGE_ALIASES.get(normalized) ?? normalized
  return LANGUAGE_LABELS.has(alias) ? alias : 'plain text'
}

export function getNotionCodeLanguageLabel(language) {
  const normalized = normalizeNotionCodeLanguage(language)
  return LANGUAGE_LABELS.get(normalized) ?? 'Plain Text'
}

export function getNotionCodeLanguageClassToken(language) {
  const normalized = normalizeNotionCodeLanguage(language)
  return LANGUAGE_CLASS_TOKENS.get(normalized) ?? normalized.replace(/\s+/g, '-')
}

export function getCodeLanguageFromClassName(className) {
  const match = String(className ?? '').match(/(?:^|\s)(?:lang|language)-([^\s]+)/)
  return normalizeNotionCodeLanguage(match?.[1])
}

export const NOTION_CODE_LANGUAGE_VALUES = Object.freeze(
  NOTION_CODE_LANGUAGES.map(([, value]) => value),
)
