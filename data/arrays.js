DSA.content['arrays/stacks'] = {
 simple:'A stack is a pile of plates. You can only put a plate on top or take the top plate off. The last plate you put on is the first one you take off. This is called LIFO: Last In, First Out.',
 analogy:'The Back button in your browser. Each page you visit is piled on top. Back removes the most recent page first.',
 visual:'<div class="stack"><div>30 ← TOP</div><div>20</div><div>10</div></div><p class="muted">push(30) puts 30 on top. pop() removes 30.</p>',
 steps:['push: add a new item on top.','pop: remove and return the top item.','peek: look at the top item without removing it.','Always check the stack is not empty before pop or peek.'],
 code:`stack = []              # a Python list works as a stack

stack.append(10)        # push 10
stack.append(20)        # push 20
top = stack[-1]         # peek -> 20 (stays in the stack)
x = stack.pop()         # pop  -> 20 (removed)
is_empty = len(stack) == 0`,
 lines:[['stack = []','An empty list. Its END is the top of the stack.'],['stack.append(10)','Push: adds to the end in O(1).'],['stack[-1]','Index -1 is the last item, the top. Peek only looks.'],['stack.pop()','Removes and returns the last item, the top.'],['len(stack) == 0','True when there is nothing left to pop.']],
 dry:{input:'push 10, push 20, pop',steps:[{a:[10],m:0,v:'stack = [10]',n:'push(10): 10 is on top.'},{a:[10,20],m:1,v:'stack = [10, 20]',n:'push(20): 20 sits on top of 10.'},{a:[10],m:0,v:'pop() -> 20,  stack = [10]',n:'pop removes the top item (20), the last one in.'}]},
 time:'push / pop / peek: O(1) each',space:'O(n) to store n items',
 cx:'O(1) means the work does not depend on how many items are in the stack.',
 when:['You need to undo things (most recent first).','You are matching brackets or tags.','The latest item must be handled first.','You want DFS without recursion.'],
 mistakes:['❌ Popping from an empty stack (IndexError)','❌ Using pop(0): it removes from the FRONT and is O(n)','❌ Mixing up the top (end of list) with the start','❌ Forgetting to check is-empty before peek'],
 interview:'Say "last in, first out" out loud: it signals stack. Bracket matching is the classic example.',
 problems:[
  {title:'Reverse a string with a stack',dif:'🟢',q:'Reverse the string s using a stack. Do not use s[::-1].',ex:'Input: s = "abc"\nOutput: "cba"',hints:['Push every character first.','Popping returns them in reverse order.'],approach:'Push each character, then pop them all into a new string. O(n) time and space.',sol:`def reverse(s):
    stack = []
    for ch in s:
        stack.append(ch)      # push every character
    out = []
    while stack:
        out.append(stack.pop())  # last in comes out first
    return "".join(out)`,file:'reverse_string.py'},
  {title:'Valid Parentheses',dif:'🟡',q:'Given a string of ()[]{} characters, return True if every bracket is closed in the correct order.',ex:'Input: s = "([])"\nOutput: True\n\nInput: s = "(]"\nOutput: False',hints:['When you see a closing bracket, which opening bracket must be on top?','Push openers. On a closer, pop and compare.'],approach:'Push opening brackets. For a closing bracket, the stack top must be its matching opener. At the end the stack must be empty.',sol:`def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:                       # closing bracket
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:                                 # opening bracket
            stack.append(ch)
    return len(stack) == 0                    # nothing left open`,file:'valid_parentheses.py'}
 ]
};

