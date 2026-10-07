// helpers shared by content files
window.X=(k,o)=>DSA.content[k]=o;
window.P=(title,dif,q,ex,h,approach,sol,file)=>({title,dif,q,ex,hints:[].concat(h),approach,sol,file});
window.C=(a,m=-1)=>'<div class="cells">'+a.map((v,i)=>`<span class="${i===m?'mid':''}">${v}<small>${i}</small></span>`).join('')+'</div>';

X('big-o/o-1',{
 simple:'O(1) means "one step, always". The work is the same no matter how big the input is.',
 analogy:'Grabbing the top book from a pile. 10 books or 10,000 books: still one grab.',
 visual:C([5,8,2,9],0)+'<p>a[0] is one step, whether the list has 4 items or 4 million.</p>',
 steps:['Do a fixed number of operations.','Input size does not change that number.'],
 code:`def get_first(a):
    return a[0]          # 1 step

def is_even(n):
    return n % 2 == 0    # 1 step

print(get_first([5, 8, 2, 9]), is_even(7))`,
 lines:[['return a[0]','Index lookup jumps straight to the spot: O(1).'],['n % 2 == 0','One calculation, no loop: O(1).']],
 dry:{input:'get_first(a)',a:[5,8,2,9],steps:[{m:0,v:'return a[0] -> 5',n:'One step.'},{a:[5,8,2,9,1,7,3,6],m:0,v:'same call, 8 items',n:'Still one step. Bigger input, same work.'}]},
 time:'Best: O(1)\nAverage: O(1)\nWorst: O(1)',space:'O(1)',cx:'The number of steps stays constant as the input grows.',
 when:['Reading or writing an item by index','Push / pop on a stack','Dictionary or set lookup (average case)'],
 mistakes:['❌ Thinking O(1) means "tiny". It means "does not grow".','❌ Missing a hidden loop: x in my_list is O(n), not O(1)'],
 problems:[P('Spot the O(1)','🟢','Which is O(1)? (A) a[len(a)//2]  (B) sum(a)  (C) a.index(7)','Output: A','Which ones must look at many items?','A is a direct index lookup. B and C scan the list.','# A: a[len(a)//2] is one index lookup -> O(1)','o1.py')]});

X('big-o/o-log-n',{
 simple:'O(log n) means each step throws away half of what is left. Doubling the input adds just ONE extra step.',
 analogy:'Guessing a number from 1 to 100 with "higher / lower" hints. About 7 guesses always work.',
 visual:C([1,2,3,4,5,6,7,8],3)+'<p>n = 8 needs 3 halvings. n = 1,000,000 needs only about 20.</p>',
 steps:['Start with n items.','Throw away half every step.','Stop when 1 item is left. Steps = log2(n).'],
 code:`def count_halvings(n):
    steps = 0
    while n > 1:
        n = n // 2        # half of the work disappears
        steps += 1
    return steps

print(count_halvings(8))         # 3
print(count_halvings(1000000))   # 19`,
 lines:[['while n > 1:','Keep going until only 1 is left.'],['n = n // 2','Cut the problem in half every loop.'],['steps += 1','Count the halvings: this count is about log2(n).']],
 dry:{input:'count_halvings(8)',a:[8,4,2,1],steps:[{m:0,v:'n = 8, steps = 0',n:'Start.'},{m:1,v:'n = 4, steps = 1',n:'Half is gone.'},{m:2,v:'n = 2, steps = 2',n:'Half again.'},{m:3,v:'n = 1, steps = 3',n:'Stop. 8 items took 3 steps = log2(8).'}]},
 time:'Best: O(1)\nAverage: O(log n)\nWorst: O(log n)',space:'O(1)',cx:'Remaining possibilities are cut in half each step, so even huge inputs finish fast.',
 when:['Sorted data you can halve (binary search)','A loop that divides n by 2 each time','Height of a balanced tree'],
 mistakes:['❌ Calling every loop "log n". The problem must shrink by a factor each step.','❌ Using binary search on unsorted data'],
 problems:[P('How many halvings?','🟢','How many loop runs for n = 1024 in: while n > 1: n //= 2','Output: 10','1024 = 2 to the power of what?','1024 = 2^10, so 10 halvings.','# 1024 -> 512 -> ... -> 1 : 10 steps','halving.py')]});

