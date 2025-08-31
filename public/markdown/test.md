---
title: Markdown Test Document
author: Test Author
date: 2024-08-30
tags: [markdown, test, documentation, parser]
categories:
  - Testing
  - Documentation
description: A comprehensive test document containing all markdown elements for parser validation
keywords: markdown, parser, test, elements, syntax
lang: en
status: published
version: 1.0.0
custom_field: Custom value
nested:
  field1: value1
  field2: value2
  array:
    - item1
    - item2
    - item3
boolean_true: true
boolean_false: false
number: 42
float: 3.14
null_value: null
multiline: |
  This is a multiline
  string value that preserves
  line breaks
---



# Table of Contents
---

# Markdown Test Document

This document contains all markdown elements for testing purposes.

# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6

---

# Text Formatting

This is a normal paragraph with some **bold text** and some _italic text_ and
some _**bold italic text**_.

Alternative: This is **bold** and this is _italic_ and this is _**bold
italic**_.

This has some ~~strikethrough text~~ for deletion.

This has some `inline code` within the text.

Subscript: H~2~O (if supported) Superscript: X^2^ (if supported)

==Highlighted text== (if supported)

<u>Underlined text</u> using HTML

<mark>Marked/highlighted text</mark> using HTML

Line break with two spaces at the end\
This is on a new line

Line break with backslash\
This is also on a new line

Line break with HTML<br> This is another new line

---

# Lists

## Unordered List

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
    - Deep nested item
  - Nested item 3
- Fourth item

## Alternative Unordered List

- Item with asterisk
- Another item
  - Nested with asterisk

* Item with plus
* Another plus item
  - Nested with plus

## Ordered List

1. First item
2. Second item
3. Third item
   1. Nested item 1
   2. Nested item 2
      1. Deep nested item
   3. Nested item 3
4. Fourth item

## Mixed Lists

1. First ordered item
   - Unordered sub-item
   - Another unordered sub-item
2. Second ordered item
   1. Ordered sub-item
   2. Another ordered sub-item
      - Mixed nesting

## Task Lists

- [x] Completed task
- [ ] Uncompleted task
- [ ] Another todo
  - [x] Completed subtask
  - [ ] Uncompleted subtask

## Definition List (if supported)

Term 1 : Definition 1 : Another definition for Term 1

Term 2 : Definition 2a : Definition 2b

---

# Links and Images

## Links

