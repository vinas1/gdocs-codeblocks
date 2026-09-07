/**
 * Version 0.1.3
 * see my repo for updates to this project https://github.com/vinas1/gdocs-codeblocks
 *
 * @OnlyCurrentDoc
 * Google Docs code-block formatter with basic syntax highlighting.
 * No external services are used.
 */

var THEME = {
  bg: '#1E1E2E', text: '#CDD6F4', keyword: '#CBAEFB',
  string: '#A6E3A1', comment: '#6C7086', number: '#FAB387',
  property: '#89B4FA', variable: '#F9E2AF', directive: '#F38BA8',
  status: '#94E2D5'
};

var KEYWORDS = {
  javascript: 'async await break case catch class const continue default delete do else export extends false finally for from function get if import in instanceof let new null of return set static super switch this throw true try typeof undefined var void while yield',
  typescript: 'abstract any as asserts async await boolean break case catch class const constructor continue declare default delete do else enum export extends false finally for from function get if implements import in infer instanceof interface is keyof let namespace never new null number object of private protected public readonly return set static string super switch symbol this throw true try type typeof undefined unknown var void while yield',
  bash: 'case do done elif else esac export fi for function if in local readonly select then until while',
  python: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield',
  c: 'auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while',
  cpp: 'alignas alignof auto bool break case catch char class concept const constexpr continue default delete do double else enum explicit export extern false float for friend if inline int long mutable namespace new noexcept nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while',
  csharp: 'abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally float for foreach if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly record ref return sealed short static string struct switch this throw true try typeof uint ulong using var virtual void while async await',
  php: 'abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty extends final finally fn for foreach function global if implements include instanceof interface isset match namespace new or print private protected public readonly require return static switch throw trait try unset use var while xor yield true false null',
  go: 'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var',
  swift: 'break case catch class continue default defer do else enum extension false final for func guard if import in init internal let nil open override private protocol public return self static struct super switch throw true try typealias var where while',
  kotlin: 'abstract actual annotation as break by catch class companion const constructor continue data do else enum false final finally for fun if import in interface internal is lateinit null object open operator override package private protected public return sealed super suspend this throw true try typealias val var when where while',
  sql: 'add all alter and any as asc between by case check column constraint create database default delete desc distinct drop else end exists foreign from full group having in index inner insert into is join key left like limit not null offset on or order outer primary references right select set table then truncate union unique update values view when where with returning over partition',
  makefile: 'define endef undefine ifdef ifndef ifeq ifneq else endif include sinclude override export unexport private vpath',
  powershell: 'begin break catch class continue data do dynamicparam else elseif end enum exit filter finally for foreach from function if in param process return switch throw trap try until using var while workflow'
};

function onOpen() {
  var ui = DocumentApp.getUi();
  var menu = ui.createMenu('Highlight as language')
    .addItem('JavaScript', 'fmtJavaScript').addItem('TypeScript', 'fmtTypeScript')
    .addSeparator().addItem('Bash / Shell', 'fmtBash').addItem('PowerShell', 'fmtPowerShell')
    .addSeparator().addItem('YAML', 'fmtYaml').addItem('JSON', 'fmtJson')
    .addItem('HTTP', 'fmtHttp').addItem('Markdown', 'fmtMarkdown')
    .addSeparator().addItem('Python', 'fmtPython').addItem('PHP', 'fmtPhp')
    .addItem('Go', 'fmtGo').addItem('Swift', 'fmtSwift').addItem('Kotlin', 'fmtKotlin')
    .addSeparator().addItem('C', 'fmtC').addItem('C++', 'fmtCpp').addItem('C#', 'fmtCSharp')
    .addSeparator().addItem('SQL', 'fmtSql').addItem('Dockerfile', 'fmtDockerfile')
    .addItem('Makefile', 'fmtMakefile');

  ui.createMenu('Code Block')
    .addItem('Auto-detect and highlight', 'fmtAuto')
    .addSubMenu(menu).addSeparator()
    .addItem('Remove code formatting', 'removeCodeFormatting').addToUi();
}

