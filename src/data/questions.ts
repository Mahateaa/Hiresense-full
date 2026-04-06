export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}
export interface QuizCategory {
  id: string;
  title: string;
  duration: number; // in seconds
  questions: Question[];
}
export const quizData: Record<string, QuizCategory> = {
  aptitude: {
    id: "aptitude",
    title: "Aptitude Test",
    duration: 30 * 60, // 30 minutes
    questions: [
      {
        id: 1,
        question: "If a train travels 360 km in 4 hours, what is its speed in km/h?",
        options: ["80 km/h", "90 km/h", "85 km/h", "95 km/h"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is 25% of 480?",
        options: ["100", "120", "140", "110"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "If 5 workers can complete a job in 12 days, how many days will 10 workers take?",
        options: ["24 days", "6 days", "8 days", "10 days"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "A shopkeeper sells an item for $240, making a 20% profit. What was the cost price?",
        options: ["$180", "$200", "$220", "$190"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "38"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "The ratio of boys to girls in a class is 3:2. If there are 30 students, how many are girls?",
        options: ["10", "12", "15", "18"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "A car depreciates by 15% each year. If it's worth $20,000 now, what was its value last year?",
        options: ["$23,529", "$22,000", "$21,500", "$24,000"],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "If the average of 5 numbers is 27, and one number is removed making the average 25, what was the removed number?",
        options: ["35", "32", "37", "30"],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "A pipe can fill a tank in 6 hours. Another pipe can empty it in 8 hours. How long to fill if both are open?",
        options: ["24 hours", "20 hours", "18 hours", "12 hours"],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "What is the compound interest on $1000 at 10% for 2 years?",
        options: ["$200", "$210", "$220", "$190"],
        correctAnswer: 1,
      },
    ],
  },
  reasoning: {
    id: "reasoning",
    title: "Logical Reasoning",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "All roses are flowers. Some flowers fade quickly. Therefore:",
        options: [
          "All roses fade quickly",
          "Some roses fade quickly",
          "No roses fade quickly",
          "Some roses may or may not fade quickly",
        ],
        correctAnswer: 3,
      },
      {
        id: 2,
        question: "Book is to Reading as Fork is to:",
        options: ["Drawing", "Writing", "Eating", "Stirring"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "If APPLE is coded as ELPPA, how is ORANGE coded?",
        options: ["EGNARO", "ORANGE", "EGRANO", "OEGNRA"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64",
        options: ["37", "50", "64", "26"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "If A > B, B > C, and C > D, which of the following is definitely true?",
        options: ["D > A", "A > D", "B > D", "Both B and C"],
        correctAnswer: 3,
      },
      {
        id: 6,
        question: "Complete the series: AZ, BY, CX, DW, ?",
        options: ["EV", "EU", "FV", "EW"],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: "If 'MACHINE' is coded as '19-1-3-8-9-14-5', how is 'PRINTER' coded?",
        options: ["16-18-9-14-20-5-18", "16-17-9-14-20-5-18", "15-18-9-14-20-5-18", "16-18-9-13-20-5-18"],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "Which figure completes the pattern? □ ○ △ □ ○ △ □ ○ ?",
        options: ["□", "○", "△", "◇"],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Mother", "Sister", "Aunt", "Grandmother"],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "If in a certain code, SISTER is written as RHRSDQ, how is BROTHER written?",
        options: ["AQNSGDQ", "ASNTGDS", "AQNSFDQ", "AQNSGDS"],
        correctAnswer: 0,
      },
    ],
  },
  technical: {
    id: "technical",
    title: "Technical Assessment",
    duration: 45 * 60, // 45 minutes
    questions: [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "Sequential Query Language",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["Boolean", "Float", "String", "Undefined"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is the purpose of the 'virtual' keyword in C++?",
        options: [
          "To create abstract classes",
          "To enable runtime polymorphism",
          "To allocate dynamic memory",
          "To define constants",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "What is the main purpose of an API?",
        options: [
          "To store data",
          "To enable communication between software systems",
          "To design user interfaces",
          "To compile code",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "In React, what hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What is the purpose of normalization in databases?",
        options: [
          "To increase data redundancy",
          "To reduce data redundancy and improve integrity",
          "To speed up queries",
          "To encrypt data",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Which HTTP method is typically used to update an existing resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 2,
      },
      {
        id: 11,
        question: "What is a closure in JavaScript?",
        options: [
          "A function that closes the browser",
          "A function with access to its outer scope's variables",
          "A way to close database connections",
          "An error handling mechanism",
        ],
        correctAnswer: 1,
      },
      {
        id: 12,
        question: "What does REST stand for in web development?",
        options: [
          "Representational State Transfer",
          "Remote Execution Service Technology",
          "Reliable Server Transfer",
          "Resource State Transition",
        ],
        correctAnswer: 0,
      },
      {
        id: 13,
        question: "Which of these is a NoSQL database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        correctAnswer: 2,
      },
      {
        id: 14,
        question: "What is the purpose of Git branching?",
        options: [
          "To delete code",
          "To work on features independently",
          "To compress files",
          "To encrypt repositories",
        ],
        correctAnswer: 1,
      },
      {
        id: 15,
        question: "What is Big O notation used for?",
        options: [
          "Describing code syntax",
          "Measuring algorithm efficiency",
          "Defining variable types",
          "Creating loops",
        ],
        correctAnswer: 1,
      },
    ],
  },
    Frontend: {
    id: "Frontend",
    title: "Frontend Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Which HTML tag is used to define the main content of a webpage?",
        options: ["<section>", "<main>", "<content>", "<body-main>"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which CSS property is used to create flexible layouts?",
        options: ["float", "grid-template", "flexbox", "position"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What will be the output of: console.log(typeof null)?",
        options: ["null", "object", "undefined", "number"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is the purpose of React Hooks?",
        options: [
          "To style components",
          "To manage state and lifecycle in functional components",
          "To connect databases",
          "To compile JSX",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is the main advantage of TypeScript over JavaScript?",
        options: [
          "Faster execution",
          "Built-in database support",
          "Static type checking",
          "Automatic UI design",
        ],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "Which component is used to define navigation routes in React Router?",
        options: ["<Route>", "<RouterLink>", "<NavigateTo>", "<SwitchPage>"],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: "What is Redux primarily used for?",
        options: [
          "Styling applications",
          "Managing global application state",
          "Backend API creation",
          "Database storage",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "Which HTTP method is typically used to update existing data?",
        options: ["GET", "POST", "PUT", "FETCH"],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: "Which Git command uploads local commits to a remote repository?",
        options: ["git pull", "git push", "git clone", "git init"],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "A teammate’s code is breaking the UI before deployment. What is the BEST first action?",
        options: [
          "Ignore and deploy anyway",
          "Rewrite the entire project",
          "Communicate with the teammate and debug collaboratively",
          "Remove their code without informing them",
        ],
        correctAnswer: 2,
      },
    ],
  },
    "UI/UX Design": {
    id: "UI/UX Design",
    title: "UI/UX Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "What is the main advantage of using Figma for UI/UX design?",
        options: [
          "Works only offline",
          "Real-time collaboration with team members",
          "Only used for coding websites",
          "Limited to image editing",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Canva is primarily used for:",
        options: [
          "Backend development",
          "Database design",
          "Quick graphic and visual content creation",
          "Writing HTML code",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Which task is Adobe Photoshop BEST suited for?",
        options: [
          "Vector logo creation",
          "Raster image editing and photo manipulation",
          "Writing CSS styles",
          "Creating APIs",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Illustrator is mainly used for designing:",
        options: [
          "Pixel-based images",
          "Databases",
          "Vector graphics and logos",
          "Web servers",
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Why should a UI/UX designer understand basic HTML?",
        options: [
          "To manage servers",
          "To better communicate with developers and understand layout structure",
          "To create databases",
          "To run backend logic",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Which CSS property controls spacing inside an element?",
        options: ["margin", "padding", "border", "spacing"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "What is the main purpose of a prototype in UI/UX design?",
        options: [
          "Final deployment",
          "Testing user interactions before development",
          "Writing backend code",
          "Database optimization",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "Wireframes are typically created to:",
        options: [
          "Add final colors and animations",
          "Define layout and structure of a page",
          "Optimize performance",
          "Publish the website",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "A design system mainly helps teams to:",
        options: [
          "Increase coding complexity",
          "Maintain consistent design across products",
          "Replace developers",
          "Store user data",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Which principle focuses on making products easy and intuitive to use?",
        options: ["Complexity", "Usability", "Decoration", "Animation"],
        correctAnswer: 1,
      },
    ],
  },
    "Full Stack Engineer": {
    id: "Full Stack Engineer",
    title: "Full Stack Assesment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
        options: ["var", "let", "define", "constvar"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does TypeScript compile into?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Node.js is primarily used for:",
        options: [
          "Styling web pages",
          "Server-side JavaScript execution",
          "Database storage only",
          "Mobile app design",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is Express.js mainly used for?",
        options: [
          "Frontend animations",
          "Building backend APIs and web servers",
          "Database management",
          "Image editing",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What feature allows React to efficiently update the UI?",
        options: ["DOM Parser", "Virtual DOM", "CSS Engine", "JSX Compiler"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Which HTTP method is commonly used to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Which of the following is a NoSQL database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "SQL Server"],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "Which Git command creates a new branch?",
        options: ["git init", "git branch", "git merge", "git clone"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What is Docker mainly used for?",
        options: [
          "Designing UI",
          "Containerizing applications for consistent environments",
          "Writing APIs",
          "Managing databases",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Which tool is commonly used to test REST APIs during development?",
        options: ["Photoshop", "Postman", "Illustrator", "Excel"],
        correctAnswer: 1,
      },
    ],
  },
    "Backend Developer": {
    id: "Backend Developer",
    title: "Backend Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Node.js is built on which JavaScript engine?",
        options: ["SpiderMonkey", "V8 Engine", "Chakra", "Rhino"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which method in Express is commonly used to handle GET requests?",
        options: ["app.post()", "app.fetch()", "app.get()", "app.request()"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "In REST architecture, which status code indicates a successful request?",
        options: ["404", "500", "200", "301"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Which keyword is used to sort query results in SQL?",
        options: ["FILTER BY", "SORT", "ORDER BY", "GROUP SORT"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "Redis is primarily used as a:",
        options: [
          "Frontend framework",
          "Cache and in-memory data store",
          "Programming language",
          "Web server",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "What problem does Docker mainly solve?",
        options: [
          "UI design issues",
          "Environment inconsistency across systems",
          "Database normalization",
          "Code compilation errors",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "Which Linux command lists files in a directory?",
        options: ["show", "list", "ls", "dirfiles"],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: "Nginx is commonly used as a:",
        options: [
          "Programming language",
          "Reverse proxy and web server",
          "Database system",
          "Testing framework",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Swagger is mainly used for:",
        options: [
          "Writing frontend styles",
          "API documentation and testing",
          "Database migration",
          "Image editing",
        ],
        correctAnswer: 1,
      },
    ],
  },
    "Data Analyst": {
    id: "Data Analyst",
    title: "Data Analyst Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Which SQL statement is used to retrieve data from a table?",
        options: ["GET", "SELECT", "FETCH", "EXTRACT"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "In Excel, which function is used to calculate the average of values?",
        options: ["SUM()", "COUNT()", "AVG()", "AVERAGE()"],
        correctAnswer: 3,
      },
      {
        id: 3,
        question: "Google Sheets is primarily used for:",
        options: [
          "Backend development",
          "Spreadsheet-based data analysis",
          "Graphic design",
          "Server management",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Power BI is mainly used for:",
        options: [
          "Writing Python scripts",
          "Data visualization and dashboards",
          "Database creation",
          "Web development",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which tool is widely used for interactive dashboards and business intelligence?",
        options: ["Tableau", "Photoshop", "Docker", "Git"],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "Which Python library is mainly used for data manipulation and analysis?",
        options: ["NumPy", "Pandas", "TensorFlow", "Flask"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Matplotlib is commonly used for:",
        options: [
          "Database management",
          "Creating data visualizations and charts",
          "API testing",
          "Machine deployment",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "Which chart is BEST suited to show trends over time?",
        options: ["Pie chart", "Line chart", "Scatter plot", "Histogram"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "Mean, median, and mode are measures of:",
        options: [
          "Dispersion",
          "Central tendency",
          "Probability",
          "Correlation",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "What is the main purpose of data visualization?",
        options: [
          "Increase data size",
          "Make data easier to understand through visuals",
          "Store databases",
          "Encrypt information",
        ],
        correctAnswer: 1,
      },
    ],
  },
    "Business Analyst": {
    id: "Business Analyst",
    title: "Business Analyst Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Which tool is commonly used for data analysis using spreadsheets?",
        options: ["Excel", "Photoshop", "Docker", "Node.js"],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Google Sheets is mainly used for:",
        options: [
          "Backend development",
          "Spreadsheet collaboration and analysis",
          "UI design",
          "Server deployment",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Power BI is primarily used for:",
        options: [
          "Writing APIs",
          "Data visualization and reporting",
          "Database hosting",
          "Graphic editing",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Tableau helps business analysts to:",
        options: [
          "Develop mobile apps",
          "Create interactive dashboards",
          "Manage servers",
          "Write backend logic",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which SQL command retrieves specific data from a database?",
        options: ["INSERT", "DELETE", "SELECT", "UPDATE"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "Requirements gathering mainly involves:",
        options: [
          "Writing code",
          "Understanding stakeholder needs",
          "Designing logos",
          "Managing servers",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "What is the main purpose of business documentation?",
        options: [
          "Increase project cost",
          "Record requirements and processes clearly",
          "Replace developers",
          "Store images",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "Jira is commonly used for:",
        options: [
          "Photo editing",
          "Project and issue tracking",
          "Database creation",
          "Server monitoring",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "Notion is mainly used for:",
        options: [
          "Code compilation",
          "Documentation and team collaboration",
          "API deployment",
          "Database indexing",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "A Business Analyst primarily acts as a bridge between:",
        options: [
          "Servers and databases",
          "Developers and stakeholders",
          "Designers and animations",
          "Hardware and software",
        ],
        correctAnswer: 1,
      },
    ],
  },
    "QA / Software Tester": {
    id: "QA / Software Tester",
    title: "QA / Software Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "What is the main goal of unit testing?",
        options: [
          "Test the entire system",
          "Test individual components or functions",
          "Deploy applications",
          "Design UI layouts",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Jest is primarily used for:",
        options: [
          "Database management",
          "JavaScript unit testing",
          "UI design",
          "Server deployment",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Cypress is mainly used for:",
        options: [
          "Backend development",
          "End-to-end web application testing",
          "Database optimization",
          "Graphic design",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Playwright is commonly used to:",
        options: [
          "Create APIs",
          "Automate browser testing across multiple browsers",
          "Manage databases",
          "Write CSS styles",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Jira is widely used in QA teams for:",
        options: [
          "Photo editing",
          "Bug tracking and project management",
          "Writing backend code",
          "Database hosting",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Bug tracking mainly helps teams to:",
        options: [
          "Increase bugs",
          "Monitor and manage reported issues",
          "Design interfaces",
          "Deploy servers",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Postman is primarily used for:",
        options: [
          "API testing",
          "UI animation",
          "Database design",
          "Image editing",
        ],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "Swagger is mainly used for:",
        options: [
          "API documentation and testing",
          "Frontend styling",
          "Operating systems",
          "Version control",
        ],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "Git is mainly used for:",
        options: [
          "Version control",
          "Testing automation",
          "Database querying",
          "UI prototyping",
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "Which testing type verifies that new changes do not break existing features?",
        options: [
          "Regression testing",
          "Load testing",
          "Smoke testing",
          "Usability testing",
        ],
        correctAnswer: 0,
      },
    ],
  },
    "ML Engineer": {
    id: "ML Engineer",
    title: "ML Engineer Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Which programming language is most commonly used for Machine Learning?",
        options: ["Java", "Python", "C#", "PHP"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is Machine Learning primarily about?",
        options: [
          "Writing static rules",
          "Learning patterns from data",
          "Designing UI",
          "Managing servers",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which Python library is mainly used for data manipulation?",
        options: ["TensorFlow", "Pandas", "React", "Docker"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "NumPy is mainly used for:",
        options: [
          "Numerical computations",
          "Web development",
          "API testing",
          "UI design",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Scikit-learn is commonly used for:",
        options: [
          "Machine learning algorithms",
          "Image editing",
          "Server deployment",
          "CSS styling",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "Which framework is widely used for deep learning?",
        options: ["Bootstrap", "TensorFlow", "Excel", "Jira"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "PyTorch is mainly used for:",
        options: [
          "Deep learning model development",
          "Database management",
          "Frontend styling",
          "API documentation",
        ],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "NLP stands for:",
        options: [
          "Natural Language Processing",
          "Neural Logic Programming",
          "Network Learning Process",
          "Natural Linear Programming",
        ],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "Computer Vision focuses on:",
        options: [
          "Processing images and videos",
          "Database queries",
          "Text formatting",
          "Server configuration",
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "Docker is used in ML workflows mainly for:",
        options: [
          "Creating charts",
          "Containerizing applications for deployment",
          "Writing SQL queries",
          "Designing dashboards",
        ],
        correctAnswer: 1,
      },
    ],
  },
    "Digital Marketing Executive": {
    id: "Digital Marketing Executive",
    title: "Digital Marketing Assessment",
    duration: 25 * 60, // 25 minutes
    questions: [
      {
        id: 1,
        question: "Canva is mainly used for:",
        options: [
          "Graphic design and marketing creatives",
          "Database management",
          "Backend development",
          "Server deployment",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "SEO stands for:",
        options: [
          "Search Engine Optimization",
          "Social Engagement Operation",
          "System Engine Output",
          "Search Enhancement Option",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "The primary goal of SEO is to:",
        options: [
          "Increase website loading speed",
          "Improve search engine ranking",
          "Design UI layouts",
          "Create databases",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Google Analytics is used to:",
        options: [
          "Track website traffic and user behavior",
          "Edit images",
          "Write backend APIs",
          "Manage servers",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which platform is mainly used for social media marketing?",
        options: ["Instagram", "MySQL", "Docker", "Linux"],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "Email marketing is primarily used to:",
        options: [
          "Communicate promotions and updates to users",
          "Compile code",
          "Design databases",
          "Host websites",
        ],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: "Content writing in digital marketing focuses on:",
        options: [
          "Writing optimized and engaging content",
          "Creating APIs",
          "Database indexing",
          "System configuration",
        ],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "Excel is commonly used in marketing for:",
        options: [
          "Data analysis and reporting",
          "Frontend styling",
          "App deployment",
          "Image rendering",
        ],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "Power BI helps marketers to:",
        options: [
          "Build mobile apps",
          "Visualize marketing data through dashboards",
          "Write CSS code",
          "Manage servers",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Which metric measures how many users click a link compared to impressions?",
        options: [
          "CTR (Click Through Rate)",
          "Bounce Rate",
          "Conversion Rate",
          "Session Duration",
        ],
        correctAnswer: 0,
      },
    ],
  },
};