// ---- Day 1: core Arrays topics ----
X('arrays/ram',{
 simple:'RAM is your computer\'s short-term memory: a huge row of numbered mailboxes. Every mailbox holds a small piece of data and has an address.',
 analogy:'A long street of houses, each with a house number. If you know the number, you walk straight to the house without knocking on every door.',
 visual:'<div class="cells"><span>10<small>addr 100</small></span><span>20<small>addr 104</small></span><span>30<small>addr 108</small></span><span>40<small>addr 112</small></span></div><p>Each item uses 4 bytes, so addresses go up by 4.</p>',
 steps:['Memory is a row of numbered slots.','An array uses slots right next to each other.','address of a[i] = start + i × item size.','That is one calculation, so reading a[i] is O(1).'],
 code:`start = 100          # where the array begins in memory
size = 4             # bytes per item

def address(i):
    return start + i * size

print(address(0))    # 100
print(address(3))    # 112

nums = [10, 20, 30]
print(nums[1])       # Python jumps straight to slot 1 -> 20`,
 lines:[['start + i * size','Skip i items of "size" bytes each from the start.'],['address(3)','3 items × 4 bytes = 12 bytes after 100 → 112.'],['nums[1]','Python does this same math internally. No searching.']],
 dry:{input:'start = 100, size = 4',a:[10,20,30,40],steps:[{m:0,v:'address(0) = 100 + 0×4 = 100',n:'Index 0 is at the start.'},{m:2,v:'address(2) = 100 + 2×4 = 108',n:'Jump 2 items ahead in one step.'},{m:3,v:'address(3) = 100 + 3×4 = 112',n:'Any index costs the same: O(1).'}]},
 time:'Read by index: O(1)',space:'n items need n slots: O(n)',cx:'The computer never searches. It calculates the address.',
 when:['Explaining why array access is instant','Asked "why is a[i] O(1)?"'],
 mistakes:['❌ Thinking the computer scans memory to find an item','❌ Mixing up address and index','❌ Forgetting items must sit side by side (contiguous)'],
 interview:'Say: "arrays are contiguous in memory, so index → address is one calculation."',
 problems:[P('Compute the address','🟡','An array starts at address 1000 and every item uses 4 bytes. What is the address of index 5?','Output: 1020','Use start + index × size.','1000 + 5 × 4 = 1020.',`def address(start, i, size):
    return start + i * size

print(address(1000, 5, 4))   # 1020`,'address.py')]});

X('arrays/static-arrays',{
 simple:'A static array has a fixed size chosen up front. The size cannot change, like an egg carton with exactly 12 holes.',
 analogy:'An egg carton: 12 holes, no more, no less. To hold 13 eggs you need a bigger carton and must move the eggs.',
 visual:C([7,3,9,'_','_'])+'<p>size (capacity) = 5, length (used) = 3</p>',
 steps:['Decide the size first.','Items sit side by side in memory.','Writing past the last slot is an error.','To grow: make a new bigger array and copy.'],
 code:`SIZE = 5
arr = [0] * SIZE      # fixed-size array of 5 zeros
length = 0            # how many slots we actually use

arr[0] = 7; length += 1
arr[1] = 3; length += 1
arr[2] = 9; length += 1
print(arr)            # [7, 3, 9, 0, 0]
print(length)         # 3`,
 lines:[['arr = [0] * SIZE','Reserve 5 slots, all zero. This is the "static" part.'],['length = 0','Track how many slots hold real data.'],['arr[0] = 7','Write by index: O(1).']],
 dry:{input:'SIZE = 5',a:[0,0,0,0,0],steps:[{a:[0,0,0,0,0],m:-1,v:'length = 0',n:'Empty carton.'},{a:[7,0,0,0,0],m:0,v:'arr[0] = 7, length = 1',n:'First slot filled.'},{a:[7,3,9,0,0],m:2,v:'length = 3',n:'3 used, 2 free. Capacity stays 5.'}]},
 time:'Read / write by index: O(1)\nAppend (if room): O(1)',space:'O(n)',cx:'Fast and predictable, but fixed size.',
 when:['Size is known ahead of time','Memory must be predictable'],
 mistakes:['❌ Writing past the last slot','❌ Mixing up capacity (5) and length (3)','❌ Forgetting unused slots hold 0/junk'],
 problems:[P('Fill a fixed array','🟢','Create a fixed array of size 5 with zeros, then set index 2 to 9.','Output: [0, 0, 9, 0, 0]','Use [0] * 5.','Create it, then assign by index.',`arr = [0] * 5
arr[2] = 9
print(arr)   # [0, 0, 9, 0, 0]`,'static.py')]});

