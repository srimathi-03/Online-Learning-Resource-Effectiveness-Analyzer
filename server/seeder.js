const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

// ─────────────────────────────────────────────────────────────
//  QUESTION POOL
//  Each topic has two banks: pre[] and post[]
//  Every question: { q, o (4 options), c (correct index 0-3), d (difficulty) }
//  Pre  = recall / conceptual / definition-based (prior knowledge check)
//  Post = applied / scenario-based / problem-solving (learning outcome check)
//  Difficulty tags: 'Easy' | 'Medium' | 'Hard'
//  Each bank has 10 Easy + 10 Medium + 10 Hard = 30 questions
//  Generator picks 7 Easy + 7 Medium + 6 Hard = 20 per test
// ─────────────────────────────────────────────────────────────
const questionPool = {

    // ══════════════════════════════════════════════════════════
    //  JAVASCRIPT
    // ══════════════════════════════════════════════════════════
    'JavaScript': {

        // ── PRE-TEST (recall / conceptual / definitions) ──────
        pre: [
            // Easy (10)
            { q: "Which keyword declares a variable that cannot be reassigned?", o: ["var", "let", "const", "static"], c: 2, d: "Easy" },
            { q: "What symbol is used for single-line comments in JavaScript?", o: ["#", "//", "/*", "--"], c: 1, d: "Easy" },
            { q: "Which company originally created JavaScript?", o: ["Microsoft", "Netscape", "Google", "Apple"], c: 1, d: "Easy" },
            { q: "What data type does typeof [] return?", o: ["array", "object", "list", "undefined"], c: 1, d: "Easy" },
            { q: "How do you write an alert box in JavaScript?", o: ["msg()", "alert()", "popup()", "console.log()"], c: 1, d: "Easy" },
            { q: "Which method adds an element to the END of an array?", o: ["shift()", "unshift()", "push()", "pop()"], c: 2, d: "Easy" },
            { q: "What does NaN stand for?", o: ["Not a Node", "Not a Number", "Null and None", "New a Null"], c: 1, d: "Easy" },
            { q: "Which HTML tag is used to include external JavaScript?", o: ["<js>", "<script>", "<code>", "<link>"], c: 1, d: "Easy" },
            { q: "What is the correct way to declare a function in JavaScript?", o: ["func myFunc(){}", "function myFunc(){}", "def myFunc():", "void myFunc(){}"], c: 1, d: "Easy" },
            { q: "What does the === operator check?", o: ["Value only", "Type only", "Value and type", "Reference"], c: 2, d: "Easy" },

            // Medium (10)
            { q: "What is hoisting in JavaScript?", o: ["Lifting CSS styles", "Moving declarations to the top of scope", "A React feature", "A sorting algorithm"], c: 1, d: "Medium" },
            { q: "What is the difference between null and undefined?", o: ["They are the same", "null is intentional absence; undefined means not yet assigned", "null is a number; undefined is a string", "undefined is assigned; null is not"], c: 1, d: "Medium" },
            { q: "What does the spread operator (...) do?", o: ["Loops an array", "Spreads elements of an iterable", "Creates a new variable", "Delays execution"], c: 1, d: "Medium" },
            { q: "What is a closure in JavaScript?", o: ["A closed loop", "A function that retains access to its lexical scope", "A CSS class", "An array method"], c: 1, d: "Medium" },
            { q: "What is the purpose of 'use strict'?", o: ["Runs code faster", "Enables modern syntax", "Enforces stricter error handling and prevents bad practices", "Compresses files"], c: 2, d: "Medium" },
            { q: "What is the difference between == and ===?", o: ["No difference", "== checks type; === checks value", "=== checks type; == checks value and type", "== does type coercion; === does not"], c: 3, d: "Medium" },
            { q: "What does Array.prototype.map() return?", o: ["The original array", "A new array with transformed elements", "undefined", "A boolean"], c: 1, d: "Medium" },
            { q: "Which of these is NOT a falsy value in JavaScript?", o: ["0", "''", "null", "[]"], c: 3, d: "Medium" },
            { q: "What is event bubbling?", o: ["Events flow from child to parent", "Events flow from parent to child", "Events are cancelled", "Events are cloned"], c: 0, d: "Medium" },
            { q: "What does the typeof operator return for a function?", o: ["'object'", "'callable'", "'function'", "'method'"], c: 2, d: "Medium" },

            // Hard (10)
            { q: "What is the output of: console.log(typeof typeof 42)?", o: ["'number'", "'string'", "'object'", "42"], c: 1, d: "Hard" },
            { q: "What is the difference between call(), apply(), and bind()?", o: ["They all do the same thing", "call/apply invoke immediately; bind returns a new function", "bind invokes immediately; call returns a function", "apply is deprecated"], c: 1, d: "Hard" },
            { q: "What is a Proxy object in JavaScript?", o: ["A server tool", "An object that intercepts operations on another object", "A promise wrapper", "An event emitter"], c: 1, d: "Hard" },
            { q: "What does Object.freeze() do?", o: ["Copies an object", "Makes all properties writable", "Prevents modification of an object's properties", "Deletes all properties"], c: 2, d: "Hard" },
            { q: "What is tail call optimization?", o: ["A CSS trick", "An engine optimization where tail-position calls reuse the stack frame", "A loop optimization", "A Babel plugin"], c: 1, d: "Hard" },
            { q: "What is the TDZ (Temporal Dead Zone)?", o: ["A deleted variable's memory", "The period between let/const declaration and initialization", "A garbage collection phase", "A network timeout zone"], c: 1, d: "Hard" },
            { q: "What does Promise.allSettled() return vs Promise.all()?", o: ["They are identical", "allSettled waits for all regardless of rejection; all rejects on first failure", "all waits for all; allSettled stops at first failure", "None of the above"], c: 1, d: "Hard" },
            { q: "What is a WeakMap and how does it differ from a Map?", o: ["WeakMap is faster", "WeakMap keys must be objects and are weakly held (GC-able)", "WeakMap allows primitive keys", "They are identical"], c: 1, d: "Hard" },
            { q: "What is the result of: (function(x){ return x*x; })(3)?", o: ["NaN", "undefined", "9", "Error"], c: 2, d: "Hard" },
            { q: "What problem does the module pattern solve?", o: ["Performance", "Global namespace pollution by encapsulating code", "Memory leaks", "Type errors"], c: 1, d: "Hard" }
        ],

        // ── POST-TEST (applied / scenario / problem-solving) ──
        post: [
            // Easy (10)
            { q: "You need to loop through an array and print each item. Which method is most appropriate?", o: ["map()", "filter()", "forEach()", "reduce()"], c: 2, d: "Easy" },
            { q: "A user clicks a button and nothing happens. You check the console and see 'ReferenceError: myFunc is not defined'. What is the likely cause?", o: ["Wrong CSS", "The function was never declared", "Wrong HTML tag", "Browser bug"], c: 1, d: "Easy" },
            { q: "You want to store a user's name that won't change after assignment. Which keyword do you use?", o: ["var", "let", "const", "static"], c: 2, d: "Easy" },
            { q: "Which built-in method would you use to convert the string '42' to a number?", o: ["toString()", "parseInt()", "stringify()", "convert()"], c: 1, d: "Easy" },
            { q: "Your array has 5 items. You call arr.pop(). How many items remain?", o: ["5", "4", "6", "0"], c: 1, d: "Easy" },
            { q: "You want to check if a variable is an array before using .map(). What is the correct check?", o: ["typeof arr === 'array'", "arr.isArray()", "Array.isArray(arr)", "arr instanceof List"], c: 2, d: "Easy" },
            { q: "Which method would you use to find the first element in an array that matches a condition?", o: ["filter()", "find()", "some()", "indexOf()"], c: 1, d: "Easy" },
            { q: "You need to combine two arrays into one. Which operator/method achieves this most cleanly?", o: ["join()", "concat() or spread operator", "push()", "merge()"], c: 1, d: "Easy" },
            { q: "You want to remove duplicate values from an array. What is the simplest approach?", o: ["Use a for loop", "[...new Set(array)]", "array.unique()", "array.filter(x => x)"], c: 1, d: "Easy" },
            { q: "A function should run only after the page fully loads. Which event do you attach it to?", o: ["'load' or DOMContentLoaded", "'start'", "'ready'", "'init'"], c: 0, d: "Easy" },

            // Medium (10)
            { q: "You fetch data from an API using fetch(). Where should you handle network errors?", o: ["Inside the .then() block", "Inside a .catch() block", "Using a global variable", "It handles itself"], c: 1, d: "Medium" },
            { q: "A senior dev says your click handler fires 50 times per second on scroll. What technique fixes this?", o: ["Caching", "Throttling or Debouncing", "Memoization", "Lazy loading"], c: 1, d: "Medium" },
            { q: "You want a function that remembers a counter between calls without using global state. What pattern fits?", o: ["Prototype", "Closure", "Promise", "Event emitter"], c: 1, d: "Medium" },
            { q: "Your async function uses await but you forgot the async keyword. What error occurs?", o: ["ReferenceError", "SyntaxError: await is only valid in async functions", "TypeError", "Nothing happens"], c: 1, d: "Medium" },
            { q: "Which approach correctly deep-copies an object without referencing the original?", o: ["let b = a", "let b = Object.assign({}, a) for nested objects", "let b = JSON.parse(JSON.stringify(a))", "let b = {...a} for deep nesting"], c: 2, d: "Medium" },
            { q: "You have 3 independent API calls and want all results before rendering. What do you use?", o: ["3 sequential awaits", "Promise.race()", "Promise.all()", "Promise.any()"], c: 2, d: "Medium" },
            { q: "A button click handler adds a new event listener each time it runs. What problem does this cause?", o: ["Slower CSS", "Memory leak and duplicate event handlers", "Error on second click", "Nothing"], c: 1, d: "Medium" },
            { q: "You see 'Cannot read properties of undefined (reading .map)'. What is the most likely fix?", o: ["Use a forEach instead", "Check that the variable is defined and is an array before calling .map()", "Import map from lodash", "The array is too large"], c: 1, d: "Medium" },
            { q: "A function that takes a function as an argument or returns one is called a:", o: ["Callback", "Higher-order function", "Generator", "Constructor"], c: 1, d: "Medium" },
            { q: "You need to run code after a user stops typing for 500ms. Which technique do you apply?", o: ["Throttling", "Polling", "Debouncing", "setTimeout loop"], c: 2, d: "Medium" },

            // Hard (10)
            { q: "A React app re-renders on every keystroke even when the input component is memoized. What is the likely cause?", o: ["Wrong CSS", "A new function reference is created every render and passed as a prop", "useState is broken", "React is outdated"], c: 1, d: "Hard" },
            { q: "You have a loop: for(var i=0;i<3;i++){setTimeout(()=>console.log(i),1000);} What is logged?", o: ["0 1 2", "3 3 3", "0 0 0", "1 2 3"], c: 1, d: "Hard" },
            { q: "How do you fix the above loop to log 0, 1, 2?", o: ["Use for...of", "Replace var with let", "Use a callback", "Use parseInt"], c: 1, d: "Hard" },
            { q: "What is the correct way to implement a private variable in a class without the # syntax?", o: ["Using var", "Using a closure or WeakMap to store private state", "Using underscore prefix", "Private variables are impossible without #"], c: 1, d: "Hard" },
            { q: "Your app has a deep component tree and prop drilling becomes unmanageable. What is the best JS-native solution before reaching for Redux?", o: ["localStorage", "Context API", "URL params", "Custom events"], c: 1, d: "Hard" },
            { q: "A function memoization cache grows indefinitely in a long-running server. What data structure prevents memory leaks?", o: ["Map", "WeakMap", "Array", "Set"], c: 1, d: "Hard" },
            { q: "You need to intercept all property access on an object for logging. What JS feature enables this?", o: ["Object.defineProperty only", "Proxy with a get trap", "Reflect API", "Symbol.toPrimitive"], c: 1, d: "Hard" },
            { q: "What is the output of: [1,2,3].reduce((acc,v)=>acc+v, 0)?", o: ["[1,2,3]", "undefined", "6", "NaN"], c: 2, d: "Hard" },
            { q: "You are writing a library and want to prevent consumers from extending your class. What is the best approach in modern JS?", o: ["Use private fields only", "Use Object.freeze on the prototype", "Use a Symbol as a seal", "Throw in the constructor if subclassed"], c: 3, d: "Hard" },
            { q: "Explain the output: Promise.resolve(1).then(v=>v+1).then(v=>{ throw v; }).catch(v=>v+1).then(console.log)", o: ["2", "3", "Error", "undefined"], c: 1, d: "Hard" }
        ]
    },

    // ══════════════════════════════════════════════════════════
    //  PYTHON
    // ══════════════════════════════════════════════════════════
    'Python': {

        // ── PRE-TEST ─────────────────────────────────────────
        pre: [
            // Easy (10)
            { q: "What is the file extension for Python source files?", o: [".py", ".pyt", ".python", ".pt"], c: 0, d: "Easy" },
            { q: "Which keyword is used to define a function in Python?", o: ["func", "define", "def", "lambda"], c: 2, d: "Easy" },
            { q: "How do you print 'Hello World' in Python 3?", o: ["echo 'Hello World'", "console.log('Hello World')", "print('Hello World')", "printf('Hello World')"], c: 2, d: "Easy" },
            { q: "Which symbol starts a single-line comment in Python?", o: ["//", "#", "--", "/*"], c: 1, d: "Easy" },
            { q: "What is the package manager for Python?", o: ["npm", "gem", "pip", "brew"], c: 2, d: "Easy" },
            { q: "How do you create a list in Python?", o: ["list = {1,2,3}", "list = (1,2,3)", "list = [1,2,3]", "list = <1,2,3>"], c: 2, d: "Easy" },
            { q: "Which keyword is used to handle exceptions?", o: ["try/catch", "try/except", "handle/error", "begin/rescue"], c: 1, d: "Easy" },
            { q: "What does len([1,2,3]) return?", o: ["2", "3", "4", "0"], c: 1, d: "Easy" },
            { q: "Which keyword is used to define a class in Python?", o: ["struct", "class", "object", "type"], c: 1, d: "Easy" },
            { q: "What is the default return value of a Python function with no return statement?", o: ["0", "False", "None", "undefined"], c: 2, d: "Easy" },

            // Medium (10)
            { q: "What is the difference between a list and a tuple in Python?", o: ["Lists use () and tuples use []", "Lists are immutable, tuples are mutable", "Lists are mutable, tuples are immutable", "There is no difference"], c: 2, d: "Medium" },
            { q: "What is a dictionary in Python?", o: ["Ordered sequence", "Key-value pair collection", "Immutable list", "Stack data structure"], c: 1, d: "Medium" },
            { q: "What does the __init__ method do in a Python class?", o: ["Deletes the object", "Acts as a constructor to initialize attributes", "Defines class methods", "Imports modules"], c: 1, d: "Medium" },
            { q: "What is 'self' in a Python class method?", o: ["A global keyword", "A reference to the current instance", "A parent class", "A static variable"], c: 1, d: "Medium" },
            { q: "What is a Python decorator?", o: ["A CSS concept", "A function that modifies another function's behavior", "A type annotation", "A built-in class"], c: 1, d: "Medium" },
            { q: "What is a lambda function in Python?", o: ["A large, named function", "An anonymous single-expression function", "A recursive function", "A class method"], c: 1, d: "Medium" },
            { q: "What is a list comprehension?", o: ["A for loop", "A concise syntax to create lists: [expr for item in iterable]", "A dictionary method", "A generator"], c: 1, d: "Medium" },
            { q: "What does the yield keyword do?", o: ["Returns and exits the function", "Produces a value and pauses, making the function a generator", "Raises an exception", "Imports a module"], c: 1, d: "Medium" },
            { q: "What is PEP 8?", o: ["A Python version", "Python's style guide for writing readable code", "A security patch", "A package manager"], c: 1, d: "Medium" },
            { q: "What is the difference between a shallow copy and a deep copy?", o: ["They are the same", "Shallow copy copies references; deep copy copies the full object tree", "Deep copy is faster", "Shallow copy copies nested objects too"], c: 1, d: "Medium" },

            // Hard (10)
            { q: "What is the Global Interpreter Lock (GIL) in Python?", o: ["A firewall", "A mutex that allows only one thread to execute Python bytecode at a time", "A garbage collector", "A memory allocator"], c: 1, d: "Hard" },
            { q: "What is a Python metaclass?", o: ["A parent class", "A class whose instances are classes themselves", "A decorator", "A built-in type"], c: 1, d: "Hard" },
            { q: "What is the difference between __str__ and __repr__?", o: ["They are identical", "__str__ is for end-users; __repr__ is for developers/debugging", "__repr__ is for display; __str__ is for debugging", "Only __repr__ is used in Python 3"], c: 1, d: "Hard" },
            { q: "What is pickling in Python?", o: ["Cooking technique", "Serializing/deserializing Python objects to a byte stream", "Encrypting data", "Compressing files"], c: 1, d: "Hard" },
            { q: "What does @property do in a Python class?", o: ["Defines a class variable", "Turns a method into a read-only attribute accessed without ()", "Creates a static method", "Marks a method as private"], c: 1, d: "Hard" },
            { q: "What is monkey patching?", o: ["A testing framework", "Dynamically modifying a class or module at runtime", "A design pattern", "A debugging technique"], c: 1, d: "Hard" },
            { q: "What is the purpose of __slots__ in a Python class?", o: ["Restricts methods", "Prevents dynamic attribute addition and reduces memory usage", "Creates a tuple of methods", "Enables multi-inheritance"], c: 1, d: "Hard" },
            { q: "What is the difference between a generator and a list comprehension?", o: ["No difference", "Generators are lazy (yield one value at a time); list comprehensions materialize fully in memory", "List comprehensions are lazy", "Generators cannot be iterated"], c: 1, d: "Hard" },
            { q: "What is the MRO (Method Resolution Order) in Python?", o: ["Memory Resolution Order", "The order in which Python searches classes for a method using C3 linearization", "Module Resolution Order", "An inheritance restriction"], c: 1, d: "Hard" },
            { q: "What does functools.lru_cache do?", o: ["Locks a function", "Memoizes function results to cache expensive calls", "Limits function recursion", "Profiles function runtime"], c: 1, d: "Hard" }
        ],

        // ── POST-TEST ────────────────────────────────────────
        post: [
            // Easy (10)
            { q: "You need to iterate over a dictionary's key-value pairs. Which method do you use?", o: [".keys()", ".values()", ".items()", ".pairs()"], c: 2, d: "Easy" },
            { q: "Your list ['a','b','c'] needs to be reversed. Which approach works?", o: ["list.reverse() or list[::-1]", "list.flip()", "reversed_list(list)", "list.sort(reverse)"], c: 0, d: "Easy" },
            { q: "You need to read all lines from a text file. Which is the correct approach?", o: ["file.readlines()", "file.getlines()", "open.read()", "read.file()"], c: 0, d: "Easy" },
            { q: "Which built-in function returns the largest value in a list?", o: ["largest()", "top()", "max()", "high()"], c: 2, d: "Easy" },
            { q: "You want to check if 'apple' exists in a list of fruits. What is the Pythonic way?", o: ["fruits.contains('apple')", "'apple' in fruits", "fruits.find('apple')", "fruits.has('apple')"], c: 1, d: "Easy" },
            { q: "A function should accept any number of positional arguments. What parameter syntax is used?", o: ["**args", "*args", "args[]", "...args"], c: 1, d: "Easy" },
            { q: "You need to combine two dictionaries. What is the modern Python 3.9+ syntax?", o: ["dict1 + dict2", "dict1.merge(dict2)", "dict1 | dict2", "merge(dict1, dict2)"], c: 2, d: "Easy" },
            { q: "Which statement is used to import only a specific function from a module?", o: ["import module.function", "from module import function", "require(module, function)", "using module::function"], c: 1, d: "Easy" },
            { q: "You want to sort a list of tuples by the second element. Which argument to sorted() achieves this?", o: ["sorted(lst, by=1)", "sorted(lst, key=lambda x: x[1])", "lst.sort(1)", "sorted(lst, index=1)"], c: 1, d: "Easy" },
            { q: "You have a string 'hello world'. What does 'hello world'.split() return?", o: ["'hello', 'world'", "['hello', 'world']", "('hello', 'world')", "Error"], c: 1, d: "Easy" },

            // Medium (10)
            { q: "You need to ensure a file is always closed after reading, even if an error occurs. What do you use?", o: ["try/finally", "with open() as f", "file.close() at the end", "Both A and B are correct"], c: 1, d: "Medium" },
            { q: "Your program reads millions of lines from a file. What is the most memory-efficient approach?", o: ["readlines() into a list", "Iterate over the file object directly line by line", "Read all into a string and split", "Load into a database first"], c: 1, d: "Medium" },
            { q: "A class method needs access to the class but not a specific instance. Which decorator do you use?", o: ["@staticmethod", "@classmethod", "@property", "@abstractmethod"], c: 1, d: "Medium" },
            { q: "You want a function that squares numbers one at a time from a large range without storing all in memory. What do you write?", o: ["A list comprehension", "A generator function using yield", "A recursive function", "A class with __iter__"], c: 1, d: "Medium" },
            { q: "What is the correct way to handle multiple exception types in one except clause?", o: ["except Error1, Error2:", "except (Error1, Error2):", "except Error1 | Error2:", "except Error1 or Error2:"], c: 1, d: "Medium" },
            { q: "You need to cache results of an expensive function. What is the Pythonic approach?", o: ["Use a global dict manually", "Use @functools.lru_cache", "Use a class attribute", "Write results to a file"], c: 1, d: "Medium" },
            { q: "Which approach correctly implements a singleton pattern in Python?", o: ["Only one class per file", "Using __new__ to control instance creation", "Using @staticmethod for all methods", "Returning None from __init__"], c: 1, d: "Medium" },
            { q: "You run code and get 'RecursionError: maximum recursion depth exceeded'. What is the most likely fix?", o: ["Add more RAM", "Add a base case to your recursive function", "Use a faster CPU", "Import sys and set a higher limit"], c: 1, d: "Medium" },
            { q: "Two threads modify a shared counter in Python. What synchronization tool prevents race conditions?", o: ["asyncio", "threading.Lock()", "multiprocessing.Pool()", "Global variable"], c: 1, d: "Medium" },
            { q: "What does the walrus operator := do (Python 3.8+)?", o: ["Assigns and returns a value in an expression", "Compares two values", "Creates an infinite loop", "Defines a lambda"], c: 0, d: "Medium" },

            // Hard (10)
            { q: "You profile a Python app and find it is CPU-bound. Which approach best improves throughput?", o: ["asyncio", "threading", "multiprocessing", "global variables"], c: 2, d: "Hard" },
            { q: "You need a class that cannot be instantiated directly. What Python mechanism enforces this?", o: ["Private __init__", "abc.ABC with @abstractmethod", "raise in __init__", "Both B and C work"], c: 3, d: "Hard" },
            { q: "A web scraper must fetch 100 URLs concurrently without spawning 100 threads. What Python feature is best?", o: ["multiprocessing.Pool", "asyncio with aiohttp", "threading.Thread x100", "subprocess"], c: 1, d: "Hard" },
            { q: "What does __enter__ and __exit__ enable in a class?", o: ["Operator overloading", "Use as a context manager with the 'with' statement", "Iteration protocol", "Comparison protocol"], c: 1, d: "Hard" },
            { q: "Given: x = [1,2,3]; y = x; y.append(4). What is x?", o: ["[1,2,3]", "[1,2,3,4]", "Error", "None"], c: 1, d: "Hard" },
            { q: "You want descriptors to validate attribute types when set on a class. What magic methods do you implement?", o: ["__get__ and __set__", "__init__ and __str__", "__class__ and __type__", "__validate__ and __check__"], c: 0, d: "Hard" },
            { q: "What is the output of list(map(lambda x: x**2, filter(lambda x: x%2==0, [1,2,3,4,5])))?", o: ["[1,4,9,16,25]", "[4,16]", "[2,4]", "[1,9,25]"], c: 1, d: "Hard" },
            { q: "How would you implement an LRU cache from scratch (no decorators)?", o: ["Use a list", "Use an OrderedDict, moving accessed keys to end", "Use a set", "Use a frozenset"], c: 1, d: "Hard" },
            { q: "In Python's data model, what does implementing __iter__ and __next__ on a class enable?", o: ["Hashing", "The iterator protocol: the object works in for loops and comprehensions", "Comparison", "Context management"], c: 1, d: "Hard" },
            { q: "What is the purpose of __all__ in a Python module?", o: ["Lists private names", "Defines what names are exported when 'from module import *' is used", "Lists all classes", "Prevents imports"], c: 1, d: "Hard" }
        ]
    },

    // ══════════════════════════════════════════════════════════
    //  AWS
    // ══════════════════════════════════════════════════════════
    'AWS': {

        // ── PRE-TEST ─────────────────────────────────────────
        pre: [
            // Easy (10)
            { q: "What does AWS stand for?", o: ["Advanced Web Services", "Amazon Web Services", "Automated Web System", "Application Web Suite"], c: 1, d: "Easy" },
            { q: "Which AWS service provides virtual servers in the cloud?", o: ["S3", "RDS", "EC2", "Lambda"], c: 2, d: "Easy" },
            { q: "What is Amazon S3 primarily used for?", o: ["Running virtual machines", "Object/file storage", "Relational database hosting", "DNS management"], c: 1, d: "Easy" },
            { q: "What does IAM stand for in AWS?", o: ["Internet Access Management", "Identity and Access Management", "Internal Application Manager", "Integrated API Module"], c: 1, d: "Easy" },
            { q: "Which AWS service is a managed relational database?", o: ["DynamoDB", "Redshift", "RDS", "ElastiCache"], c: 2, d: "Easy" },
            { q: "What is AWS Lambda?", o: ["A virtual server", "A serverless compute service", "A storage service", "A DNS service"], c: 1, d: "Easy" },
            { q: "What does a VPC stand for in AWS?", o: ["Virtual Private Cloud", "Virtual Public Computer", "Verified Private Channel", "Virtual Processing Core"], c: 0, d: "Easy" },
            { q: "Which AWS service is a NoSQL database?", o: ["RDS", "Aurora", "DynamoDB", "Redshift"], c: 2, d: "Easy" },
            { q: "What is CloudWatch used for in AWS?", o: ["Content delivery", "Monitoring and observability", "Container orchestration", "Domain registration"], c: 1, d: "Easy" },
            { q: "What is the AWS free tier designed for?", o: ["Production workloads", "Exploring and experimenting with AWS services at no/low cost", "Enterprise-scale deployments", "Government use only"], c: 1, d: "Easy" },

            // Medium (10)
            { q: "What is the difference between S3 Standard and S3 Glacier?", o: ["No difference", "Glacier is for frequent access; Standard is for archival", "Standard is for frequent access; Glacier is low-cost archival storage", "Glacier is faster"], c: 2, d: "Medium" },
            { q: "What is an AWS Security Group?", o: ["An IAM role", "A virtual firewall controlling inbound/outbound traffic for EC2 instances", "A VPC subnet", "A CloudWatch alarm"], c: 1, d: "Medium" },
            { q: "What is the difference between an EC2 public subnet and a private subnet?", o: ["No difference", "Public subnets have a route to an Internet Gateway; private subnets do not", "Private subnets allow more traffic", "Public subnets are more secure"], c: 1, d: "Medium" },
            { q: "What is Amazon CloudFront?", o: ["A relational database", "A content delivery network (CDN) that caches content at edge locations", "A monitoring service", "A compute service"], c: 1, d: "Medium" },
            { q: "What is Auto Scaling in AWS?", o: ["Manually adding instances", "Automatically adjusting the number of EC2 instances based on demand", "A billing feature", "A storage expansion tool"], c: 1, d: "Medium" },
            { q: "What is the purpose of an AWS Load Balancer (ELB)?", o: ["Encrypts traffic", "Distributes incoming traffic across multiple targets", "Stores session data", "Creates VPCs"], c: 1, d: "Medium" },
            { q: "What is the difference between SQS and SNS?", o: ["They are identical", "SQS is a message queue for decoupling; SNS is a pub/sub notification service", "SNS is a queue; SQS is pub/sub", "Both are databases"], c: 1, d: "Medium" },
            { q: "What does AWS CloudTrail do?", o: ["Monitors app performance", "Logs and audits all API calls made in your AWS account", "Deploys applications", "Manages DNS"], c: 1, d: "Medium" },
            { q: "What is an AMI (Amazon Machine Image)?", o: ["A network interface", "A pre-configured template used to launch EC2 instances", "An IAM policy", "A database snapshot"], c: 1, d: "Medium" },
            { q: "What is AWS Elastic Beanstalk?", o: ["A container service", "A PaaS that automates deployment and management of applications", "A serverless function tool", "A DNS service"], c: 1, d: "Medium" },

            // Hard (10)
            { q: "What is the difference between horizontal and vertical scaling on AWS?", o: ["No difference", "Horizontal = adding more instances; Vertical = increasing resources on one instance", "Vertical = adding instances; Horizontal = resizing", "Both mean resizing"], c: 1, d: "Hard" },
            { q: "What is an AWS NAT Gateway used for?", o: ["Public internet access for instances", "Allowing private subnet instances to initiate outbound internet traffic without being reachable from outside", "VPN setup", "Load balancing"], c: 1, d: "Hard" },
            { q: "What is the AWS Shared Responsibility Model?", o: ["AWS owns all security", "Customers own all security", "AWS secures the cloud infrastructure; customers secure what they put IN the cloud", "A billing model"], c: 2, d: "Hard" },
            { q: "What is an AWS service endpoint and why is it used?", o: ["A Lambda trigger", "A private connection to AWS services without internet traffic leaving the AWS network", "A DNS record", "A load balancer listener"], c: 1, d: "Hard" },
            { q: "What is AWS Kinesis best suited for?", o: ["Batch file storage", "Real-time streaming data ingestion and processing", "SQL querying of S3 data", "Container orchestration"], c: 1, d: "Hard" },
            { q: "What is the difference between RDS Multi-AZ and Read Replicas?", o: ["They are identical", "Multi-AZ is for high availability/failover; Read Replicas are for scaling read traffic", "Read Replicas handle failover; Multi-AZ scales reads", "Multi-AZ is cheaper"], c: 1, d: "Hard" },
            { q: "What AWS service would you use to run containers without managing servers?", o: ["EC2", "EKS on EC2", "AWS Fargate", "Elastic Beanstalk"], c: 2, d: "Hard" },
            { q: "What is an IAM role vs an IAM user?", o: ["They are identical", "IAM User is for humans with long-term credentials; IAM Role is assumed temporarily by services or users", "IAM Role has credentials; IAM User does not", "IAM User is more secure"], c: 1, d: "Hard" },
            { q: "What does AWS WAF protect against?", o: ["DDoS at network layer", "Common web exploits like SQL injection and XSS at the application layer", "S3 bucket exposure", "IAM misconfigurations"], c: 1, d: "Hard" },
            { q: "In a serverless architecture on AWS, which combination handles API requests end to end?", o: ["EC2 + RDS", "API Gateway + Lambda + DynamoDB", "ECS + S3 + CloudFront", "Beanstalk + SQS"], c: 1, d: "Hard" }
        ],

        // ── POST-TEST ────────────────────────────────────────
        post: [
            // Easy (10)
            { q: "Your team needs to store user profile pictures uploaded by users. Which AWS service is best?", o: ["EC2 local disk", "Amazon S3", "RDS", "EBS"], c: 1, d: "Easy" },
            { q: "You accidentally exposed your AWS access key publicly. What is the FIRST thing you should do?", o: ["Delete the AWS account", "Immediately deactivate/delete the key in IAM", "Change your password", "Email AWS support"], c: 1, d: "Easy" },
            { q: "Which IAM best practice helps reduce risk if credentials are compromised?", o: ["Share credentials", "Use one admin account for all tasks", "Apply the principle of least privilege", "Disable MFA for easier access"], c: 2, d: "Easy" },
            { q: "Your Lambda function is timing out. What is the most direct setting to change?", o: ["Memory allocation", "Execution timeout", "VPC settings", "IAM role"], c: 1, d: "Easy" },
            { q: "You want to send an email notification when an S3 upload occurs. What is the best AWS service combination?", o: ["S3 + EC2", "S3 Event → SNS → Email", "S3 + CloudWatch only", "S3 + RDS"], c: 1, d: "Easy" },
            { q: "Which S3 storage class is most cost-effective for data accessed only once a month?", o: ["S3 Standard", "S3 Standard-IA", "S3 Glacier", "S3 One Zone-IA"], c: 1, d: "Easy" },
            { q: "Your EC2 instance in a public subnet cannot reach the internet. What is likely misconfigured?", o: ["Security Group", "IAM Role", "Internet Gateway attachment or route table", "AMI version"], c: 2, d: "Easy" },
            { q: "You need to restrict an S3 bucket so only your company's IP range can access it. What do you apply?", o: ["Security Group", "S3 Bucket Policy with IP condition", "IAM User restriction", "VPC Endpoint"], c: 1, d: "Easy" },
            { q: "Which AWS service lets you run SQL queries directly on data stored in S3?", o: ["RDS", "Athena", "Redshift only", "DynamoDB Streams"], c: 1, d: "Easy" },
            { q: "You are designing for disaster recovery. Which feature ensures your RDS database automatically fails over to a standby?", o: ["Read Replica", "Multi-AZ Deployment", "S3 backup", "CloudFront"], c: 1, d: "Easy" },

            // Medium (10)
            { q: "Your application needs to handle traffic spikes of 10x during business hours with minimal cost at night. What is the best architecture?", o: ["Largest EC2 instance 24/7", "EC2 Auto Scaling Group with scheduled scaling policies", "Reserved Instances at peak size", "Only Lambda"], c: 1, d: "Medium" },
            { q: "Microservice A must not fail when Microservice B is slow or down. What AWS pattern helps with this?", o: ["Tightly couple them with direct HTTP calls", "Use SQS to decouple them so A queues messages and B processes asynchronously", "Deploy on the same EC2", "Use a single database"], c: 1, d: "Medium" },
            { q: "A DynamoDB table is receiving 10,000 reads/sec and costs are increasing. What is the most appropriate optimization?", o: ["Switch to RDS", "Enable DynamoDB Accelerator (DAX) for in-memory caching", "Delete indexes", "Increase write units"], c: 1, d: "Medium" },
            { q: "You need to run a nightly batch job for 2 hours on AWS without paying for idle EC2 time. What is the best option?", o: ["Always-on EC2", "AWS Lambda (limited to 15 min)", "AWS Batch or EC2 Spot Instances", "RDS scheduled query"], c: 2, d: "Medium" },
            { q: "Your CloudWatch alarm shows high CPU on EC2. What are TWO appropriate actions?", o: ["Restart the instance only", "Scale horizontally via Auto Scaling + check for inefficient code", "Increase disk size", "Change the AMI"], c: 1, d: "Medium" },
            { q: "How would you securely store database credentials for a Lambda function instead of hardcoding them?", o: ["Environment variables (plain text)", "AWS Secrets Manager or SSM Parameter Store", "S3 config file", "IAM user credentials"], c: 1, d: "Medium" },
            { q: "A user reports slow page loads from Asia for your US-East-hosted app. What AWS service reduces latency?", o: ["Larger EC2 instance", "CloudFront with edge locations in Asia", "Route 53 only", "Additional RDS replicas"], c: 1, d: "Medium" },
            { q: "You need to enforce that all objects uploaded to an S3 bucket are encrypted. What do you configure?", o: ["IAM policy only", "S3 Default Encryption + Bucket Policy denying unencrypted PutObject", "CloudTrail logging", "VPC Endpoint"], c: 1, d: "Medium" },
            { q: "Your team needs zero-downtime deployments on EC2. Which ELB feature enables this?", o: ["Connection Draining / Deregistration Delay during rolling deploys", "Increasing instance size", "Using spot instances", "Disabling health checks temporarily"], c: 0, d: "Medium" },
            { q: "What is the right way to grant an EC2 instance access to an S3 bucket without using access keys?", o: ["Hardcode keys in the instance", "Attach an IAM Role to the EC2 instance", "Create an IAM User on the instance", "Embed keys in user data"], c: 1, d: "Medium" },

            // Hard (10)
            { q: "Design a highly available web app on AWS. Which component configuration is essential?", o: ["Single AZ EC2 with Auto Scaling", "Multi-AZ EC2 behind an ALB with Multi-AZ RDS", "Single EC2 with S3 for all data", "Lambda only"], c: 1, d: "Hard" },
            { q: "You need to migrate a 10TB on-premise database to AWS with minimal downtime. What is the best service?", o: ["Manual S3 upload", "AWS Database Migration Service (DMS) with continuous replication", "Snowball only", "Direct Connect + mysqldump"], c: 1, d: "Hard" },
            { q: "A Lambda function needs to access a private RDS instance. What must be configured?", o: ["Public RDS endpoint only", "Lambda must be in the same VPC, same security group rules allowing traffic", "IAM role is sufficient", "Lambda cannot access RDS"], c: 1, d: "Hard" },
            { q: "Your SQS queue is growing faster than consumers can process. What is the best strategy?", o: ["Increase message visibility timeout only", "Scale out consumer Lambda functions or EC2 instances using queue depth as a CloudWatch metric", "Delete old messages", "Increase queue size limit"], c: 1, d: "Hard" },
            { q: "You need sub-millisecond latency for a leaderboard in a gaming app. Which database and caching combo is ideal?", o: ["RDS + CloudFront", "DynamoDB + ElastiCache (Redis)", "S3 + Athena", "Aurora + SQS"], c: 1, d: "Hard" },
            { q: "Your AWS account was breached and unauthorized EC2 instances were launched. What is your step-by-step response?", o: ["Delete all instances immediately", "Isolate → Revoke compromised credentials → Enable CloudTrail/GuardDuty → Investigate → Remediate", "Change password only", "Contact AWS to fix it"], c: 1, d: "Hard" },
            { q: "What is the difference between Service Control Policies (SCPs) in AWS Organizations and IAM policies?", o: ["They are identical", "SCPs set maximum permissions for accounts in an OU; IAM policies grant permissions to identities", "IAM policies override SCPs", "SCPs replace IAM entirely"], c: 1, d: "Hard" },
            { q: "You run a multi-tenant SaaS on AWS. Which approach best isolates tenant data securely?", o: ["One S3 key prefix per tenant", "Separate AWS account per tenant with Control Tower", "Single DB with tenant_id column", "Common S3 bucket with ACLs"], c: 1, d: "Hard" },
            { q: "How does AWS PrivateLink differ from a VPC Peering connection?", o: ["No difference", "PrivateLink exposes a service privately without VPC overlap issues; VPC Peering connects entire VPCs with routing", "VPC Peering is more secure", "PrivateLink allows internet traffic"], c: 1, d: "Hard" },
            { q: "Your architecture uses API Gateway + Lambda + DynamoDB. How do you prevent Lambda cold starts from affecting user experience?", o: ["Use EC2 instead", "Enable Provisioned Concurrency on Lambda and implement connection pooling", "Increase API Gateway timeout only", "Use larger Lambda memory"], c: 1, d: "Hard" }
        ]
    }
};