X('big-o/o-n',{
 simple:'O(n): the work grows in a straight line with the input. 10 times more items means about 10 times more steps.',
 analogy:'Reading every page of a book to find one word.',
 visual:C([4,7,1,9])+'<p>One look at each item: 4 items, 4 looks.</p>',
 steps:['Use one loop over the input.','Do a constant amount of work per item.','Total = n × constant = O(n).'],
 code:`def find_max(a):
    best = a[0]
    for x in a:           # visits each item once
        if x > best:
            best = x
    return best

print(find_max([4, 7, 1, 9]))   # 9`,
 lines:[['best = a[0]','Start with the first item as the champion.'],['for x in a:','One pass over all n items: this is the O(n).'],['if x > best:','A single comparison per item: constant work.']],
 dry:{input:'find_max([4, 7, 1, 9])',a:[4,7,1,9],steps:[{m:0,v:'best = 4',n:'First item.'},{m:1,v:'7 > 4, best = 7',n:'New champion.'},{m:2,v:'1 < 7, best = 7',n:'No change.'},{m:3,v:'9 > 7, best = 9',n:'4 items, 4 looks: O(n).'}]},
 time:'Best: O(n)\nAverage: O(n)\nWorst: O(n)',space:'O(1)',cx:'Double the items, double the steps.',
 when:['You must look at every item once','Sum, count, min, max','Linear search in unsorted data'],
 mistakes:['❌ Starting best = 0 (breaks for negative numbers)','❌ Stopping the loop one item early','❌ Slicing a[1:] inside a loop: each slice copies, a hidden O(n)'],
 problems:[P('Sum of a list','🟢','Return the sum of all numbers without using sum().','Input: [1, 2, 3]\nOutput: 6','Keep a running total.','One loop, add each item.',`def total(a):
    s = 0
    for x in a:
        s += x
    return s`,'total.py')]});

X('big-o/o-n-log-n',{
 simple:'O(n log n) is the speed of good sorting. Split the data in halves (log n levels), and at every level touch all n items.',
 analogy:'Sorting a deck by splitting it in half again and again, then merging. Every merge level touches all 52 cards, and there are only about 6 levels.',
 visual:'<pre>Level 1:  [ 8 items ]        touch 8\nLevel 2:  [4 items][4 items]   touch 8\nLevel 3:  [2][2][2][2]         touch 8\n3 levels x 8 items = n log n</pre>',
 steps:['Divide into halves: log n levels.','Each level does O(n) work.','Total = n × log n.'],
 code:`nums = [5, 2, 9, 1, 7]
nums.sort()                  # Python's built-in sort: O(n log n)
print(nums)                  # [1, 2, 5, 7, 9]

def has_duplicate(a):
    a = sorted(a)                 # O(n log n)
    for i in range(1, len(a)):    # O(n)
        if a[i] == a[i - 1]:
            return True
    return False                  # total: O(n log n)`,
 lines:[['nums.sort()','Python uses Timsort, which is O(n log n).'],['a = sorted(a)','Sort first so equal items sit next to each other.'],['a[i] == a[i - 1]','One pass compares neighbours: only O(n) extra.']],
 dry:{input:'has_duplicate([3, 1, 3])',a:[3,1,3],steps:[{m:-1,v:'sorted(a) -> [1, 3, 3]',n:'Sorting costs O(n log n).'},{a:[1,3,3],m:1,v:'a[1] = 3 vs a[0] = 1',n:'Different, keep going.'},{a:[1,3,3],m:2,v:'a[2] = 3 vs a[1] = 3',n:'Equal! Return True.'}]},
 time:'Best: O(n log n)\nAverage: O(n log n)\nWorst: O(n log n)',space:'O(n) for sorted() (it makes a copy)',cx:'Only a little slower than O(n). Fine for millions of items.',
 when:['You need the data in sorted order first','Merge sort, heap sort, quick sort (average)','Sort, then scan once'],
 mistakes:['❌ Writing O(n log n + n): the smaller term is dropped','❌ Calling sort() inside a loop (becomes O(n² log n))'],
 problems:[P('Contains Duplicate (sort)','🟡','Return True if any value appears twice. Use sorting.','Input: [1, 2, 3, 1]\nOutput: True','After sorting, where would duplicates be?','Sort, then compare neighbours. O(n log n).',`def contains_duplicate(a):
    a = sorted(a)
    for i in range(1, len(a)):
        if a[i] == a[i - 1]:
            return True
    return False`,'dup_sort.py')]});