X('arrays/dynamic-arrays',{
 simple:'A dynamic array grows when it gets full. It makes a bigger array (usually 2× bigger), copies everything over, and carries on.',
 analogy:'A full bookshelf: you buy one twice as big and move the books over once. Then you have lots of free space again.',
 visual:C([1,2,3,4])+'<p>Full! capacity 4 → new array of capacity 8:</p>'+C([1,2,3,4,'_','_','_','_']),
 steps:['Add items while there is room: O(1).','When full, allocate double the capacity.','Copy all old items (O(n), but rare).','Average cost per append stays O(1): amortized.'],
 code:`class DynamicArray:
    def __init__(self):
        self.capacity = 2
        self.length = 0
        self.arr = [0] * self.capacity

    def append(self, value):
        if self.length == self.capacity:   # full?
            self.resize()
        self.arr[self.length] = value
        self.length += 1

    def resize(self):
        self.capacity *= 2                 # double the space
        new_arr = [0] * self.capacity
        for i in range(self.length):       # copy old items
            new_arr[i] = self.arr[i]
        self.arr = new_arr`,
 lines:[['if self.length == self.capacity:','No room left, so grow first.'],['self.capacity *= 2','Doubling means resizes get rarer and rarer.'],['new_arr[i] = self.arr[i]','Copy every old item: this is the O(n) part.'],['self.arr = new_arr','Switch to the bigger array.']],
 dry:{input:'append 1, 2, 3 (capacity starts at 2)',a:[1,'_'],steps:[{a:[1,'_'],m:0,v:'append(1): length 1, capacity 2',n:'Room available.'},{a:[1,2],m:1,v:'append(2): length 2, capacity 2',n:'Now full.'},{a:[1,2,3,'_'],m:2,v:'append(3): resize to 4, then add',n:'Doubled capacity, copied 2 items, wrote 3.'}]},
 time:'append: O(1) amortized\nresize (rare): O(n)',space:'O(n)',cx:'Most appends are instant. Occasionally one is slow, but on average each is O(1).',
 when:['Size is not known ahead','Python list, Java ArrayList, C++ vector all work this way'],
 mistakes:['❌ Growing by +1 (every append becomes O(n))','❌ Forgetting to copy old items','❌ Forgetting to update capacity'],
 problems:[P('Capacity after appends','🟢','Capacity starts at 1 and doubles when full. What is the capacity after 9 appends?','Output: 16','Capacity goes 1, 2, 4, 8, ...','8 holds 8 items. The 9th append doubles it to 16.','# 1 -> 2 -> 4 -> 8 -> 16','capacity.py')]});

X('arrays/python-lists',{
 simple:'A Python list is a ready-made dynamic array. Python grows it for you, so you just append.',
 analogy:'A magic bookshelf that adds shelves by itself. Adding at the end is easy; adding at the front means moving every book.',
 visual:C([10,20,30,40])+'<p>append / pop at the END: fast. insert / pop at the FRONT: slow (shifts items).</p>',
 steps:['Create with [] or [1, 2, 3].','append() adds at the end: O(1).','pop() removes the last item: O(1).','insert, pop(0), remove shift items: O(n).'],
 code:`a = [10, 20, 30]
a.append(40)       # [10, 20, 30, 40]        O(1)
a.insert(1, 15)    # [10, 15, 20, 30, 40]    O(n) shifts
last = a.pop()     # 40, list is [10, 15, 20, 30]  O(1)
first = a.pop(0)   # 10, list is [15, 20, 30]      O(n)
print(len(a), a[0], a[-1], 20 in a)   # 3 15 30 True ('in' is O(n))`,
 lines:[['a.append(40)','Add at the end. Fast.'],['a.insert(1, 15)','Everything from index 1 moves right. Slow for big lists.'],['a.pop()','Remove from the end. Fast.'],['a.pop(0)','Remove from the front: everything slides left. Slow.'],['20 in a','Scans the list: O(n).']],
 dry:{input:'a = [10, 20, 30]',a:[10,20,30],steps:[{a:[10,20,30,40],m:3,v:'a.append(40)',n:'Added at the end: O(1).'},{a:[10,15,20,30,40],m:1,v:'a.insert(1, 15)',n:'20, 30, 40 shifted right: O(n).'},{a:[10,15,20,30],m:3,v:'a.pop() -> 40',n:'Removed from the end: O(1).'},{a:[15,20,30],m:0,v:'a.pop(0) -> 10',n:'Everything shifted left: O(n).'}]},
 time:'a[i]: O(1)\nappend / pop(): O(1)\ninsert / pop(0) / remove: O(n)\nx in a: O(n)',space:'O(n)',cx:'The end of a list is cheap. The front and middle are expensive.',
 when:['Your default array in Python','A stack (append / pop)','Ordered collection that changes size'],
 mistakes:['❌ pop(0) inside a loop (O(n²))','❌ Using "in list" for repeated lookups: use a set','❌ b = a does not copy! Use a.copy()'],
 problems:[P('The copy trap','🟡','What do these print?\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)','Output: [1, 2, 3, 4]','Does b = a make a new list?','b and a are the SAME list. Use b = a.copy() for a real copy.',`a = [1, 2, 3]
b = a.copy()      # a real copy
b.append(4)
print(a)          # [1, 2, 3]`,'copy_trap.py')]});

