# Problem: Valid Anagram

from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:

        if len(s) != len(t):
            return False

        freq = {}
        
        for ch in s :
            freq[ch] = freq.get(ch,0)+1

        for ch in t:
            if ch not in freq or freq[ch] == 0:
                return False
            freq[ch] = freq[ch] - 1
        return True

        if chr(freq) != 0: 
            return True
        else :
            return False