X('big-o/o-n2',{
 simple:'O(n²): for every item you look at every item again. Double the input and the work becomes 4 times bigger.',
 analogy:'Everyone in a room shakes hands with everyone else. 10 people: about 45 handshakes. 100 people: about 4,950.',
 visual:C(['A','B','C'])+'<pre>A-B  A-C  B-C   (3 items → 3 pairs)\n100 items → about 5,000 pairs</pre>',
 steps:['Put a loop inside a loop.','Both loops depend on n.','Steps = n × n (or about n²/2) = O(n²).'],
 code:`def has_pair_sum(a, target):
    for i in range(len(a)):              # n times
        for j in range(i + 1, len(a)):   # up to n times
            if a[i] + a[j] == target:
                return True
    return False

print(has_pair_sum([2, 7, 11], 20))      # True`,
 lines:[['for i in range(len(a)):','Outer loop: n times.'],['for j in range(i + 1, len(a)):','Inner loop: for each i, up to n more. Total about n²/2, still O(n²).'],['a[i] + a[j] == target','Check one pair. A constant step.']],
 dry:{input:'has_pair_sum([2, 7, 11], 20)',a:[2,7,11],steps:[{m:0,v:'i=0, j=1: 2 + 7 = 9',n:'Not 20.'},{m:0,v:'i=0, j=2: 2 + 11 = 13',n:'Not 20.'},{m:1,v:'i=1, j=2: 7 + 11 = 18',n:'Not 20. 3 items → 3 pairs checked. Return False.'}]},
 time:'Best: O(1)\nAverage: O(n²)\nWorst: O(n²)',space:'O(1)',cx:'Fine for n up to a few thousand. Painfully slow for a million.',
 when:['Brute force: compare every pair','n is small','First working solution before optimizing'],
 mistakes:['❌ Not noticing a loop hiding inside another (e.g. x in list inside a for loop)','❌ Thinking j = i + 1 makes it O(n): it is still O(n²)'],
 problems:[P('Pair Sum (brute force)','🟡','Return True if two different items add up to target.','Input: a = [3, 8, 5], target = 13\nOutput: True','Check every pair once.','Two nested loops, j starts at i + 1. O(n²). You will beat this with hashing later.',`def pair_sum(a, target):
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if a[i] + a[j] == target:
                return True
    return False`,'pair_sum.py')]});

X('big-o/time-complexity',{
 simple:'Time complexity counts how many basic steps your code does as the input size n grows. Not seconds: steps.',
 analogy:'Chopping 1 onion vs 100 onions. Time complexity describes how the chopping time grows.',
 visual:'<div class="bar"><b>O(1)</b><i style="width:6px"></i></div><div class="bar"><b>O(log n)</b><i style="width:18px"></i></div><div class="bar"><b>O(n)</b><i style="width:48px"></i></div><div class="bar"><b>O(n log n)</b><i style="width:120px"></i></div><div class="bar"><b>O(n²)</b><i style="width:60%"></i></div>',
 steps:['Count each part of the code.','Add parts that run one after another.','Multiply parts that are nested.','Keep only the biggest term, drop constants.'],
 code:`def example(a):
    x = a[0]                 # 1 step
    for v in a:              # n steps
        print(v)
    for i in a:              # n x n steps
        for j in a:
            print(i, j)
# total = 1 + n + n^2  ->  O(n^2)`,
 lines:[['x = a[0]','One step: O(1).'],['for v in a:','One loop: O(n).'],['for i in a: for j in a:','Nested loops multiply: O(n²).'],['# total','1 + n + n² → the biggest term wins: O(n²).']],
 time:'O(1) + O(n) + O(n²) = O(n²)',space:'O(1)',cx:'Big-O keeps only the part that grows fastest.',
 when:['Before writing a solution: estimate the limit','After writing it: state the complexity','Interview: "what is the time complexity?"'],
 mistakes:['❌ Adding when parts are nested (should multiply)','❌ Keeping lower terms: O(n² + n) is O(n²)','❌ Ignoring cost of built-ins: sort, in list, slicing'],
 problems:[P('Add up the complexity','🟡','What is the time complexity?\nfor i in range(n): print(i)\nfor i in range(n):\n    for j in range(n): print(i, j)','Output: O(n²)','Sequential parts add. Which part is biggest?','n + n² → keep the biggest: O(n²).','# n + n*n -> O(n^2)','time_add.py')]});