// ─────────────────────────────────────────────────────────────
//  Map all 20 course templates to their closest question pool
// ─────────────────────────────────────────────────────────────
const templates = [
    { title: 'Full Stack Web Development Mastery', tags: ['JS', 'React', 'Node.js'], topics: ['JavaScript', 'React'], qKey: 'JavaScript' },
    { title: 'Python for Data Science', tags: ['Python', 'Data'], topics: ['Python', 'Data Science'], qKey: 'Python' },
    { title: 'Cloud Computing (AWS) Associate', tags: ['AWS', 'Cloud'], topics: ['AWS'], qKey: 'AWS' },
    { title: 'Cybersecurity Fundamentals', tags: ['Sec', 'Networking'], topics: ['Cybersecurity'], qKey: 'AWS' },
    { title: 'Machine Learning Basics', tags: ['AI', 'ML'], topics: ['ML/AI'], qKey: 'Python' },
    { title: 'DevOps: Docker & Kubernetes', tags: ['Docker', 'K8s'], topics: ['DevOps'], qKey: 'AWS' },
    { title: 'System Design Interview Prep', tags: ['Architecture', 'Scale'], topics: ['System Design'], qKey: 'JavaScript' },
    { title: 'PostgreSQL Database Administration', tags: ['SQL', 'Database'], topics: ['SQL'], qKey: 'Python' },
    { title: 'UI/UX Design Masterclass', tags: ['Design', 'Figma'], topics: ['UI/UX'], qKey: 'JavaScript' },
    { title: 'Modern CSS Frameworks (Tailwind)', tags: ['CSS', 'Tailwind'], topics: ['Tailwind'], qKey: 'JavaScript' },
    { title: 'Java Microservices with Spring', tags: ['Java', 'Spring'], topics: ['Java'], qKey: 'JavaScript' },
    { title: 'Mobile App Dev with Flutter', tags: ['Flutter', 'Mobile'], topics: ['Flutter'], qKey: 'JavaScript' },
    { title: 'Blockchain Fundamentals', tags: ['Web3', 'Crypto'], topics: ['Blockchain'], qKey: 'JavaScript' },
    { title: 'Digital Marketing Excellence', tags: ['SEO', 'Marketing'], topics: ['Marketing'], qKey: 'Python' },
    { title: 'Advanced C++ Programming', tags: ['C++', 'System'], topics: ['C++'], qKey: 'Python' },
    { title: 'Data Structures & Algorithms', tags: ['DSA', 'CS'], topics: ['DSA'], qKey: 'JavaScript' },
    { title: 'Go Lang Professional', tags: ['Go', 'Backend'], topics: ['Go'], qKey: 'JavaScript' },
    { title: 'Rust Systems Programming', tags: ['Rust', 'Systems'], topics: ['Rust'], qKey: 'Python' },
    { title: 'Project Management Professional', tags: ['PMP', 'Management'], topics: ['PMP'], qKey: 'Python' },
    { title: 'Artificial Intelligence Ethics', tags: ['AI', 'Ethics'], topics: ['AI Ethics'], qKey: 'Python' }
];

