// Curriculum = module list + topic names. Topic CONTENT lives in other data files:
//   DSA.content["<module-id>/<topic-slug>"] = { ... }   (see README)
window.DSA = { content: {}, modules: [
 {id:'big-o',icon:'⏱️',title:'Big-O',desc:'Measure how an algorithm slows down as the input grows.',topics:['What is Big-O?','O(1)','O(log n)','O(n)','O(n log n)','O(n²)','Time Complexity','Space Complexity','How to compare algorithms']},
 {id:'arrays',icon:'📦',title:'Arrays',desc:'Store values in a sequence and reach any of them fast by index.',topics:['RAM','Static Arrays','Dynamic Arrays','Python Lists','Array Indexing','Array Traversal','Insertions','Deletions','Stacks','Array Practice Problems','VSCode Practice']},
 {id:'linked-lists',icon:'🔗',title:'Linked Lists',desc:'Chains of nodes that point to the next node.',topics:['What is a Linked List?','Nodes','References / Pointers','Singly Linked Lists','Doubly Linked Lists','Insert','Delete','Search','Reverse Linked List','Queues']},
 {id:'recursion',icon:'🔁',title:'Recursion',desc:'Solve a problem by solving a smaller copy of it.',topics:['What is Recursion?','Base Case','Recursive Case','Call Stack','Factorial','Fibonacci Sequence','Recursive Thinking','Recursion vs Iteration']},
 {id:'sorting',icon:'↕️',title:'Sorting',desc:'Put data in order and learn which method fits which job.',topics:['Why Sorting Matters','Insertion Sort','Merge Sort','Quick Sort','Bucket Sort','Sorting Complexity','Choosing the Right Sorting Algorithm']},
 {id:'binary-search',icon:'🔎',title:'Binary Search',desc:'Find things in sorted data by cutting the search space in half.',topics:['What is Binary Search?','Searching a Sorted Array','Left / Right Pointers','Middle Element','Search Range','First Occurrence','Last Occurrence','Binary Search Patterns']},
 {id:'trees',icon:'🌳',title:'Trees',desc:'Hierarchical data: roots, children, and traversals.',topics:['What is a Tree?','Root','Parent','Child','Leaf','Depth','Height','Binary Tree','Binary Search Tree','BST Insert','BST Remove','DFS','BFS','BST Sets and Maps','Preorder','Inorder','Postorder','Level Order']},
 {id:'backtracking',icon:'🧩',title:'Backtracking',desc:'Try a choice, explore, undo it, try the next.',topics:['What is Backtracking?','Choose','Explore','Undo','Tree Maze','Decision Trees','Permutations','Subsets','Combination Problems']},
 {id:'heap',icon:'⛰️',title:'Heap / Priority Queue',desc:'Always get the smallest (or largest) item first.',topics:['What is a Heap?','Min Heap','Max Heap','Heap Properties','Parent / Child Relationships','Push','Pop','Heapify','Priority Queue','Python heapq']},
 {id:'hashing',icon:'#️⃣',title:'Hashing',desc:'Instant lookup with dictionaries and sets.',topics:['What is Hashing?','Hash Tables','Hash Maps','Python Dictionaries','Python Sets','Hash Usage','Hash Implementation','Frequency Counting','Collision Concept','When Hashing Should Be Used']},
 {id:'graphs',icon:'🕸️',title:'Graphs',desc:'Things connected to things: networks, maps, grids.',topics:['What is a Graph?','Nodes / Vertices','Edges','Directed Graph','Undirected Graph','Weighted Graph','Matrix Representation','Matrix DFS','Matrix BFS','Adjacency List','Visited Set','Graph Traversal']},
 {id:'dp',icon:'🧮',title:'Dynamic Programming',desc:'Remember answers to small problems so you never solve them twice.',topics:['What is Dynamic Programming?','Overlapping Subproblems','Optimal Substructure','Memoization','Tabulation','1-D DP','2-D DP','State','Transition','Base Case','DP Pattern Recognition']},
 {id:'bits',icon:'🔢',title:'Bit Manipulation',desc:'Work directly with the 0s and 1s inside numbers.',topics:['Binary Numbers','Bits','Bit Operations','AND','OR','XOR','NOT','Left Shift','Right Shift','Set Bit','Clear Bit','Toggle Bit','Count Set Bits']}
],
days:[
 ['Big-O + Arrays + Stack',[['Big-O','#/module/big-o'],['Arrays','#/module/arrays'],['Stacks','#/topic/arrays/stacks'],['Array practice problems','#/topic/arrays/array-practice-problems'],['VSCode practice','#/topic/arrays/vscode-practice']]],
 ['Linked Lists + Queue + Recursion',['Linked Lists','Queues','Recursion','Recursion problems','VSCode practice']],
 ['Sorting + Binary Search',['Sorting','Binary Search','Binary Search problems','VSCode practice']],
 ['Hashing + Trees',['Hashing','Trees','Hashing & tree problems','VSCode practice']],
 ['Heap + Backtracking + Graph Basics',['Heap','Backtracking','Graph basics','VSCode practice']],
 ['Graphs + Dynamic Programming',['Graph traversal','Dynamic Programming','VSCode practice']],
 ['Bit Manipulation + Mixed Practice + Revision',['Bit Manipulation','Random problems','Review Today list','Revision mode']]
]};

