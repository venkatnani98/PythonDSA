DSA.content['binary-search/what-is-binary-search'] = {
 simple:'Imagine guessing a number from 1 to 100. I only say "higher" or "lower". You always guess the middle. Every guess throws away half of the numbers. That is binary search. It only works when the data is sorted.',
 analogy:'You have 100 books arranged alphabetically. Instead of checking one by one, open the middle. If your target comes BEFORE that book, ignore the right half. Otherwise ignore the left half. Repeat until you find it.',
 visual:'<p>Target = 7</p><div class="cells"><span class="dim">1</span><span class="dim">2</span><span class="dim">3</span><span class="mid">4<small>mid</small></span><span>5</span><span>6</span><span>7</span><span>8</span></div><p>4 &lt; 7, so ignore the left half</p><div class="cells"><span>5</span><span class="mid">6<small>mid</small></span><span>7</span><span>8</span></div><p>6 &lt; 7, so ignore again → next mid is 7. Found!</p>',
 steps:['Find the middle element.','Compare the middle with the target.','If the target is smaller, search the left side.','If the target is larger, search the right side.','Repeat until found, or until left passes right (not found).'],
 code:`def binary_search(arr, target):
    left = 0                      # first valid index
    right = len(arr) - 1          # last valid index

    while left <= right:          # something is still left to search
        mid = (left + right) // 2 # middle index

        if arr[mid] == target:
            return mid            # found it
        elif arr[mid] < target:
            left = mid + 1        # target is on the right
        else:
            right = mid - 1       # target is on the left

    return -1                     # not found`,
 lines:[['left = 0','Start searching from the first element.'],['right = len(arr) - 1','The last valid index is the length minus one.'],['while left <= right:','Keep going while at least one element is still in range.'],['mid = (left + right) // 2','Middle index. // drops the decimal part.'],['arr[mid] == target','Lucky guess: return the index.'],['left = mid + 1','arr[mid] is too small, so everything up to mid is ruled out.'],['right = mid - 1','arr[mid] is too big, so everything from mid onward is ruled out.'],['return -1','The range became empty: the target is not in the array.']],
 dry:{input:'arr = [1, 2, 4, 6, 8, 10], target = 8',a:[1,2,4,6,8,10],t:8,steps:[{d:[0,5],m:2,v:'left = 0, right = 5, mid = 2',n:'arr[2] = 4 < 8, so search the right side.'},{d:[3,5],m:4,v:'left = 3, right = 5, mid = 4',n:'arr[4] = 8 == 8. Found at index 4!'}]},
 time:'Best: O(1)\nAverage: O(log n)\nWorst: O(log n)',space:'O(1)',
 cx:'O(log n): the number of remaining possibilities is cut in half each step. 1,000,000 items need only about 20 steps.',
 when:['The data is sorted.','You must repeatedly find something.','You can throw away half the search space each step.','The problem asks for the smallest/largest value that works.'],
 mistakes:['❌ Using left < right when you need left <= right','❌ left = mid instead of mid + 1 (infinite loop)','❌ Running it on unsorted data','❌ Off-by-one: right = len(arr) instead of len(arr) - 1','❌ Returning the value instead of the index'],
 interview:'Say "sorted, so binary search, O(log n)". Be ready to explain the loop condition and the mid + 1 / mid - 1 updates.',
 problems:[
  {title:'Basic Binary Search',dif:'🟢',q:'Given a sorted list nums and a target, return the index of target, or -1.',ex:'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',hints:['Keep two pointers, left and right.','Compare nums[mid] to the target and move one pointer.'],approach:'Standard loop: halve the range until found or empty. O(log n).',sol:`def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,file:'binary_search.py'},
  {title:'Search Insert Position',dif:'🟢',q:'Return the index where target is found, or where it would be inserted to keep the list sorted.',ex:'Input: nums = [1,3,5,6], target = 5\nOutput: 2\n\nInput: nums = [1,3,5,6], target = 2\nOutput: 1',hints:['If not found, where do left and right end up?','Think "first index whose value is >= target".'],approach:'Find the first position with nums[i] >= target. Let right start at len(nums) because the answer may be at the end.',sol:`def search_insert(nums, target):
    left, right = 0, len(nums)     # answer can be len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid            # mid could be the answer
    return left`,file:'search_insert.py'},
  {title:'First and Last Position',dif:'🟡',q:'Return [first, last] index of target in a sorted list, or [-1, -1].',ex:'Input: nums = [5,7,7,8,8,10], target = 8\nOutput: [3, 4]',hints:['When you find the target, do not stop.','Keep searching left for the first, right for the last.'],approach:'Run binary search twice. After a hit, save the index and keep shrinking one side. O(log n).',sol:`def search_range(nums, target):
    def bound(go_left):
        left, right, ans = 0, len(nums) - 1, -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                ans = mid                # remember, then keep looking
                if go_left: right = mid - 1
                else:       left = mid + 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return ans
    return [bound(True), bound(False)]`,file:'search_range.py'},
  {title:'Search in Rotated Sorted Array',dif:'🟠',q:'A sorted list was rotated at some pivot. Return the index of target or -1 in O(log n).',ex:'Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4',hints:['At any mid, at least one half is properly sorted.','Check whether the target lies inside the sorted half.'],approach:'Find which half is sorted (compare nums[left] and nums[mid]). If the target is in that half, go there; otherwise go to the other half.',sol:`def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:            # left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                                  # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,file:'search_rotated.py'}
 ]
};