// ─────────────────────────────────────────────────────────────
//  Balanced Question Generator
//  Picks 7 Easy + 7 Medium + 6 Hard = 20 questions per test
//  Input: qKey (pool name), type ('pre' | 'post')
// ─────────────────────────────────────────────────────────────
const generateQuestionsSet = (qKey, type) => {
    const pool = (questionPool[qKey] || questionPool['JavaScript'])[type];

    const easy = pool.filter(q => q.d === 'Easy');
    const medium = pool.filter(q => q.d === 'Medium');
    const hard = pool.filter(q => q.d === 'Hard');

    // Select balanced distribution
    const selected = [
        ...easy.slice(0, 7),
        ...medium.slice(0, 7),
        ...hard.slice(0, 6)
    ];

    // Shuffle so questions are not grouped by difficulty
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    return selected.map((item, idx) => ({
        question: item.q,
        options: item.o,
        correctAnswer: item.c,
        difficulty: item.d,
        topic: qKey
    }));
};

// ─────────────────────────────────────────────────────────────
//  Tiered Learning Materials
// ─────────────────────────────────────────────────────────────
const tieredMaterials = [
    { level: 'basic', type: 'youtube', title: 'Getting Started Video', url: 'https://www.youtube.com/watch?v=rfscVS0CQDX', duration: '12:45', rating: 4.8 },
    { level: 'basic', type: 'website', title: 'Official Documentation (Basic)', url: 'https://docs.microsoft.com', duration: 'Self-paced', rating: 4.9 },
    { level: 'intermediate', type: 'pdf', title: 'Deep Dive Guide (PDF)', url: 'https://cheatsheet.com/guide.pdf', duration: '15 pages', rating: 4.7 },
    { level: 'intermediate', type: 'coursera', title: 'Intermediate Concepts', url: 'https://www.coursera.org', duration: '4 weeks', rating: 4.8 },
    { level: 'advanced', type: 'udemy', title: 'Advanced Masterclass', url: 'https://www.udemy.com', duration: '40 hours', rating: 4.9 },
    { level: 'advanced', type: 'youtube', title: 'Expert Architecture Patterns', url: 'https://youtube.com', duration: '1:30:00', rating: 5.0 }
];