[Basic link](https://www.example.com)

[Link with title](https://www.example.com "Example Website")

[Reference link][ref1]

[Number reference][1]

[Link to heading](#headings)

Autolink: <https://www.example.com>

Email link: <email@example.com>

[ref1]: https://www.reference1.com "Reference 1 Title"
[1]: https://www.reference2.com
[img-ref]: https://i.imgflip.com/1g8my4.jpg "Bad Luck Brian Reference Style"

## Images

![$position:center Doge Dancing - Much wow, very moves](https://media.tenor.com/Wq-4McN0jM8AAAAC/doge.gif "Doge dancing GIF - Such dance!")

![$position:left Distracted Boyfriend - Looking at new things](https://i.imgflip.com/1ur9b0.jpg "Classic relationship meme")

[![$position:right Drake Says No/Yes](https://i.imgflip.com/30b1gx.jpg)](https://knowyourmeme.com/memes/drakeposting "Drake Hotline Bling meme history")

![$position:center This is Fine - Everything is burning](https://media.tenor.com/bm8Q6yAlsPsAAAAC/this-is-fine.gif "This is Fine animated GIF")

![$position:left Woman Yelling at Confused Cat Smudge](https://i.imgflip.com/345v97.jpg "Real Housewives meets cat at dinner")

[![$position:right Surprised Pikachu Face](https://i.kym-cdn.com/entries/icons/mobile/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.jpg)](https://pokemon.com "Shocked Pikachu face")

![$position:center Galaxy Brain - 200 IQ plays](https://i.imgflip.com/1jwhww.jpg "Expanding brain meme")

![$position:left SpongeBob Mocking Text](https://i.imgflip.com/1otk96.jpg "Mocking SpongeBob meme")

![$position:right One Does Not Simply - Walk into Mordor](https://i.imgflip.com/1bij.jpg "Boromir LOTR meme")

![$position:center Success Kid - Finally got it right!](https://i.imgflip.com/1bhk.jpg "Baby fist pump victory")


---

# Code

## Inline Code

Use `console.log()` to print to console.

## Code Block (Indented)

    function hello() {
        console.log("Hello, World!");
    }

## Fenced Code Block

```
Plain code block without language
```

## Syntax Highlighted Code

```javascript
$icon: javascript;
// JavaScript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`Fibonacci(10) = ${result}`);
```

```python
# Python
def factorial(n):
    """Calculate factorial recursively"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"5! = {factorial(5)}")
```

```html
<!-- HTML -->
<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
```

```css
/* CSS */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
```

```bash
#!/bin/bash
# Bash script
echo "Hello from bash"
for i in {1..5}; do
    echo "Number: $i"
done
```

```json
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "example": "^2.0.0"
  }
}
```

```diff
- Old line (deleted)
+ New line (added)
! Important line
# Comment line
```

---

# Tables

## Basic Table

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| Text         |      Text      |          Text |
| 123          |      456       |           789 |

## Table with Formatting

| **Bold** | _Italic_ | `Code` |
| -------- | -------- | ------ |
| **Yes**  | _Maybe_  | `null` |
| **No**   | _Never_  | `true` |

## Minimal Table

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

---

# Blockquotes

> $icon:quote
> $author: Alexander Pope
> $audio:eternalSunshine.mp3
> $link:https://www.youtube.com/watch?v=okV2XFKeT-0
> How happy is the blameless vestal's lot!
> The world forgetting, by the world forgot.
> Eternal sunshine of the spotless mind!
> Each pray'r accepted, and each wish resign'd.

> $icon:quote
> $author:gaudi
> this is a simple quote with an icon and an author.

> This is a multi-line blockquote. 
> It continues on the next line. 
> And even more lines.

> This is a blockquote with **formatting** and _emphasis_.
>
> It also has multiple paragraphs.

## Nested Blockquotes

> Level 1 blockquote
>
>> Level 2 nested blockquote
>>
>>> Level 3 deeply nested blockquote Back to level 2 Back to level 1

## Blockquote with Other Elements

> ### Heading in Blockquote
>
> - List item 1
> - List item 2
>
> ```javascript
> console.log("Code in blockquote");
> ```

---

# Other

## Footnotes

This has a footnote[^1] reference.

This has another footnote[^2] reference.

[^1]: This is the first footnote content.

[^2]: This is the second footnote with multiple paragraphs.

    Indented paragraph in footnote.

## HTML

<details>
<summary>Click to expand</summary>

This is hidden content that expands when clicked.

- It can contain markdown
- Like this list

</details>

<kbd>Ctrl</kbd> + <kbd>C</kbd> for keyboard keys

<abbr title="Hypertext Markup Language">HTML</abbr> abbreviation

<dl>
  <dt>HTML Definition List</dt>
  <dd>A list of terms and definitions</dd>
  <dt>Another Term</dt>
  <dd>Another definition</dd>
</dl>

## Mathematics 

### Inline math

$E = mc^2$

### Block math 
$$
\begin{align}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{align}
$$

## Special Characters & Entities

### Symbols
Copyright: &copy; 
Trademark: &trade; 
Registered: &reg; 
Less than: &lt; 
Greater than: &gt; 
Ampersand: &amp; 
Non-breaking space: &nbsp; 
Em dash: &mdash; 
En dash: &ndash;

### Emojis
:smile: :heart: :thumbsup: :star: :fire: :rocket: :warning: :white_check_mark:

Direct emoji: 😀 ❤️ 👍 ⭐ 🔥 🚀 ⚠️ ✅

---

_Last updated: Test document for markdown parser validation_
