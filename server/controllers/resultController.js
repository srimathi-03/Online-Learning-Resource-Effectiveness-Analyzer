const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
//  Curated learning resources per topic
// ─────────────────────────────────────────────────────────────
const TOPIC_RESOURCES = {
    'JavaScript': [
        { title: 'JavaScript.info – The Modern JavaScript Tutorial', type: 'website', description: 'The most comprehensive and up-to-date JS guide — from basics to advanced patterns.', url: 'https://javascript.info', provider: 'javascript.info' },
        { title: 'Traversy Media – JS Crash Course', type: 'youtube', description: 'A 90-minute beginner-friendly crash course covering all JS fundamentals with live coding.', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', provider: 'YouTube' },
        { title: 'freeCodeCamp – JavaScript Algorithms & Data Structures', type: 'platform', description: '300+ hours of free interactive JavaScript exercises from absolute basics to ES6+.', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', provider: 'freeCodeCamp' },
        { title: 'MDN Web Docs – JavaScript Reference', type: 'website', description: 'The official browser-vendor reference for every JS built-in — authoritative and always accurate.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', provider: 'MDN' }
    ],
    'Python': [
        { title: 'Python Official Tutorial', type: 'website', description: 'The authoritative beginner tutorial written by the Python core team. Start here.', url: 'https://docs.python.org/3/tutorial/', provider: 'python.org' },
        { title: 'Corey Schafer – Python Tutorials Playlist', type: 'youtube', description: 'The highest-rated Python tutorial series on YouTube. Covers OOP, decorators, generators, and more.', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU', provider: 'YouTube' },
        { title: 'CS50P – Introduction to Programming with Python (Harvard)', type: 'platform', description: "Harvard's free Python course on edX. Excellent for building solid Python foundations.", url: 'https://cs50.harvard.edu/python/', provider: 'Harvard / edX' },
        { title: 'Real Python – Python Tutorials', type: 'website', description: 'Clear, practical Python tutorials with in-depth articles for every skill level.', url: 'https://realpython.com', provider: 'realpython.com' }
    ],
    'AWS': [
        { title: 'AWS Cloud Practitioner Essentials (Free Official Course)', type: 'platform', description: "AWS's own free foundational course. Covers core services, pricing, security, and architecture.", url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', provider: 'AWS Training' },
        { title: 'FreeCodeCamp – AWS Certified Cloud Practitioner Course', type: 'youtube', description: '13-hour structured AWS course on YouTube — perfect for learning AWS fundamentals.', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc', provider: 'YouTube' },
        { title: 'AWS Documentation – Getting Started', type: 'website', description: 'Official AWS docs. Start with the Getting Started guides for each service you need.', url: 'https://docs.aws.amazon.com/getting-started/', provider: 'AWS Docs' },
        { title: 'Stephane Maarek – Ultimate AWS Developer (Udemy)', type: 'platform', description: 'The #1 rated AWS course on Udemy with hands-on labs. Best for getting certified.', url: 'https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/', provider: 'Udemy' }
    ],
    'React': [
        { title: 'React Official Docs (react.dev)', type: 'website', description: 'The brand-new interactive React docs with live sandboxes for every concept.', url: 'https://react.dev', provider: 'React.dev' },
        { title: 'Scrimba – The React Bootcamp', type: 'platform', description: 'Free interactive React course. You write code in the browser alongside the instructor.', url: 'https://scrimba.com/learn/learnreact', provider: 'Scrimba' },
        { title: 'Traversy Media – React Crash Course', type: 'youtube', description: 'Up-to-date React crash course using functional components, hooks, and modern patterns.', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', provider: 'YouTube' },
        { title: "Egghead.io – Beginner's Guide to React", type: 'platform', description: "Kent C. Dodds's free guide covering components, props, state, and hooks.", url: 'https://egghead.io/courses/the-beginner-s-guide-to-react', provider: 'Egghead.io' }
    ],
    'Data Science': [
        { title: 'Kaggle – Free Data Science Courses', type: 'platform', description: 'Bite-sized, hands-on courses on pandas, visualization, ML, and SQL — all free.', url: 'https://www.kaggle.com/learn', provider: 'Kaggle' },
        { title: 'StatQuest with Josh Starmer', type: 'youtube', description: 'Explains statistics and data science concepts clearly with memorable visuals.', url: 'https://www.youtube.com/@statquest', provider: 'YouTube' },
        { title: 'IBM Data Science Professional Certificate (Coursera)', type: 'platform', description: 'A 10-course certificate covering data science end-to-end. Highly employable.', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', provider: 'Coursera' },
        { title: 'Towards Data Science', type: 'website', description: 'Thousands of practical articles and tutorials on every data science topic.', url: 'https://towardsdatascience.com', provider: 'Medium / TDS' }
    ],
    'ML/AI': [
        { title: 'Google Machine Learning Crash Course', type: 'platform', description: "Google's free, practical ML course. Covers key concepts with TensorFlow examples.", url: 'https://developers.google.com/machine-learning/crash-course', provider: 'Google' },
        { title: 'Andrej Karpathy – Neural Networks: Zero to Hero', type: 'youtube', description: 'Deep, from-scratch neural network series by an ex-Tesla/OpenAI director. Legendary quality.', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', provider: 'YouTube' },
        { title: 'fast.ai – Practical Deep Learning for Coders', type: 'platform', description: 'Top-down approach to ML. You train real models on lesson 1. Free and wildly effective.', url: 'https://course.fast.ai', provider: 'fast.ai' },
        { title: 'ML Specialization – Andrew Ng (Coursera)', type: 'platform', description: "Andrew Ng's updated ML specialization. The most trusted ML fundamentals course.", url: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera' }
    ],
    'DevOps': [
        { title: 'TechWorld with Nana – DevOps Bootcamp', type: 'youtube', description: 'The most-watched DevOps YouTube channel. Clear tutorials on Docker, K8s, CI/CD, Terraform.', url: 'https://www.youtube.com/@TechWorldwithNana', provider: 'YouTube' },
        { title: 'KodeKloud – DevOps Learning Path', type: 'platform', description: 'Hands-on labs for Docker, Kubernetes, Ansible, and more. Browser-based sandbox.', url: 'https://kodekloud.com', provider: 'KodeKloud' },
        { title: 'Docker Official Get Started Guide', type: 'website', description: 'Official Docker tutorial. Understand containers, images, volumes, and networking from scratch.', url: 'https://docs.docker.com/get-started/', provider: 'Docker Docs' },
        { title: 'freeCodeCamp – DevOps Engineering Course', type: 'youtube', description: 'Full free DevOps course covering Linux, Bash, Docker, K8s, and CI/CD pipelines.', url: 'https://www.youtube.com/watch?v=j5Zsa_eOXeY', provider: 'YouTube' }
    ],
    'Cybersecurity': [
        { title: 'TryHackMe – Learning Paths', type: 'platform', description: 'Hands-on cybersecurity training in a gamified environment. Great for absolute beginners.', url: 'https://tryhackme.com/paths', provider: 'TryHackMe' },
        { title: 'Professor Messer – CompTIA Security+ Course', type: 'youtube', description: 'Free, thorough Security+ course on YouTube. Best free resource for security fundamentals.', url: 'https://www.youtube.com/@professormesser', provider: 'YouTube' },
        { title: 'OWASP Top 10 – Web Application Security Risks', type: 'website', description: 'Learn the 10 most critical web security vulnerabilities every developer must know.', url: 'https://owasp.org/www-project-top-ten/', provider: 'OWASP' },
        { title: 'Cybersecurity Specialization – U of Maryland (Coursera)', type: 'platform', description: 'Academic deep-dive into usable security, software security, and cryptography.', url: 'https://www.coursera.org/specializations/cybersecurity', provider: 'Coursera' }
    ],
    'System Design': [
        { title: 'System Design Primer (GitHub)', type: 'website', description: 'The most starred system design resource on GitHub. Scalability, caching, databases, and more.', url: 'https://github.com/donnemartin/system-design-primer', provider: 'GitHub' },
        { title: 'Gaurav Sen – System Design Playlist', type: 'youtube', description: 'Highly visual explanations of real-world system design problems asked in tech interviews.', url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', provider: 'YouTube' },
        { title: 'ByteByteGo – System Design Newsletter', type: 'website', description: "Alex Xu's visual system design newsletter explaining high-scale architectures.", url: 'https://blog.bytebytego.com', provider: 'ByteByteGo' },
        { title: 'Grokking the System Design Interview (Educative)', type: 'platform', description: 'Industry-standard system design course used by engineers at top tech companies.', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', provider: 'Educative' }
    ],
    'SQL': [
        { title: 'SQLZoo – Interactive SQL Tutorial', type: 'platform', description: 'Run SQL directly in the browser. Great for beginners who want to learn by doing.', url: 'https://sqlzoo.net', provider: 'SQLZoo' },
        { title: 'Mode Analytics – SQL Tutorial', type: 'website', description: 'Practical SQL tutorial focused on data analysis. Covers window functions, CTEs, and more.', url: 'https://mode.com/sql-tutorial/', provider: 'Mode Analytics' },
        { title: 'freeCodeCamp – SQL Full Course for Beginners', type: 'youtube', description: '4-hour beginner SQL course covering SELECT, JOINs, GROUP BY, subqueries, and more.', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', provider: 'YouTube' },
        { title: 'PostgreSQL Official Tutorial', type: 'website', description: 'Authoritative reference for PostgreSQL. Use the tutorial section for structured introduction.', url: 'https://www.postgresql.org/docs/current/tutorial.html', provider: 'PostgreSQL.org' }
    ],
    'DSA': [
        { title: 'Neetcode.io – DSA Roadmap & Video Solutions', type: 'platform', description: 'Structured DSA roadmap with video walkthroughs for common problems. Best free DSA resource.', url: 'https://neetcode.io', provider: 'NeetCode' },
        { title: 'Abdul Bari – Algorithms Playlist', type: 'youtube', description: 'In-depth teaching of algorithms with visual animations. Covers sorting, trees, graphs and more.', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O', provider: 'YouTube' },
        { title: 'VisuAlgo – Data Structure Visualization', type: 'website', description: 'Animate data structures and algorithms step-by-step to build true intuition.', url: 'https://visualgo.net', provider: 'VisuAlgo' },
        { title: "CS50x – Harvard's Intro to Computer Science", type: 'platform', description: "Harvard's legendary intro CS course. Best way to build strong CS fundamentals from scratch.", url: 'https://cs50.harvard.edu/x/', provider: 'Harvard / edX' }
    ]
};

// Fallback resources for topics not in the library
const FALLBACK_RESOURCES = [
    { title: 'Khan Academy – Computer Science', type: 'platform', description: 'Free, beginner-friendly lessons on programming and computer science concepts.', url: 'https://www.khanacademy.org/computing/computer-science', provider: 'Khan Academy' },
    { title: 'freeCodeCamp YouTube Channel', type: 'youtube', description: 'Thousands of free, full-length programming courses covering nearly every tech topic.', url: 'https://www.youtube.com/@freecodecamp', provider: 'YouTube' },
    { title: 'Coursera – Free Online Courses', type: 'platform', description: 'Browse thousands of courses from top universities. Audit for free.', url: 'https://www.coursera.org/courses?query=free', provider: 'Coursera' },
    { title: 'MIT OpenCourseWare – CS Courses', type: 'platform', description: 'Free MIT course materials. Rigorous academic content for any CS topic.', url: 'https://ocw.mit.edu/search/?d=Electrical+Engineering+and+Computer+Science', provider: 'MIT OCW' }
];

exports.updateProgress = async (req, res) => {
    try {
        const { userId, courseId, preTestScore, postTestScore, status } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const progressIndex = user.progress.findIndex(p => p.courseId === courseId);

        if (progressIndex > -1) {
            const currentProgress = user.progress[progressIndex];

            if (preTestScore !== undefined) {
                currentProgress.preTestScore = preTestScore;

                // Dynamic Difficulty Logic
                console.log(`[DEBUG] Update Progress - Score: ${preTestScore}`);
                if (preTestScore >= 80) {
                    currentProgress.allowedContentLevel = 'advanced';
                    currentProgress.preTestPassed = true;
                } else if (preTestScore >= 50) {
                    currentProgress.allowedContentLevel = 'intermediate';
                    currentProgress.preTestPassed = true;
                } else {
                    currentProgress.allowedContentLevel = 'basic';
                    currentProgress.preTestPassed = false;
                }
                console.log(`[DEBUG] Updated Level: ${currentProgress.allowedContentLevel}`);

                currentProgress.status = 'In Progress';
            }

            if (postTestScore !== undefined) currentProgress.postTestScore = postTestScore;
            if (req.body.topicScores) currentProgress.topicScores = req.body.topicScores;
            if (status) currentProgress.status = status;
            currentProgress.lastAccessed = Date.now();
        } else {
            let allowedContentLevel = 'basic';
            let preTestPassed = false;

            if (preTestScore !== undefined) {
                console.log(`[DEBUG] New Progress - Score: ${preTestScore}`);
                if (preTestScore >= 80) {
                    allowedContentLevel = 'advanced';
                    preTestPassed = true;
                } else if (preTestScore >= 50) {
                    allowedContentLevel = 'intermediate';
                    preTestPassed = true;
                }
                console.log(`[DEBUG] Assigned Level: ${allowedContentLevel}`);
            }

            user.progress.push({
                courseId,
                status: status || 'In Progress',
                preTestScore,
                postTestScore,
                allowedContentLevel,
                preTestPassed,
                topicScores: req.body.topicScores || {}
            });
        }

        user.isNewUser = false;
        await user.save();
        res.json({ message: 'Progress updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.progress);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
exports.getAllUsersProgress = async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email role progress');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getPreTestRecommendations = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const courseProgress = user.progress.find(p => p.courseId === courseId);
        if (!courseProgress) {
            return res.status(404).json({ message: 'No progress found for this course' });
        }

        const topicScores = courseProgress.topicScores || {};
        const preTestScore = courseProgress.preTestScore || 0;

        const weakTopics = [];
        const strongTopics = [];

        if (topicScores && typeof topicScores === 'object') {
            const entries = topicScores instanceof Map
                ? Array.from(topicScores.entries())
                : Object.entries(topicScores);

            entries.forEach(([topic, scores]) => {
                const preScore = scores && typeof scores === 'object' ? (scores.pre ?? scores) : scores;
                const numericScore = Number(preScore) || 0;

                if (numericScore < 50) {
                    weakTopics.push({
                        topic,
                        score: numericScore,
                        resources: TOPIC_RESOURCES[topic] || FALLBACK_RESOURCES
                    });
                } else {
                    strongTopics.push({ topic, score: numericScore });
                }
            });
        }

        // If no topic scores found yet but score is low, provide fallback resources
        if (weakTopics.length === 0 && strongTopics.length === 0 && preTestScore < 50) {
            weakTopics.push({
                topic: 'General Programming',
                score: preTestScore,
                resources: FALLBACK_RESOURCES
            });
        }

        res.json({
            preTestScore,
            allowedContentLevel: courseProgress.allowedContentLevel,
            weakTopics,
            strongTopics,
            hasWeakTopics: weakTopics.length > 0
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getSystemAnalytics = async (req, res) => {
    try {
        const users = await User.find({}, 'progress role');

        // 1. Total Learners (Users with role 'learner' or who have progress)
        // We'll count anyone with >0 progress records as an 'active learner' for this metric
        // OR just count all users with role 'learner'. Let's do active learners for "Overview".
        const allProgress = users.flatMap(u => u.progress);
        const uniqueLearners = new Set(allProgress.map(p => p.courseId.toString())).size; // This counts courses started, not users. 
        // comprehensive logic:
        const totalLearners = users.filter(u => u.role === 'learner').length;

        // 2. Total Tests Taken (Pre + Post)
        let totalTests = 0;
        let totalImprovement = 0;
        let improvementCount = 0;

        allProgress.forEach(p => {
            if (p.preTestScore !== undefined) totalTests++;
            if (p.postTestScore !== undefined) {
                totalTests++;

                // 3. Average Improvement
                if (p.preTestScore !== undefined) {
                    const diff = p.postTestScore - p.preTestScore;
                    if (diff > 0) { // Only count positive improvement for the "Avg Improvement" stat? 
                        // Usually avg improvement includes negative, but dashboard implies "Improvement". 
                        // Let's keep it simple: Post - Pre.
                        totalImprovement += diff;
                        improvementCount++;
                    }
                }
            }
        });

        const avgImprovement = improvementCount > 0 ? Math.round((totalImprovement / improvementCount) * 100) / 100 : 0;

        // 4. Resources (This needs Course model, but we can do it in a separate call or aggregate here if we import Course)
        // For now, AdminDashboard fetches courses separately to count resources, so we just return user-based stats here.

        res.json({
            totalLearners,
            totalTests,
            avgImprovement
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  Adaptive Test (IRT-based CAT) Endpoints
// ─────────────────────────────────────────────────────────────

/**
 * POST /results/adaptive/next-question
 * Body: { questions: [...], answeredIds: [...], abilityEstimate: number }
 * Returns the single best-fit next question based on current ability θ.
 * Difficulty levels: Easy=1, Medium=2, Hard=3
 * Target difficulty is derived from θ: θ<-0.5 → Easy, θ>0.5 → Hard, else Medium
 */
exports.getAdaptiveNextQuestion = async (req, res) => {
    try {
        const { questions, answeredIds = [], abilityEstimate = 0 } = req.body;
        if (!questions || questions.length === 0) {
            return res.status(400).json({ message: 'No questions provided' });
        }

        // Filter out already-answered questions
        const remaining = questions.filter(q => !answeredIds.includes(String(q._id)));
        if (remaining.length === 0) {
            return res.json({ done: true });
        }

        // Determine target difficulty from ability estimate
        const difficultyMap = { 'easy': 1, 'medium': 2, 'hard': 3 };
        let targetDiff;
        if (abilityEstimate < -0.5) targetDiff = 1;       // Easy
        else if (abilityEstimate > 0.5) targetDiff = 3;   // Hard
        else targetDiff = 2;                               // Medium

        // Score each remaining question by closeness to target difficulty
        const scored = remaining.map(q => {
            const qDiff = difficultyMap[(q.difficulty || 'medium').toLowerCase()] || 2;
            return { q, distance: Math.abs(qDiff - targetDiff), qDiff };
        });

        // Sort by closeness, then shuffle ties for variety
        scored.sort((a, b) => {
            if (a.distance !== b.distance) return a.distance - b.distance;
            return Math.random() - 0.5;
        });

        const nextQuestion = scored[0].q;
        res.json({ question: nextQuestion, done: false });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * POST /results/adaptive/save
 * Body: { userId, courseId, finalScore, abilityEstimate, topicScores }
 * Saves adaptive test result into the user's progress (same fields as regular pre-test).
 */
exports.saveAdaptiveTestResult = async (req, res) => {
    try {
        const { userId, courseId, finalScore, abilityEstimate, topicScores } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const progressIndex = user.progress.findIndex(p => p.courseId === courseId);

        let allowedContentLevel = 'basic';
        let preTestPassed = false;
        if (finalScore >= 80) { allowedContentLevel = 'advanced'; preTestPassed = true; }
        else if (finalScore >= 50) { allowedContentLevel = 'intermediate'; preTestPassed = true; }

        if (progressIndex > -1) {
            const p = user.progress[progressIndex];
            p.preTestScore = finalScore;
            p.allowedContentLevel = allowedContentLevel;
            p.preTestPassed = preTestPassed;
            p.adaptiveAbility = abilityEstimate;
            if (topicScores) p.topicScores = topicScores;
            p.status = 'In Progress';
            p.lastAccessed = Date.now();
        } else {
            user.progress.push({
                courseId,
                status: 'In Progress',
                preTestScore: finalScore,
                allowedContentLevel,
                preTestPassed,
                adaptiveAbility: abilityEstimate,
                topicScores: topicScores || {}
            });
        }

        user.isNewUser = false;
        await user.save();
        res.json({ message: 'Adaptive test result saved', allowedContentLevel, preTestPassed });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
