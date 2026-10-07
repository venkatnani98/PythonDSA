# Python DSA Learning Lab

A personal DSA teacher + workbook + progress tracker. Plain HTML, CSS and vanilla JavaScript. No server, no build step.

## Run it
Double-click `index.html`. That's it. (Scripts are plain `<script>` tags, so it works from `file://`.)

## Files
```
dsa-learning/
├── index.html          page shell (loads the scripts)
├── style.css           light + dark theme
├── app.js              all UI logic (router, progress, search, notes...)
├── data/
│   ├── curriculum.js   13 modules, every topic name, 7-day plan, Big-O content
│   ├── arrays.js       content: Stacks
│   └── binary-search.js  content: What is Binary Search?
└── README.md
```

## What's in the first version
Full lessons (all sections, dry run, problems) for: **Big-O → What is Big-O?**, **Arrays → Stacks**, **Binary Search → What is Binary Search?**. Every other topic already appears in the sidebar/module pages with its checkboxes and notes, and shows "content not written yet" until you add content.

## localStorage
Everything lives in ONE key, `dsaLab`, as JSON:
`t` topic progress (l=learned, c=code understood, e=example understood) · `p` problem progress (r=read, u=understood, v=practiced in VSCode, s=solved without help, d=solved date, st=review stage, nx=next review date) · `bm` bookmarks · `notes` · `theme` · `day` (current plan day) · `plan` (plan checkboxes) · `scratch` (scratchpad) · `rev` (revision mode).

Rules: topic complete = learned + code + example. Problem mastered = read + understood + practiced + solved. Overall % = (completed topics + mastered problems) / (all topics + all problems). Reviews are scheduled 1, 3, then 7 days after "Solved Without Help".

## Add a topic or problems
1. Topic names live in `data/curriculum.js`. The topic id is the slug of its name (`"What is Binary Search?"` → `what-is-binary-search`).
2. Create `data/<module>.js` (or edit one) and add:
```js
DSA.content["binary-search/searching-a-sorted-array"] = {
  simple: "...", analogy: "...", visual: "<div class='cells'><span>1</span></div>",
  steps: ["..."], code: `def f(): ...`, lines: [["code line","explanation"]],
  dry: { input: "...", a: [1,2,3], t: 3, steps: [{ d:[0,2], m:1, v:"mid = 1", n:"note" }] },
  time: "Best: O(1)\nAverage: O(log n)\nWorst: O(log n)", space: "O(1)", cx: "plain-words meaning",
  when: ["..."], mistakes: ["❌ ..."], interview: "...",
  problems: [{ title, dif: "🟢", q, ex, hints: ["..."], approach, sol: `code`, file: "name.py" }]
};
```
3. Add `<script src="data/<module>.js"></script>` to `index.html` **before** `app.js`.
No UI code changes are needed. In `dry`, `d` = visible range, `m` = highlighted index, `a` (optional per step) overrides the array.

## Reset / export / import
Open **⚙️ Settings**: *Export Progress* downloads `dsa-progress.json`; *Import Progress* loads it (move between browsers/laptops); *Reset Progress* asks for confirmation, then clears everything.

## Shortcuts
N next topic · P previous topic · B bookmark · R random problem.