X('big-o/space-complexity',{
 simple:'Space complexity counts the EXTRA memory your code needs as n grows. The input itself is usually not counted.',
 analogy:'Cooking with one pot (O(1)) vs needing a new bowl for every ingredient (O(n)).',
 visual:C([1,2,3])+'<p>Input</p>'+C([2,4,6])+'<p>New list of the same size: extra O(n) space</p>',
 steps:['Look for new lists, dicts, sets you create.','Check recursion depth (call stack uses memory).','Count only what grows with n.'],
 code:`def sum_list(a):            # space O(1)
    total = 0
    for x in a:
        total += x
    return total

def double_list(a):         # space O(n)
    result = []
    for x in a:
        result.append(x * 2)
    return result`,
 lines:[['total = 0','One variable, never grows: O(1).'],['result = []','A new list that gets one slot per item: O(n).']],
 dry:{input:'double_list([1, 2, 3])',a:[2],steps:[{a:[2],m:0,v:'result = [2]',n:'1 extra slot.'},{a:[2,4],m:1,v:'result = [2, 4]',n:'2 extra slots.'},{a:[2,4,6],m:2,v:'result = [2, 4, 6]',n:'3 items → 3 extra slots: O(n).'}]},
 time:'sum_list: O(n)\ndouble_list: O(n)',space:'sum_list: O(1)\ndouble_list: O(n)',cx:'Space asks "how much extra memory", not "how long".',
 when:['Memory is limited','Two solutions have the same time','Recursion: depth costs space'],
 mistakes:['❌ Counting the input array as extra space','❌ Forgetting recursion uses stack space','❌ a[1:] creates a copy: O(n) space'],
 problems:[P('Spot the space','🟢','Space complexity of: b = [x for x in a if x > 0]','Output: O(n)','Does b grow with the input?','b can hold up to n items, so O(n).','# new list up to n items -> O(n)','space.py')]});

X('big-o/how-to-compare-algorithms',{
 simple:'To compare two solutions, compare how their steps grow. The one that grows slower wins when n is big.',
 analogy:'Two roads to town. One slows down badly with more traffic (n²), the other barely notices (log n).',
 visual:'<pre>n            log n   n          n log n      n²\n10           3       10         33           100\n1,000        10      1,000      10,000       1,000,000\n1,000,000    20      1,000,000  20,000,000   1,000,000,000,000</pre>',
 steps:['Write the time AND space of each solution.','Compare time first, then space.','Check the size of n: tiny n makes any solution fine.','Prefer the simpler one when they are close.'],
 code:`def dup_slow(a):                  # O(n^2) time, O(1) space
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if a[i] == a[j]:
                return True
    return False

def dup_fast(a):                  # O(n) time, O(n) space
    seen = set()
    for x in a:
        if x in seen:
            return True
        seen.add(x)
    return False`,
 lines:[['dup_slow','Compares every pair: O(n²) time, no extra memory.'],['seen = set()','Extra memory: O(n) space...'],['if x in seen','...buys a fast O(1) lookup, so the whole loop is O(n).']],
 time:'dup_slow: O(n²)\ndup_fast: O(n)',space:'dup_slow: O(1)\ndup_fast: O(n)',cx:'dup_fast trades extra memory for speed. This trade-off appears everywhere in DSA.',
 when:['Interview: say brute force first, then improve','Choosing between time and memory','Deciding if optimizing is worth it'],
 mistakes:['❌ Comparing only time and ignoring space','❌ Comparing best case of one with worst case of another','❌ Over-optimizing when n is tiny'],
 problems:[P('Which is better?','🟢','A is O(n log n), B is O(n²). Which is better for n = 1,000,000?','Output: A','Compare 20 million with a trillion.','n log n is about 2×10⁷, n² is 10¹². A is far faster.','# A','compare.py')]});
