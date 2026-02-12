const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

const questionPool = {
    'JavaScript': [
        // Pre-test
        { q: "What is the output of 0 == false?", o: ["true", "false", "undefined", "null"], c: 0 },
        { q: "Which company developed JavaScript?", o: ["Netscape", "Microsoft", "Google", "Facebook"], c: 0 },
        { q: "What is the purpose of 'use strict'?", o: ["Faster execution", "Prevents global variables", "Enforces strict error handling", "Nothing"], c: 2 },
        { q: "What is a closure?", o: ["A function with access to its parent scope", "A private variable", "A loop", "An object method"], c: 0 },
        { q: "What is hoisting?", o: ["Lifting state", "Moving declarations to top", "A React hook", "CSS property"], c: 1 },
        { q: "What does Promise.all() do?", o: ["Runs first promise", "Waits for all to resolve", "Runs in serial", "None"], c: 1 },
        { q: "How to check if an object is an array?", o: ["obj.isArray()", "typeof obj == 'array'", "Array.isArray(obj)", "obj instanceof List"], c: 2 },
        { q: "What is the event loop?", o: ["A CPU feature", "Handles async callbacks", "Memory management", "DOM rendering"], c: 1 },
        { q: "What is IIFE?", o: ["Internet Interface", "Immediately Invoked Function Expression", "A loop", "None"], c: 1 },
        { q: "What is the result of typeof null?", o: ["'null'", "'object'", "'undefined'", "'value'"], c: 1 },
        { q: "What is the spread operator?", o: ["...", "&&", "||", "!!"], c: 0 },
        { q: "How to clone an object?", o: ["{...obj}", "Object.assign()", "JSON methods", "All of above"], c: 3 },
        { q: "What is prototype in JS?", o: ["A class", "Mechanism to inherit features", "A variable", "None"], c: 1 },
        { q: "What is the use of bind()?", o: ["Binds CSS", "Creates function with new 'this'", "Loop", "Memory"], c: 1 },
        { q: "What is the differnce between null and undefined?", o: ["Same", "null is assigned, undefined is not", "Opposite", "None"], c: 1 },
        { q: "What is debouncing?", o: ["Speeding up code", "Delaying function execution", "Debugging", "None"], c: 1 },
        { q: "What is throttling?", o: ["Stopping events", "Executing function once in a limit", "CSS term", "None"], c: 1 },
        { q: "What are template literals?", o: ["Backticks strings", "Quotes", "Comments", "None"], c: 0 },
        { q: "What is 'this' in a method?", o: ["Global", "The object", "The function", "None"], c: 1 },
        { q: "What is the map function?", o: ["Changes array length", "Creates new array with results", "Filters", "Sorts"], c: 1 },
        // Post-test
        { q: "What is an arrow function?", o: ["Function with =>", "Slower function", "Complex function", "Math term"], c: 0 },
        { q: "How to handle async errors?", o: ["if/else", "try/catch", "throw", "None"], c: 1 },
        { q: "What is a Generator?", o: ["Energy source", "Function that can pause", "Auto-run function", "None"], c: 1 },
        { q: "What is a Map object?", o: ["Array", "Key-value pairs", "List", "Function"], c: 1 },
        { q: "What is a Set?", o: ["Array", "Unique values", "Object", "None"], c: 1 },
        { q: "What is the result of 1 + '1'?", o: ["2", "'11'", "NaN", "Error"], c: 1 },
        { q: "What is a Pure Function?", o: ["No state", "No side effects", "Fast", "Simple"], c: 1 },
        { q: "What is Coercion?", o: ["Conversion", "Automatic type conversion", "Error", "None"], c: 1 },
        { q: "What is the use of fetch?", o: ["File", "Network requests", "DOM", "CSS"], c: 1 },
        { q: "What is localStorage?", o: ["Server storage", "Persistent client storage", "Session", "None"], c: 1 },
        { q: "What is sessionStorage?", o: ["Permanent", "Cleared when tab closes", "Server", "None"], c: 1 },
        { q: "What is the DOM?", o: ["Document Object Model", "Direct Object", "Data Object", "None"], c: 0 },
        { q: "What is event bubbling?", o: ["Down to child", "Up to parent", "Stop", "None"], c: 1 },
        { q: "What is event delegation?", o: ["Listener on parent", "Listener on child", "Delete", "None"], c: 0 },
        { q: "What is async/await?", o: ["Sugar for promises", "Sync code", "Loop", "None"], c: 0 },
        { q: "What is the use of 'debugger'?", o: ["Cleanup", "Stops execution", "Speedup", "None"], c: 1 },
        { q: "What is forEach?", o: ["Loop over array", "Filter array", "Sort array", "None"], c: 0 },
        { q: "What is reducer?", o: ["Math tool", "Accumulates values", "Splits array", "None"], c: 1 },
        { q: "What is filter?", o: ["Removes all", "Keeps items matching criteria", "Sorts", "None"], c: 1 },
        { q: "What is the result of typeof NaN?", o: ["'NaN'", "'number'", "'object'", "'undefined'"], c: 1 }
    ],
    'Python': [
        // Pre
        { q: "What is the extension of Python files?", o: [".py", ".pyt", ".python", ".txt"], c: 0 },
        { q: "How do you define a function in Python?", o: ["func", "def", "function", "lambda"], c: 1 },
        { q: "Which tool is the package manager for Python?", o: ["npm", "pip", "maven", "gem"], c: 1 },
        { q: "What is a list in Python?", o: ["Ordered collection", "Unordered set", "Constant", "Function"], c: 0 },
        { q: "How to handle errors in Python?", o: ["try/except", "try/catch", "if/err", "None"], c: 0 },
        { q: "What is a tuple?", o: ["Mutable list", "Immutable list", "Dictionary", "Set"], c: 1 },
        { q: "What is a dictionary?", o: ["List", "Key-value pairs", "Tuple", "Array"], c: 1 },
        { q: "What does len() do?", o: ["Length", "List", "Last item", "None"], c: 0 },
        { q: "What is a list comprehension?", o: ["Math expression", "Concise list creation", "Loop", "None"], c: 1 },
        { q: "Which keyword is for classes?", o: ["class", "struct", "object", "type"], c: 0 },
        { q: "What is PEP 8?", o: ["Secret", "Style guide", "Version", "Package"], c: 1 },
        { q: "What is __init__?", o: ["Constructor", "Destructor", "Method", "None"], c: 0 },
        { q: "What is self in a class?", o: ["Parent", "Current instance", "Child", "Global"], c: 1 },
        { q: "What is a decorator?", o: ["Image", "Modifies function behavior", "CSS term", "None"], c: 1 },
        { q: "What is a lambda function?", o: ["Anonymous function", "Large function", "Loop", "None"], c: 0 },
        { q: "How to import a module?", o: ["using", "import", "require", "include"], c: 1 },
        { q: "What is a virtual environment?", o: ["VR", "Isolated deps environment", "Server", "None"], c: 1 },
        { q: "What is range() used for?", o: ["List", "Generator for numbers", "Math", "None"], c: 1 },
        { q: "What is yield?", o: ["Stop", "Produces value in generator", "Return all", "None"], c: 1 },
        { q: "What is the default value of a function return?", o: ["0", "None", "False", "Error"], c: 1 },
        // Post
        { q: "What is slicing in Python?", o: ["Deleting", "Accessing sub-part of list", "Sorting", "None"], c: 1 },
        { q: "What is a set?", o: ["List", "Unique items", "Dictionary", "Tuple"], c: 1 },
        { q: "What is the differnce between list and tuple?", o: ["Mutability", "Speed", "Syntax", "All of above"], c: 3 },
        { q: "How to join strings?", o: ["concat()", "join()", "merge()", "+ only"], c: 1 },
        { q: "What is a docstring?", o: ["Comment", "Documentation string", "File", "None"], c: 1 },
        { q: "What is monkey patching?", o: ["Game", "Runtime modification", "Testing", "None"], c: 1 },
        { q: "What is GIL?", o: ["Global Interpreter Lock", "Graphic Interface", "Package", "None"], c: 0 },
        { q: "What is pickling?", o: ["Cooking", "Serialization", "Encryption", "None"], c: 1 },
        { q: "How to read a file?", o: ["read()", "open()", "fetch()", "get()"], c: 1 },
        { q: "What is a package?", o: ["Folder with __init__.py", "File", "Class", "None"], c: 0 },
        { q: "What is a name mangle?", o: ["Privacy feature", "Error", "Sorting", "None"], c: 0 },
        { q: "What is deepcopy?", o: ["Pointer", "Complete copy including children", "Shallow copy", "None"], c: 1 },
        { q: "What is recursion?", o: ["Loop", "Function calling itself", "Class", "None"], c: 1 },
        { q: "What is the map() function?", o: ["List", "Applies function to items", "Filter", "None"], c: 1 },
        { q: "What is filter()?", o: ["Removes all", "Filters items by function", "Sorts", "None"], c: 1 },
        { q: "What is any()?", o: ["True if all true", "True if any true", "False", "None"], c: 1 },
        { q: "What is all()?", o: ["True if all true", "True if any true", "False", "None"], c: 0 },
        { q: "What is f-string?", o: ["Formatted string literal", "File string", "Function string", "None"], c: 0 },
        { q: "What is a context manager?", o: ["with statement handler", "OS tool", "Server", "None"], c: 0 },
        { q: "What is multi-threading?", o: ["Single task", "Concurrent task execution", "Linear", "None"], c: 1 }
    ],
    'AWS': [
        // Pre
        { q: "What is EC2?", o: ["Storage", "Virtual Server", "Identity", "Database"], c: 1 },
        { q: "What is S3?", o: ["Compute", "Object Storage", "Network", "Key"], c: 1 },
        { q: "What is RDS?", o: ["Compute", "Relational Database", "DNS", "VPC"], c: 1 },
        { q: "What is Lambda?", o: ["Serverless function", "Virtual Server", "Storage", "CDN"], c: 0 },
        { q: "What is IAM?", o: ["Networking", "Identity and Access Management", "Database", "Log"], c: 1 },
        { q: "What is VPC?", o: ["Virtual Private Cloud", "Video Player", "Database", "DNS"], c: 0 },
        { q: "What is CloudWatch?", o: ["Reporting", "Monitoring and Alerting", "Storage", "DNS"], c: 1 },
        { q: "What is CloudFront?", o: ["Database", "Content Delivery Network (CDN)", "Compute", "Firewall"], c: 1 },
        { q: "What is Route 53?", o: ["Database", "DNS Service", "Compute", "Security"], c: 1 },
        { q: "What is DynamoDB?", o: ["SQL", "NoSQL Database", "Object Storage", "DNS"], c: 1 },
        { q: "What is an SQS?", o: ["Email", "Message Queue", "Compute", "DNS"], c: 1 },
        { q: "What is an SNS?", o: ["Notification Service", "Queue", "Server", "Database"], c: 0 },
        { q: "What is EBS?", o: ["S3 link", "Block Storage for EC2", "Database", "Networking"], c: 1 },
        { q: "What is ELB?", o: ["Identity", "Elastic Load Balancer", "DNS", "Firewall"], c: 1 },
        { q: "What is Auto Scaling?", o: ["Static usage", "Adjusting capacity automatically", "Manual change", "None"], c: 1 },
        { q: "What is Redshift?", o: ["Storage", "Data Warehouse", "Compute", "Security"], c: 1 },
        { q: "What is CloudTrail?", o: ["Monitoring", "Auditing and API Logging", "Compute", "DNS"], c: 1 },
        { q: "What is Beanstalk?", o: ["S3 tool", "PaaS for deploying apps", "Database", "DNS"], c: 1 },
        { q: "What is Shield?", o: ["DDoS Protection", "Firewall", "IAM", "VPC"], c: 0 },
        { q: "What is Glacier?", o: ["Fast storage", "Low-cost archival storage", "Compute", "Database"], c: 1 },
        // Post
        { q: "What is an Ami?", o: ["Amazon Machine Image", "Amazon Message", "Identity", "None"], c: 0 },
        { q: "What is a Security Group?", o: ["Role", "Virtual Firewall", "VPC", "None"], c: 1 },
        { q: "What is Kinesis?", o: ["Storage", "Real-time streaming", "Audit", "DNS"], c: 1 },
        { q: "What is Fargate?", o: ["Serverless for containers", "VM", "Database", "None"], c: 0 },
        { q: "What is Inspector?", o: ["Log", "Security Assessment", "Compute", "None"], c: 1 },
        { q: "What is GuardDuty?", o: ["Threat detection", "Firewall", "Storage", "None"], c: 0 },
        { q: "What is Aurora?", o: ["NoSQL", "Cloud-native SQL database", "Audit", "None"], c: 1 },
        { q: "What is Glue?", o: ["Glue for files", "ETL Service", "Identity", "None"], c: 1 },
        { q: "What is Athena?", o: ["SQL on S3", "Database", "Storage", "Log"], c: 0 },
        { q: "What is SageMaker?", o: ["ML platform", "DNS", "Compute", "None"], c: 0 },
        { q: "What is Cognito?", o: ["Storage", "Auth for apps", "DNS", "None"], c: 1 },
        { q: "What is Step Functions?", o: ["Log", "Workflow orchestration", "Compute", "None"], c: 1 },
        { q: "What is Macie?", o: ["Compute", "Data security/privacy", "Identity", "None"], c: 1 },
        { q: "What is EMR?", o: ["Identity", "Big data (Hadoop/Spark)", "Compute", "None"], c: 1 },
        { q: "What is Snowball?", o: ["Snow", "Physical data transfer", "Virtual server", "None"], c: 1 },
        { q: "What is WAF?", o: ["Web Application Firewall", "Identity", "DNS", "None"], c: 0 },
        { q: "What is PrivateLink?", o: ["Public web", "Private VPC communication", "DNS", "None"], c: 1 },
        { q: "What is Transfer Family?", o: ["Transfer SFTP/FTP", "Identity", "DNS", "None"], c: 0 },
        { q: "What is Backup?", o: ["Centralized backup service", "Copy", "Identity", "None"], c: 0 },
        { q: "What is Trusted Advisor?", o: ["Friend", "Guidance on best practices", "Audit", "None"], c: 1 }
    ]
};