X('arrays/array-indexing',{
 simple:'An index is an item\'s position number. It starts at 0: a[0] is the first item, a[1] the second.',
 analogy:'Floors in a building where the ground floor is floor 0.',
 visual:C([10,20,30,40],1)+'<p>Negative indexes count from the end: a[-1] = 40, a[-2] = 30.</p>',
 steps:['First index is 0.','Last index is len(a) - 1.','a[-1] is the last item.','An index outside 0..len-1 raises IndexError.'],
 code:`a = [10, 20, 30, 40]
print(a[0])          # 10  first
print(a[2])          # 30
print(a[-1])         # 40  last
print(a[len(a)-1])   # 40  same as a[-1]
a[1] = 99            # overwrite -> [10, 99, 30, 40]
# print(a[4])        # IndexError: only 0..3 exist`,
 lines:[['a[0]','The first item. Index 0, not 1.'],['a[-1]','Shortcut for the last item.'],['a[len(a)-1]','Last valid index = length minus one.'],['a[1] = 99','Writing by index replaces the item: O(1).']],
 dry:{input:'a = [10, 20, 30, 40]',a:[10,20,30,40],steps:[{m:0,v:'a[0] -> 10',n:'First item.'},{m:2,v:'a[2] -> 30',n:'Third item (index 2).'},{m:3,v:'a[-1] -> a[3] -> 40',n:'Negative index counts from the end.'}]},
 time:'Read / write: O(1)',space:'O(1)',cx:'Any position costs the same: one step.',
 when:['You know the position of the item','Two pointers (left / right)','Swapping elements'],
 mistakes:['❌ Using len(a) as the last index','❌ Counting from 1','❌ Off-by-one in loops','❌ Indexing an empty list'],
 problems:[P('Swap first and last','🟢','Swap the first and last items of a list in place.','Input: [1, 2, 3, 4]\nOutput: [4, 2, 3, 1]','Python can swap with one line.','Use a[0], a[-1] = a[-1], a[0].',`def swap_ends(a):
    a[0], a[-1] = a[-1], a[0]
    return a`,'swap_ends.py')]});