// ---- Big-O content ----
DSA.content['big-o/what-is-big-o'] = {
 simple:'Big-O answers one question: if I give this recipe 10 times more food to cook, how much longer does it take? It does not count seconds. It describes how the work GROWS as the input grows.',
 analogy:'Finding a name in a phone book. Reading every page is O(n). Opening in the middle and throwing away half each time is O(log n). Looking only at the first page is O(1).',
 visual:'<p>Steps needed when n = 8:</p><div class="bar"><b>O(1)</b><i style="width:6px"></i>1</div><div class="bar"><b>O(log n)</b><i style="width:18px"></i>3</div><div class="bar"><b>O(n)</b><i style="width:48px"></i>8</div><div class="bar"><b>O(n²)</b><i style="width:384px;max-width:60%"></i>64</div>',
 steps:['Find the main loop. One loop over n items is O(n).','A loop inside a loop multiplies: O(n × n) = O(n²).','If the problem halves each step, it is O(log n).','Drop constants and small parts: O(2n + 5) is just O(n).'],
 code:`def first_item(a):      # O(1): one step, any size
    return a[0]

def total(a):           # O(n): one pass
    s = 0
    for x in a:
        s += x
    return s

def all_pairs(a):       # O(n²): loop inside a loop
    for x in a:
        for y in a:
            print(x, y)`,
 lines:[['return a[0]','One step no matter how long the list is, so O(1).'],['for x in a:','Runs once per item: n steps, so O(n).'],['for y in a: (inside)','For each of n items we do n more steps: n × n = O(n²).']],
 dry:{input:'a = [3, 1, 4], total(a)',a:[3,1,4],steps:[{m:0,v:'s = 0 + 3 = 3',n:'Visit item 0. One step.'},{m:1,v:'s = 3 + 1 = 4',n:'Visit item 1. Two steps so far.'},{m:2,v:'s = 4 + 4 = 8',n:'3 items took 3 steps. Double the items, double the steps: O(n).'}]},
 time:'first_item: O(1)\ntotal: O(n)\nall_pairs: O(n²)',space:'O(1) for all three (no new lists are built)',
 cx:'Big-O describes how fast the work grows in the worst case. Constants and small terms are ignored.',
 when:['You are comparing two solutions.','An interviewer asks "can you do better?"','The input can be 100,000+ items, where O(n²) is too slow.'],
 mistakes:['❌ Counting seconds instead of growth','❌ Forgetting that nested loops multiply','❌ Keeping constants: O(2n) is just O(n)','❌ Ignoring the extra memory your solution uses'],
 interview:'State time AND space complexity before and after you code.',
 problems:[
  {title:'Name the complexity',dif:'🟢',q:'What is the time complexity of: for i in range(n): for j in range(5): print(i, j)',ex:'Input: n = 1000\nOutput: O(n)',hints:['How many times does the inner loop run? Does it depend on n?'],approach:'The inner loop always runs 5 times (a constant). So n × 5 steps, which is O(n).',sol:`# n * 5 steps -> constants are dropped
# Time: O(n), Space: O(1)`,file:'big_o_practice.py'},
  {title:'The halving loop',dif:'🟡',q:'What is the time complexity of: while n > 1: n = n // 2',ex:'Input: n = 16\nOutput: O(log n)  (4 halvings)',hints:['How many times can you halve 16 before you reach 1?'],approach:'n is cut in half every loop, so it runs about log2(n) times.',sol:`def halvings(n):
    steps = 0
    while n > 1:
        n = n // 2      # half of the work disappears each time
        steps += 1
    return steps        # about log2(n)`,file:'halving.py'}
 ]
};