// Map similar topics to these pools
const templates = [
    { title: 'Full Stack Web Development Mastery', tags: ['JS', 'React', 'Node.js'], topics: ['JavaScript', 'React'], qKey: 'JavaScript' },
    { title: 'Python for Data Science', tags: ['Python', 'Data'], topics: ['Python', 'Data Science'], qKey: 'Python' },
    { title: 'Cloud Computing (AWS) Associate', tags: ['AWS', 'Cloud'], topics: ['AWS'], qKey: 'AWS' },
    { title: 'Cybersecurity Fundamentals', tags: ['Sec', 'Networking'], topics: ['Cybersecurity'], qKey: 'AWS' }, // Fallback
    { title: 'Machine Learning Basics', tags: ['AI', 'ML'], topics: ['ML/AI'], qKey: 'Python' }, // Fallback
    { title: 'DevOps: Docker & Kubernetes', tags: ['Docker', 'K8s'], topics: ['DevOps'], qKey: 'AWS' }, // Fallback
    { title: 'System Design Interview Prep', tags: ['Architecture', 'Scale'], topics: ['System Design'], qKey: 'JavaScript' }, // Fallback
    { title: 'PostgreSQL Database Administration', tags: ['SQL', 'Database'], topics: ['SQL'], qKey: 'AWS' }, // Fallback
    { title: 'UI/UX Design Masterclass', tags: ['Design', 'Figma'], topics: ['UI/UX'], qKey: 'JavaScript' }, // Fallback
    { title: 'Modern CSS Frameworks (Tailwind)', tags: ['CSS', 'Tailwind'], topics: ['Tailwind'], qKey: 'JavaScript' }, // Fallback
    { title: 'Java Microservices with Spring', tags: ['Java', 'Spring'], topics: ['Java'], qKey: 'JavaScript' }, // Fallback
    { title: 'Mobile App Dev with Flutter', tags: ['Flutter', 'Mobile'], topics: ['Flutter'], qKey: 'JavaScript' }, // Fallback
    { title: 'Blockchain Fundamentals', tags: ['Web3', 'Crypto'], topics: ['Blockchain'], qKey: 'JavaScript' }, // Fallback
    { title: 'Digital Marketing Excellence', tags: ['SEO', 'Marketing'], topics: ['Marketing'], qKey: 'Python' }, // Fallback
    { title: 'Advanced C++ Programming', tags: ['C++', 'System'], topics: ['C++'], qKey: 'Python' }, // Fallback
    { title: 'Data Structures & Algorithms', tags: ['DSA', 'CS'], topics: ['DSA'], qKey: 'JavaScript' }, // Fallback
    { title: 'Go Lang Professional', tags: ['Go', 'Backend'], topics: ['Go'], qKey: 'JavaScript' }, // Fallback
    { title: 'Rust Systems Programming', tags: ['Rust', 'Systems'], topics: ['Rust'], qKey: 'Python' }, // Fallback
    { title: 'Project Management Professional', tags: ['PMP', 'Management'], topics: ['PMP'], qKey: 'Python' }, // Fallback
    { title: 'Artificial Intelligence Ethics', tags: ['AI', 'Ethics'], topics: ['AI Ethics'], qKey: 'Python' } // Fallback
];