X('arrays/array-traversal',{
 simple:'Traversal means visiting every item one by one, from start to end.',
 analogy:'Walking down a street and knocking on every door.',
 visual:C([3,8,5],0)+'<p>i = 0 → 1 → 2, then stop.</p>',
 steps:['Start at index 0.','Do something with a[i].','Move to i + 1.','Stop after the last index.'],
 code:`a = [3, 8, 5]

for x in a:                    # value only
    print(x)

for i in range(len(a)):        # when you need the index
    print(i, a[i])

i = len(a) - 1
while i >= 0:                  # backwards
    print(a[i])
    i -= 1`,
 lines:[['for x in a:','Simplest loop. Gives each value.'],['for i in range(len(a)):','Gives the index too, so you can use a[i].'],['while i >= 0:','Manual control: here we walk backwards.']],
 dry:{input:'total of [3, 8, 5]',a:[3,8,5],steps:[{m:0,v:'total = 0 + 3 = 3',n:'Visit index 0.'},{m:1,v:'total = 3 + 8 = 11',n:'Visit index 1.'},{m:2,v:'total = 11 + 5 = 16',n:'Visit index 2. Done: O(n).'}]},
 time:'Full traversal: O(n)',space:'O(1)',cx:'One visit per item, so time grows with n.',
 when:['Sum, count, min, max','Checking a condition on every item','Searching an unsorted array'],
 mistakes:['❌ range(len(a) + 1) → IndexError','❌ Removing items from a list while looping over it','❌ Forgetting to reset a counter or total'],
 problems:[P('Count evens','🟢','Count how many numbers in the list are even.','Input: [1, 2, 3, 4]\nOutput: 2','Use n % 2 == 0.','Traverse once, add 1 for each even number.',`def count_evens(a):
    count = 0
    for x in a:
        if x % 2 == 0:
            count += 1
    return count`,'count_evens.py')]});

X('arrays/insertions',{
 simple:'Inserting puts a new item into the array. At the end it is easy. In the middle, every item after it must shuffle right to make room.',
 analogy:'Squeezing into a row of seats: everyone to your right moves one seat over.',
 visual:C([1,2,4,5])+'<p>insert 3 at index 2 →</p>'+C([1,2,3,4,5],2),
 steps:['End: append, O(1).','Middle: grow the array by one.','Shift items from the back toward index i, one step right.','Write the new value at i.'],
 code:`def insert_at(arr, i, value):
    arr.append(0)                      # make room at the end
    for k in range(len(arr) - 1, i, -1):
        arr[k] = arr[k - 1]            # shift right, back to front
    arr[i] = value

a = [1, 2, 4, 5]
insert_at(a, 2, 3)
print(a)                               # [1, 2, 3, 4, 5]`,
 lines:[['arr.append(0)','Add a spare slot so nothing falls off the end.'],['range(len(arr) - 1, i, -1)','Walk from the last slot down to i + 1.'],['arr[k] = arr[k - 1]','Copy the left neighbour one step right.'],['arr[i] = value','The hole at i is free now. Fill it.']],
 dry:{input:'insert_at([1, 2, 4, 5], 2, 3)',a:[1,2,4,5,0],steps:[{a:[1,2,4,5,0],m:4,v:'append(0): [1, 2, 4, 5, 0]',n:'Room made.'},{a:[1,2,4,5,5],m:4,v:'arr[4] = arr[3]',n:'5 shifts right.'},{a:[1,2,4,4,5],m:3,v:'arr[3] = arr[2]',n:'4 shifts right.'},{a:[1,2,3,4,5],m:2,v:'arr[2] = 3',n:'Hole filled. Done.'}]},
 time:'At end: O(1)\nAt start / middle: O(n)',space:'O(1)',cx:'The further left you insert, the more items must move.',
 when:['Keeping an array in order after adding','Building arrays one item at a time'],
 mistakes:['❌ Shifting front to back (overwrites items)','❌ Forgetting to grow the array first','❌ Assuming middle insertion is O(1)'],
 problems:[P('Insert into sorted list','🟡','Insert x into a sorted list so it stays sorted.','Input: a = [1, 3, 5, 7], x = 4\nOutput: [1, 3, 4, 5, 7]','Find the first item bigger than x.','Find the position, then insert there. O(n).',`def insert_sorted(a, x):
    i = 0
    while i < len(a) and a[i] < x:
        i += 1
    a.insert(i, x)
    return a`,'insert_sorted.py')]});