function fmtAuto(){formatSelection('auto');}
function fmtJavaScript(){formatSelection('javascript');}
function fmtTypeScript(){formatSelection('typescript');}
function fmtBash(){formatSelection('bash');}
function fmtPowerShell(){formatSelection('powershell');}
function fmtYaml(){formatSelection('yaml');}
function fmtJson(){formatSelection('json');}
function fmtHttp(){formatSelection('http');}
function fmtMarkdown(){formatSelection('markdown');}
function fmtPython(){formatSelection('python');}
function fmtPhp(){formatSelection('php');}
function fmtGo(){formatSelection('go');}
function fmtSwift(){formatSelection('swift');}
function fmtKotlin(){formatSelection('kotlin');}
function fmtC(){formatSelection('c');}
function fmtCpp(){formatSelection('cpp');}
function fmtCSharp(){formatSelection('csharp');}
function fmtSql(){formatSelection('sql');}
function fmtDockerfile(){formatSelection('dockerfile');}
function fmtMakefile(){formatSelection('makefile');}

function formatSelection(requestedLanguage) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (!selection) {
    DocumentApp.getUi().alert('Select the code, then use the Code Block menu.');
    return;
  }

  var items = selection.getRangeElements();
  var count = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = item.getElement();
    if (typeof element.editAsText !== 'function') continue;

    var text = element.editAsText();
    var all = text.getText();
    if (!all) continue;

    var start = item.isPartial() ? item.getStartOffset() : 0;
    var end = item.isPartial() ? item.getEndOffsetInclusive() : all.length - 1;
    if (start < 0 || end < start || end >= all.length) continue;

    var source = all.substring(start, end + 1);
    var language = requestedLanguage === 'auto' ? detectLanguage(source) : requestedLanguage;

    text.setFontFamily(start, end, 'Roboto Mono');
    text.setFontSize(start, end, 10);
    text.setForegroundColor(start, end, THEME.text);
    text.setBackgroundColor(start, end, THEME.bg);
    text.setBold(start, end, false);
    text.setItalic(start, end, false);
    text.setUnderline(start, end, false);

    highlight(text, source, start, language);
    count++;
  }

  if (!count) DocumentApp.getUi().alert('The selection did not contain editable text.');
}

function highlight(text, source, offset, language) {
  var used = new Array(source.length);
  for (var i = 0; i < used.length; i++) used[i] = false;
  var rules = buildRules(language);
  for (var j = 0; j < rules.length; j++) applyRule(text, source, offset, rules[j], used);
}

function rule(pattern, color, bold, italic, group) {
  return {pattern:pattern, color:color, bold:!!bold, italic:!!italic, group:group || 0};
}