const generateQuestionsSet = (qKey, type) => {
    const pool = questionPool[qKey] || questionPool['JavaScript'];
    const startIndex = type === 'pre' ? 0 : 20;
    const selection = pool.slice(startIndex, startIndex + 20);

    return selection.map(item => ({
        question: item.q,
        options: item.o,
        correctAnswer: item.c,
        difficulty: 'Medium',
        topic: qKey
    }));
};

const commonMaterials = [
    { type: 'youtube', title: 'Getting Started Video', url: 'https://www.youtube.com/watch?v=rfscVS0CQDX', duration: '12:45', rating: 4.8 },
    { type: 'website', title: 'Official Documentation', url: 'https://docs.microsoft.com', duration: 'Self-paced', rating: 4.9 },
    { type: 'pdf', title: 'Cheatsheet Guide (PDF)', url: 'https://cheatsheet.com/guide.pdf', duration: '10 pages', rating: 4.7 },
    { type: 'coursera', title: 'Foundations Course', url: 'https://www.coursera.org', duration: '6 weeks', rating: 4.9 },
    { type: 'udemy', title: 'Complete Bootcamp', url: 'https://www.udemy.com', duration: '40 hours', rating: 4.8 }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnmetrics');
        await Course.deleteMany({});
        await User.deleteMany({});

        // Seed default users
        const defaultUsers = [
            {
                fullName: 'Admin User',
                email: 'admin@admin.com',
                password: 'admin',
                role: 'admin',
                isNewUser: false
            },
            {
                fullName: 'Sample Learner',
                email: 'learner@learner.com',
                password: 'learner',
                role: 'learner',
                isNewUser: false
            }
        ];
        await User.insertMany(defaultUsers);

        const courses = templates.map(tpl => ({
            title: tpl.title,
            description: `A comprehensive course covering ${tpl.topics.join(', ')} to take you from beginner to expert.`,
            tags: tpl.tags,
            duration: '30 hours',
            totalQuestions: 20,
            materials: commonMaterials.map(m => ({ ...m, title: `${tpl.title} - ${m.title}` })),
            preTestQuestions: generateQuestionsSet(tpl.qKey, 'pre'),
            postTestQuestions: generateQuestionsSet(tpl.qKey, 'post'),
            recommendations: [
                { title: `Advanced ${tpl.title}`, provider: 'Coursera', efficiency: '95%', description: 'Take your skills further with the advanced path.', url: 'https://www.coursera.org' },
                { title: `${tpl.title} Mastery`, provider: 'Frontend Masters', efficiency: '88%', description: 'High-level architectural patterns.', url: 'https://frontendmasters.com' },
                { title: `${tpl.title} Projects`, provider: 'Udemy', efficiency: '82%', description: 'Build 10 real-world projects.', url: 'https://www.udemy.com' },
                { title: `${tpl.title} Documentation`, provider: 'Official', efficiency: '99%', description: 'The absolute source of truth.', url: 'https://google.com' },
                { title: `${tpl.title} Community`, provider: 'Discord', efficiency: '75%', description: 'Learn with peers.', url: 'https://discord.com' }
            ]
        }));

        await Course.insertMany(courses);
        console.log('Database Seeded with 20 courses, 20 REAL-WORLD questions per test, and 5+ materials each.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
