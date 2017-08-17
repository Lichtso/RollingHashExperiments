# RollingHashExperiments

## Interactive Demos
[Example: search](https://lichtso.github.io/RollingHashExperiments/search.html) and [Example: diff](https://lichtso.github.io/RollingHashExperiments/diff.html).
You can experiement with text streams fetched via HTTP.
The text steams are segemented using a rolling hash function and then the resulting segements are dyed using a general hash function.

## What is a [rolling hash](https://en.wikipedia.org/wiki/Rolling_hash) function?
Instead of giving one output value for a given input sequence of data cells (e.g. bytes),
it yields a value for each position in the sequence using a sliding window.
By some simple math (dynamic programming) it can be calculated in linear time instead of quadratic time.

## Why would you need a hash value for each position in the input sequence?
The two most popular use cases for rolling hashes are search algorithms and diff tools.
In case of a [search algorithm](https://en.wikipedia.org/wiki/Rabin–Karp_algorithm) you simply hash the needle once and
then let a rolling hash with a window of the size of the needle iterate over the haystack.
By doing so you can save a lot of string comparisons as a mismatch in the hash values definitely indicates a mismatch at that position.
And in case of diff tools you hash both input sequences and then cut them into chunks whenever the hash outputs a specific value (like 0).
Then the resulting chunks are hashed by a "normal" generic hash function.
That way, you can split the inputs into chunks of varying size based on their contents and
then find similarities as well as differences locally based on the output values of the generic hash function.
This would not be possible with uniform sized chunks as an insertion at the beginning would ruin all following hash values,
because the borders of the chunks would not move with the content.

## How does a rolling hash work?
There are multiple ways, but the easiest one to understand is to use a positional notation as sliding window.
For example if we take the number: 123456, it is encoded in a positional notation using a sequence of 6 symbols and the base 10 (different possible digits).
What we actually have is: `1*10^5 + 2*10^4 + 3*10^3 + 4*10^2 + 5*10^1 + 6*10^0 = 123456`.
If we now want to move our window one to the right, we have to remove the left symbol and add one to the right.
- `123456 - 1*10^5 = 23456`
- `23456 * 10 = 234560`
- `234560 + 7 = 234567`
- `2*10^5 + 3*10^4 + 4*10^3 + 5*10^2 + 6*10^1 + 7*10^0 = 234567`

In general the window is defined as `sum over all i in range(0, input.length): input[i] * power(base, input.length-1-i)`
And the window shift is performed by: `newHashValue = (lastHashValue - symbolToRemove * power(base, window.length-1)) * base + symbolToAdd;`
To get the output into a specific range and let it appear more chaotic we take the modulo at the end.
This can also be done in the middle process to avoid too big numbers as modular arithmetic does not affect addition, subtraction and multiplication.