function buildRules(language) {
  var r = [];
  var cStyle = ['javascript','typescript','c','cpp','csharp','php','go','swift','kotlin'];

  if (cStyle.indexOf(language) >= 0) {
    r.push(rule(/\/\*[\s\S]*?\*\//g, THEME.comment, false, true));
    r.push(rule(/\/\/[^\n]*/g, THEME.comment, false, true));
  }
  if (['python','bash','yaml','dockerfile','makefile','php'].indexOf(language) >= 0)
    r.push(rule(/#[^\n]*/g, THEME.comment, false, true));
  if (language === 'powershell') {
    r.push(rule(/<#[\s\S]*?#>/g, THEME.comment, false, true));
    r.push(rule(/#[^\n]*/g, THEME.comment, false, true));
  }
  if (language === 'sql') {
    r.push(rule(/\/\*[\s\S]*?\*\//g, THEME.comment, false, true));
    r.push(rule(/--[^\n]*/g, THEME.comment, false, true));
  }
  if (language === 'markdown') r.push(rule(/<!--[\s\S]*?-->/g, THEME.comment, false, true));

  r.push(rule(/`(?:\\.|[^`\\])*`/g, THEME.string));
  r.push(rule(/"(?:\\.|[^"\\])*"/g, THEME.string));
  r.push(rule(/'(?:\\.|[^'\\])*'/g, THEME.string));

  if (KEYWORDS[language]) addKeywordRule(r, KEYWORDS[language], language === 'sql' || language === 'powershell');

  if (language === 'yaml') {
    r.push(rule(/^[ \t-]*([A-Za-z0-9_.-]+)(?=\s*:)/gm, THEME.property, true, false, 1));
    r.push(rule(/\b(?:true|false|null|yes|no|on|off)\b/gi, THEME.keyword, true));
  } else if (language === 'json') {
    r.push(rule(/"(?:\\.|[^"\\])*"(?=\s*:)/g, THEME.property, true));
    r.push(rule(/\b(?:true|false|null)\b/g, THEME.keyword, true));
  } else if (language === 'http') {
    r.push(rule(/^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)\b/gm, THEME.keyword, true));
    r.push(rule(/^HTTP\/\d(?:\.\d)?\s+\d{3}[^\n]*/gm, THEME.status, true));
    r.push(rule(/^[A-Za-z0-9-]+(?=\s*:)/gm, THEME.property, true));
    r.push(rule(/https?:\/\/[^\s]+/g, THEME.string));
  } else if (language === 'dockerfile') {
    r.push(rule(/^\s*(?:FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/gim, THEME.keyword, true));
    r.push(rule(/\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/g, THEME.variable));
  } else if (language === 'makefile') {
    r.push(rule(/^[A-Za-z0-9_./%-]+(?=\s*:)/gm, THEME.property, true));
    r.push(rule(/\$\([A-Za-z_][A-Za-z0-9_]*\)|\$\{[A-Za-z_][A-Za-z0-9_]*\}|\$[@<^?*%+|]/g, THEME.variable));
  } else if (language === 'powershell') {
    r.push(rule(/\$(?:global:|script:|local:|private:|env:)?[A-Za-z_?^][A-Za-z0-9_:?^.-]*/gi, THEME.variable));
    r.push(rule(/\b(?:Get|Set|New|Remove|Add|Clear|Copy|Move|Start|Stop|Restart|Test|Write|Read|Import|Export|Invoke|ConvertTo|ConvertFrom|Enable|Disable|Connect|Disconnect|Register|Unregister|Update|Select|Where|ForEach|Measure|Sort|Group|Format)-[A-Za-z0-9]+\b/g, THEME.property));
  } else if (language === 'bash' || language === 'php') {
    r.push(rule(/\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/g, THEME.variable));
  } else if (language === 'markdown') {
    r.push(rule(/^#{1,6}\s+[^\n]+/gm, THEME.directive, true));
    r.push(rule(/^\s*>\s+[^\n]+/gm, THEME.comment, false, true));
    r.push(rule(/!?\[[^\]]*\]\([^)]+\)/g, THEME.string));
  }

  if (['c','cpp','csharp'].indexOf(language) >= 0)
    r.push(rule(/^\s*#[A-Za-z]+[^\n]*/gm, THEME.directive, true));

  if (['javascript','typescript','c','cpp','csharp','php','go','swift','kotlin','python'].indexOf(language) >= 0)
    r.push(rule(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, THEME.property, false, false, 1));

  if (language !== 'markdown' && language !== 'http')
    r.push(rule(/\b(?:0x[0-9A-Fa-f]+|0b[01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, THEME.number));

  return r;
}

function addKeywordRule(rules, words, ignoreCase) {
  var list = words.split(/\s+/).sort(function(a,b){return b.length-a.length;});
  rules.push(rule(new RegExp('\\b(?:' + list.join('|') + ')\\b', ignoreCase ? 'gi' : 'g'), THEME.keyword, true));
}

function applyRule(text, source, offset, item, used) {
  item.pattern.lastIndex = 0;
  var match;
  while ((match = item.pattern.exec(source)) !== null) {
    var token = item.group ? match[item.group] : match[0];
    if (!token) {
      if (item.pattern.lastIndex === match.index) item.pattern.lastIndex++;
      continue;
    }
    var start = match.index + (item.group ? match[0].indexOf(token) : 0);
    var end = start + token.length - 1;
    if (isFree(used, start, end)) {
      text.setForegroundColor(offset + start, offset + end, item.color);
      text.setBold(offset + start, offset + end, item.bold);
      text.setItalic(offset + start, offset + end, item.italic);
      for (var i = start; i <= end; i++) used[i] = true;
    }
    if (item.pattern.lastIndex === match.index) item.pattern.lastIndex++;
  }
  item.pattern.lastIndex = 0;
}

function isFree(used, start, end) {
  if (start < 0 || end < start || end >= used.length) return false;
  for (var i = start; i <= end; i++) if (used[i]) return false;
  return true;
}

function detectLanguage(source) {
  var t = source.trim();
  if (/^HTTP\/\d(?:\.\d)?\s+\d{3}/m.test(t) || /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+/m.test(t)) return 'http';
  if (/^\s*(?:FROM|RUN|CMD|COPY|ENTRYPOINT|WORKDIR|ARG|ENV)\b/im.test(t)) return 'dockerfile';
  if (/(?:\$env:|Write-Host|Get-[A-Za-z]+|Param\s*\()/i.test(t)) return 'powershell';
  if (/^#!.*\b(?:bash|sh|zsh)\b/m.test(t) || /\b(?:fi|done|esac)\b/.test(t)) return 'bash';
  if (/<\?(?:php|=)?/i.test(t)) return 'php';
  if (/^\s*package\s+main\b/m.test(t) || /^\s*func\s+\w+\s*\(/m.test(t)) return 'go';
  if (/import\s+SwiftUI/.test(t)) return 'swift';
  if (/\bfun\s+\w+\s*\(/.test(t)) return 'kotlin';
  if (/using\s+System|Console\.WriteLine/.test(t)) return 'csharp';
  if (/#include/.test(t) && /std::|cout|vector</.test(t)) return 'cpp';
  if (/#include/.test(t)) return 'c';
  if (/\binterface\s+\w+|:\s*(?:string|number|boolean|unknown|any)\b/.test(t)) return 'typescript';
  if (/\b(?:const|let|var)\s+\w+|=>/.test(t)) return 'javascript';
  if (/^\s*(?:def|class)\s+\w+/m.test(t) || /^\s*(?:from|import)\s+\w+/m.test(t)) return 'python';
  if (/\b(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(t) && /\b(?:FROM|INTO|TABLE|WHERE|VALUES)\b/i.test(t)) return 'sql';
  if (/^(?:#{1,6}\s+|```|>\s+|[-*+]\s+)/m.test(t)) return 'markdown';
  if (/^\s*[A-Za-z0-9_./%-]+\s*:/m.test(t) && /\$\([A-Za-z_]/.test(t)) return 'makefile';
  try { JSON.parse(t); return 'json'; } catch (e) {}
  if (/^\s*(?:---\s*$|[A-Za-z0-9_.-]+\s*:)/m.test(t) && !/[{};]/.test(t)) return 'yaml';
  return 'javascript';
}

function removeCodeFormatting() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) {
    DocumentApp.getUi().alert('Select the formatted code first.');
    return;
  }
  var items = selection.getRangeElements();
  for (var i = 0; i < items.length; i++) {
    var item = items[i], element = item.getElement();
    if (typeof element.editAsText !== 'function') continue;
    var text = element.editAsText(), all = text.getText();
    if (!all) continue;
    var start = item.isPartial() ? item.getStartOffset() : 0;
    var end = item.isPartial() ? item.getEndOffsetInclusive() : all.length - 1;
    if (start < 0 || end < start || end >= all.length) continue;
    text.setFontFamily(start, end, 'Arial');
    text.setFontSize(start, end, 11);
    text.setForegroundColor(start, end, '#000000');
    text.setBackgroundColor(start, end, '#FFFFFF');
    text.setBold(start, end, false);
    text.setItalic(start, end, false);
    text.setUnderline(start, end, false);
  }
}