// ─────────────────────────────────────────────────────────────
//  Seed Function
// ─────────────────────────────────────────────────────────────
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnmetrics');
        console.log('Connected to MongoDB...');

        await Course.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data...');

        // Seed default users
        const defaultUsers = [
            { fullName: 'Admin User', email: 'admin@admin.com', password: 'admin', role: 'admin', isNewUser: false },
            { fullName: 'Sample Learner', email: 'learner@learner.com', password: 'learner', role: 'learner', isNewUser: false }
        ];
        for (const userData of defaultUsers) {
            const user = new User(userData);
            await user.save(); // bcrypt pre-save hook hashes the password
        }
        console.log('Default users seeded...');

        // Build courses
        const courses = templates.map(tpl => {
            const preQ = generateQuestionsSet(tpl.qKey, 'pre');
            const postQ = generateQuestionsSet(tpl.qKey, 'post');

            return {
                title: tpl.title,
                description: `A comprehensive course covering ${tpl.topics.join(', ')} to take you from beginner to expert.`,
                tags: tpl.tags,
                duration: '30 hours',
                totalQuestions: 20,
                materials: tieredMaterials.map(m => ({ ...m, title: `${tpl.title} — ${m.title}` })),
                preTestQuestions: preQ,
                postTestQuestions: postQ,
                recommendations: [
                    { title: `Advanced ${tpl.title}`, provider: 'Coursera', efficiency: '95%', description: 'Take your skills further with the advanced path.', url: 'https://www.coursera.org' },
                    { title: `${tpl.title} Mastery`, provider: 'Frontend Masters', efficiency: '88%', description: 'High-level architectural patterns.', url: 'https://frontendmasters.com' },
                    { title: `${tpl.title} Projects`, provider: 'Udemy', efficiency: '82%', description: 'Build 10 real-world projects.', url: 'https://www.udemy.com' },
                    { title: `${tpl.title} Documentation`, provider: 'Official', efficiency: '99%', description: 'The absolute source of truth.', url: 'https://google.com' },
                    { title: `${tpl.title} Community`, provider: 'Discord', efficiency: '75%', description: 'Learn with peers.', url: 'https://discord.com' }
                ]
            };
        });

        await Course.insertMany(courses);

        console.log('\n✅ Database Seeded Successfully!');
        console.log(`   📚 ${courses.length} courses created`);
        console.log(`   ❓ Each course: 20 Pre-Test questions (7 Easy + 7 Medium + 6 Hard)`);
        console.log(`   ❓             20 Post-Test questions (7 Easy + 7 Medium + 6 Hard)`);
        console.log(`   🔀 Pre-Test & Post-Test questions are completely different (no overlap)`);
        console.log(`   👤 2 default users created (admin@admin.com / learner@learner.com)\n`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