X('arrays/deletions',{
 simple:'Deleting from the end is easy. Deleting from the middle leaves a hole, so every item after it slides left to close the gap.',
 analogy:'Someone leaves a row of bus seats: everyone behind scoots forward one seat.',
 visual:C([1,2,3,4,5],1)+'<p>delete index 1 →</p>'+C([1,3,4,5]),
 steps:['End: pop(), O(1).','Middle: copy each later item one step left.','Remove the leftover last slot.'],
 code:`def delete_at(arr, i):
    for k in range(i + 1, len(arr)):
        arr[k - 1] = arr[k]            # shift left, front to back
    arr.pop()                          # drop the duplicate last slot

a = [1, 2, 3, 4, 5]
delete_at(a, 1)
print(a)                               # [1, 3, 4, 5]`,
 lines:[['range(i + 1, len(arr))','Everything AFTER the deleted item.'],['arr[k - 1] = arr[k]','Copy each item one step left, closing the gap.'],['arr.pop()','The last slot is now a duplicate: remove it.']],
 dry:{input:'delete_at([1, 2, 3, 4, 5], 1)',a:[1,2,3,4,5],steps:[{a:[1,3,3,4,5],m:1,v:'arr[1] = arr[2]',n:'3 moved left over the 2.'},{a:[1,3,4,4,5],m:2,v:'arr[2] = arr[3]',n:'4 moved left.'},{a:[1,3,4,5,5],m:3,v:'arr[3] = arr[4]',n:'5 moved left.'},{a:[1,3,4,5],m:3,v:'pop()',n:'Duplicate last slot removed.'}]},
 time:'At end: O(1)\nAt start / middle: O(n)',space:'O(1)',cx:'Deleting near the front moves almost every item.',
 when:['Removing an item and keeping order','In-place cleanup of arrays'],
 mistakes:['❌ Shifting back to front (copies the wrong values)','❌ Forgetting to shrink the length','❌ Deleting while looping forward (skips items)'],
 problems:[P('Remove Element','🟡','Remove every val from nums in place. Return the new length.','Input: nums = [3, 2, 2, 3], val = 3\nOutput: 2 (nums starts with [2, 2])','Keep a "write" position.','Write each kept item at w and advance w. O(n) time, O(1) space.',`def remove_element(nums, val):
    w = 0                  # next slot to write
    for x in nums:
        if x != val:
            nums[w] = x
            w += 1
    return w`,'remove_element.py')]});

X('arrays/array-practice-problems',{
 simple:'Six problems that build on each other: traversal, two pointers, hashing, in-place edits, and prefix/suffix thinking. Try each one yourself before you open any hint.',
 analogy:'Gym day. Each problem trains a different muscle, and you only get stronger by lifting it yourself.',
 visual:'<pre>1 traverse → 2 two pointers → 3 set lookup → 4 hash map → 5 in-place write pointer → 6 prefix / suffix</pre>',
 steps:['Read the problem. Write input and output on paper.','Think for 5 minutes. Try brute force first.','Code it in VSCode (see the VSCode Practice topic).','Only then open Hint 1, then Hint 2, then the approach.'],
 code:`def solve(nums):
    # 1. handle empty input
    # 2. brute force first
    # 3. then improve it
    pass

print(solve([1, 2, 3]))`,
 lines:[['def solve(nums):','Start every problem with a clear function signature.'],['# 2. brute force first','A slow correct answer beats no answer. Optimize second.']],
 time:'Aim: O(n) time, O(1) extra space when possible',space:'Depends on the problem',cx:'Always say the time AND space of your final solution.',
 when:['After finishing the Arrays topics','Before moving to Linked Lists'],
 mistakes:['❌ Reading the solution before trying','❌ Not testing empty, one-item and duplicate cases','❌ Copying code instead of typing your own'],
 problems:[
  P('Maximum element','🟢','Return the largest number in a list without using max().','Input: [3, 9, 2]\nOutput: 9','Keep a "best so far" variable.','Traverse once. O(n).',`def maximum(a):
    best = a[0]
    for x in a:
        if x > best:
            best = x
    return best`,'maximum.py'),
  P('Reverse array in place','🟢','Reverse the list in place without making a new list.','Input: [1, 2, 3, 4]\nOutput: [4, 3, 2, 1]','Use a left pointer and a right pointer.','Swap the ends and move both pointers inward. O(n) time, O(1) space.',`def reverse(a):
    l, r = 0, len(a) - 1
    while l < r:
        a[l], a[r] = a[r], a[l]
        l += 1
        r -= 1
    return a`,'reverse.py'),
  P('Contains Duplicate','🟡','Return True if any value appears at least twice.','Input: [1, 2, 3, 1]\nOutput: True','Which structure remembers what you have seen?','Use a set: if x is already in it, return True. O(n) time, O(n) space.',`def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,'contains_duplicate.py'),
  P('Two Sum','🟡','Return the indices of two numbers that add up to target.','Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]',['For each x, what number do you need?','Store value → index in a dictionary.'],'One pass: look up target - x in a dict, then store x. O(n).',`def two_sum(nums, target):
    seen = {}                       # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []`,'two_sum.py'),
  P('Move Zeroes','🟠','Move all zeros to the end in place, keeping the order of the other numbers.','Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]',['Use a write pointer for the next non-zero spot.','Swap instead of shifting.'],'Swap each non-zero item into the write position. O(n) time, O(1) space.',`def move_zeroes(nums):
    w = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[w], nums[i] = nums[i], nums[w]
            w += 1`,'move_zeroes.py'),
  P('Product of Array Except Self','🔴','Return a list where out[i] is the product of all numbers except nums[i]. No division.','Input: [1, 2, 3, 4]\nOutput: [24, 12, 8, 6]',['Product of everything to the LEFT of i, times everything to the RIGHT.','Do two passes.'],'Pass 1 stores left products. Pass 2 multiplies in right products. O(n) time, O(1) extra space.',`def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):                 # left products
        out[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):     # multiply right products
        out[i] *= right
        right *= nums[i]
    return out`,'product_except_self.py')
 ]});

X('arrays/vscode-practice',{
 simple:'This is a routine, not a lesson. Learn here, then close the site and write the code yourself in VSCode. Typing and running your own code is what makes it stick.',
 analogy:'Watching a cooking video vs. actually cooking. You only learn the dish by cooking it.',
 visual:'<pre>Read → Think → Code in VSCode → Run → Test → Compare with solution → Tick the boxes</pre>',
 steps:['Make a folder: dsa-practice/ with sub-folders like big_o/ and arrays/.','Create one file per problem, e.g. two_sum.py.','Write the function, then 3+ tests with assert at the bottom.','Run it: python two_sum.py (or the ▶ button in VSCode).','Only after it passes, open the hints and solution and compare.','Tick "Practiced in VSCode". Tick "Solved Without Help" only if you used no hints.'],
 code:`# arrays/two_sum.py
def two_sum(nums, target):
    pass   # write your solution here

# --- tests: run with  python two_sum.py ---
assert two_sum([2, 7, 11, 15], 9) == [0, 1]
assert two_sum([3, 2, 4], 6) == [1, 2]
assert two_sum([3, 3], 6) == [0, 1]
print("All tests passed")`,
 lines:[['def two_sum(nums, target):','Write the function first. Leave pass until you start.'],['assert two_sum(...) == [0, 1]','assert stops with an error if the answer is wrong. No error means correct.'],['print("All tests passed")','Only shows if every assert passed.']],
 time:'Per problem: think 5 min, code 20 min, review 5 min',space:'Daily goal: 2–3 problems',cx:'Edge cases to always test: empty list, one item, duplicates, negatives.',
 when:['After every lesson','Before opening any solution'],
 mistakes:['❌ Copying the solution instead of typing your own','❌ Not testing edge cases (empty, one item, duplicates)','❌ Skipping the run step'],
 problems:[P('Day 1 warm-up in VSCode','🟢','Write sum_list(nums) in VSCode with three assert tests, including an empty list.','Input: [1, 2, 3]\nOutput: 6','What should the sum of an empty list be?','Loop and add. An empty list returns 0.',`def sum_list(nums):
    total = 0
    for x in nums:
        total += x
    return total

assert sum_list([1, 2, 3]) == 6
assert sum_list([]) == 0
assert sum_list([-1, 1]) == 0
print("All tests passed")`,'sum_list.py')]});
