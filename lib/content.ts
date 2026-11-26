export type Skill = {
  title: string;
  category: string;
  description: string;
  color: string;
};

export type Project = {
  title: string;
  tags: string[];
  description: string;
  link: string;
  icon: string;
  badge: string | null;
};

export type Certificate = {
  title: string;
  issuer: string;
  issuerFull: string;
  date: string;
  description: string;
  image: string;
  badge: string;
  color: string;
  borderColor: string;
  verifyLink: string | null;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export type Service = {
  title: string;
  desc: string;
  price: string;
  icon: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type PortfolioContent = {
  site: {
    name: string;
    heroAvailability: string;
    tagline: string;
    heroTitle: string;
    heroTitleLines: string[];
    heroSubtitle: string;
    heroBadges: string[];
    heroDescription: string;
    aboutFirst: string;
    aboutSecond: string;
    cvUrl: string;
  };
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  featuredCertificateIndexes: number[];
  experiences: Experience[];
  services: Service[];
  faqs: Faq[];
};

export function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (typeof value !== 'object' || value === null) return false;
  const content = value as Partial<PortfolioContent>;
  return typeof content.site === 'object' && content.site !== null &&
    Array.isArray(content.skills) &&
    Array.isArray(content.projects) &&
    Array.isArray(content.experiences) &&
    Array.isArray(content.certificates) &&
    Array.isArray(content.featuredCertificateIndexes) &&
    Array.isArray(content.services) &&
    Array.isArray(content.faqs);
}

export function certificateSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const defaultContent: PortfolioContent = {
  site: {
    name: 'Muhammad Ehsan',
    heroAvailability: 'Available for Freelance & Projects',
    tagline: 'Software Engineer • AI Developer • Web Developer',
    heroTitle: 'I Build Digital Masterpieces That Scale.',
    heroTitleLines: ['I Build Digital', 'Masterpieces', 'That Scale.'],
    heroSubtitle: 'Software Engineer • AI Developer • Web Developer',
    heroBadges: ['AI & ML Engineer', 'AI Assistant Architect', 'Web Developer', 'AR Developer', 'Content Creator'],
    heroDescription: 'Software Engineer and AI Developer building practical web applications and machine learning solutions. Creator of Zorix, a professional AI assistant that automates routine tasks and streamlines workflows. Currently working as an Agentic AI Developer Intern at PITB, with expertise in React, Laravel, Python, FastAPI, TensorFlow, and PyTorch.',
    aboutFirst: 'Software Engineer and AI Developer with a BSCS degree (CGPA: 3.52/4.00) from the University of South Asia. I build intelligent ML solutions, responsive websites, and production-ready web applications.',
    aboutSecond: 'I specialize in React, Laravel, Python, FastAPI, TensorFlow, PyTorch, and REST APIs. I also created Zorix, a professional AI assistant for scheduling, drafting, summarization, automation, and developer support. At PITB, I work on government digital services and agentic AI workflows; I also have experience building and deploying 10+ responsive WordPress websites.',
    cvUrl: 'https://drive.google.com/uc?export=download&id=1SaDtgcGRKIhD7aW6j72JbuqBJL3tKXjs',
  },
  skills: [
    { title: 'AI & ML Engineering', category: 'Development', description: 'Python, TensorFlow, PyTorch, Keras, Scikit-learn, Computer Vision', color: 'from-cyan-500 to-blue-600' },
    { title: 'Web Development', category: 'Development', description: 'React.js, JavaScript, PHP, Laravel, Node.js, HTML, CSS', color: 'from-blue-500 to-cyan-600' },
    { title: 'APIs & Deployment', category: 'Development', description: 'FastAPI, REST APIs, Streamlit, Docker, Git/GitHub', color: 'from-cyan-400 to-teal-600' },
    { title: 'Data Science', category: 'Analytics', description: 'NumPy, Pandas, Matplotlib, Seaborn, SQL', color: 'from-blue-400 to-cyan-600' },
    { title: 'WordPress & Design', category: 'Creative', description: 'WordPress, Canva, Adobe Photoshop, custom themes', color: 'from-cyan-500 to-blue-600' },
    { title: 'Zorix Assistant', category: 'AI Product', description: 'Scheduling, drafting, summarization, automation, and developer support', color: 'from-cyan-500 to-blue-600' },
  ],
  projects: [
    { title: 'DermaAI: Skin Cancer Detection Web App', tags: ['React.js', 'FastAPI', 'PyTorch', 'ONNX'], description: 'Full-stack skin lesion analysis app using ResUNet segmentation (Dice Score ≥0.85) and EfficientNet-B0 classification (AUC-ROC ≥0.88). CPU inference runs in under 3 seconds.', link: 'https://github.com/ehsanlabs/dermaai-skin-cancer-detection', icon: '🧬', badge: '2026' },
    { title: 'Language Translation Tool', tags: ['Python', 'Streamlit', 'deep-translator', 'gTTS'], description: 'Streamlit app translating text across 100+ languages with auto-detection, text-to-speech, one-click language swap, and copy controls.', link: 'https://github.com/ehsanlabs/Language_Translation_Tool', icon: '🌐', badge: null },
    { title: 'FAQ Chatbot', tags: ['Python', 'NLTK', 'TF-IDF', 'Scikit-learn'], description: 'NLP chatbot matching user questions to 28 FAQs using TF-IDF bigrams and cosine similarity, with greeting intent handling and low-confidence fallbacks.', link: 'https://github.com/ehsanlabs/FAQ_Chatbot', icon: '💬', badge: null },
    { title: 'Brain Tumor MRI Classification (FYP)', tags: ['Python', 'TensorFlow', 'CNN', 'Streamlit'], description: 'CNN model trained on MRI scans with 94% accuracy across four tumor classes, including explainable AI visualizations.', link: 'https://github.com/ehsanlabs/brain-tumor-mri-classifier-CNN-with-Explainable-AI', icon: '🧠', badge: 'FYP' },
    { title: 'SMS Spam Detection', tags: ['Python', 'Scikit-learn', 'NLP', 'TF-IDF', 'Logistic Regression'], description: 'Classified SMS messages as spam or ham with 98% accuracy using TF-IDF bigrams and Logistic Regression.', link: 'https://github.com/ehsanlabs/sms-spam-detection-naive-bayes-nlp', icon: '📩', badge: null },
    { title: 'Object Detection and Tracking', tags: ['YOLOv8', 'ByteTrack', 'OpenCV'], description: 'Real-time detection across 80 object classes with persistent ByteTrack IDs, motion trails, annotated video export, and 17 FPS CPU processing.', link: 'https://github.com/ehsanlabs', icon: '🎯', badge: null },
  ],
  certificates: [
    { title: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft', issuerFull: 'Microsoft Learn — Official Certification', date: '2026', description: 'Microsoft certification covering core artificial intelligence concepts and Azure AI fundamentals.', image: '/images/certificates/microsoft.jpeg', badge: '🏅', color: 'from-blue-500 to-blue-700', borderColor: 'border-blue-400/40', verifyLink: 'https://learn.microsoft.com/api/credentials/share/en-us/MuhammadEhsan-8681/54827A32CC987BED?sharingId=16A6452C9B83F8FC' },
    { title: 'AI & Machine Learning', issuer: 'NAVTTC', issuerFull: 'National Vocational & Technical Training Commission', date: 'Verified', description: 'Verified training in artificial intelligence and machine learning, including Python, neural networks, and practical model development.', image: '/images/certificates/navttc.jpeg', badge: '🏆', color: 'from-cyan-500 to-blue-600', borderColor: 'border-cyan-400/40', verifyLink: null },
    { title: 'BS Computer Science', issuer: 'University of South Asia', issuerFull: 'University of South Asia — Raiwind Road Campus', date: '2022–2026', description: 'Bachelor of Science in Computer Science with a 3.52/4.00 CGPA and coursework in algorithms, software engineering, databases, and machine learning.', image: '/images/certificates/university.jpeg', badge: '🎓', color: 'from-purple-500 to-blue-600', borderColor: 'border-purple-400/40', verifyLink: null },
    { title: 'WordPress Development', issuer: 'NAVTTC', issuerFull: 'National Vocational & Technical Training Commission', date: 'Verified', description: 'Certified in full WordPress development — custom themes, plugins, WooCommerce, SEO optimization, and client project delivery.', image: '/images/certificates/wordpress.png', badge: '⚡', color: 'from-cyan-400 to-teal-600', borderColor: 'border-teal-400/40', verifyLink: null },
    { title: 'Tech Event Participation — USA', issuer: 'International', issuerFull: 'International Technology Event — United States', date: '2026', description: 'Participated in an international technology event in the USA — networking with global tech professionals and showcasing AI/ML projects.', image: '/images/certificates/usa-event.jpeg', badge: '🌐', color: 'from-orange-500 to-red-500', borderColor: 'border-orange-400/40', verifyLink: null },
    { title: 'Fundamentals of Agentic AI', issuer: 'Hugging Face', issuerFull: 'Hugging Face Agents Course — Unit 1', date: 'September 2026', description: 'Completed the fundamentals of AI agents, including agent workflows, tool use, and practical automation concepts.', image: '/images/certificates/huggingface-agentic-ai.jpeg', badge: '🤗', color: 'from-yellow-500 to-orange-500', borderColor: 'border-yellow-400/40', verifyLink: null },
    { title: 'Claude 101', issuer: 'Anthropic', issuerFull: 'Anthropic — Certificate of Completion', date: 'May 2026', description: 'Certificate of completion focused on effective use of Claude and practical generative AI workflows.', image: '/images/certificates/claude.jpeg', badge: '🧠', color: 'from-orange-500 to-amber-600', borderColor: 'border-orange-400/40', verifyLink: null },
    { title: '1 Million Prompters', issuer: 'Dubai Future Foundation', issuerFull: 'AI Prompt Engineering Program', date: '2026', description: 'Completed training in prompt engineering and practical generative AI communication techniques.', image: '/images/certificates/dubai.jpeg', badge: '✦', color: 'from-purple-500 to-pink-600', borderColor: 'border-purple-400/40', verifyLink: null },
    { title: 'Google Gemini Exam 2026', issuer: 'Google Gemini', issuerFull: 'Google Gemini Exam 2026', date: 'August 2026', description: 'Certificate of achievement for demonstrating advanced knowledge of generative AI architecture and large language model mechanics.', image: '/images/certificates/google-gemini-exam-2026.png', badge: '✦', color: 'from-red-500 to-yellow-500', borderColor: 'border-yellow-400/40', verifyLink: null },
    { title: 'Data Analysis', issuer: 'Deloitte', issuerFull: 'Deloitte Data Analysis Certificate', date: '2026', description: 'Completed Deloitte data analysis training focused on interpreting data and communicating practical insights.', image: '/images/certificates/deloitte-data-analysis.png', badge: '📊', color: 'from-green-500 to-cyan-600', borderColor: 'border-green-400/40', verifyLink: null },
    { title: 'Technology', issuer: 'Deloitte', issuerFull: 'Deloitte Technology Certificate', date: '2026', description: 'Completed Deloitte technology training focused on modern technology concepts and professional digital skills.', image: '/images/certificates/deloitte-technology.png', badge: '⚙️', color: 'from-blue-500 to-indigo-600', borderColor: 'border-blue-400/40', verifyLink: null },
  ],
  featuredCertificateIndexes: [0, 1, 2],
  experiences: [
    { role: 'Software Engineer Intern (Agentic AI & Web Development)', company: 'Punjab Information Technology Board (PITB)', period: 'July 2026 – Present', location: 'Arfa Software Technology Park, Lahore', description: 'Building React and Tailwind CSS applications for government digital services, integrating APIs, and developing LLM-powered agent workflows.' },
    { role: 'Artificial Intelligence Intern', company: 'InsightSol Technologies', period: 'February 2026 – May 2026', location: 'Lahore, Pakistan', description: 'Built and trained machine learning models, prepared clean datasets, and integrated trained models into application pipelines.' },
    { role: 'Office Administrator', company: 'M&T Engineering Solution Pvt. Ltd', period: 'February 2022 – August 2022', location: 'Lahore, Pakistan', description: 'Managed documentation, scheduling, team coordination, filing systems, and reports that improved workflow efficiency by 30%.' },
  ],
  services: [
    { title: 'ML Model Development', desc: 'Custom machine learning solutions with TensorFlow & PyTorch', price: 'Custom Quote', icon: '🤖' },
    { title: 'Web Development', desc: 'High-performance websites built with React, Laravel, and modern APIs', price: 'Custom Quote', icon: '💻' },
    { title: 'AI Consultation', desc: 'Expert guidance on ML architecture and best practices', price: 'Hourly / Project', icon: '🧠' },
    { title: 'WordPress Development', desc: 'Responsive WordPress websites with custom themes and performance tuning', price: 'Custom Quote', icon: '⚡' },
    { title: 'n8n AI Automation', desc: 'AI-powered n8n workflows that connect tools, APIs, notifications, and repetitive business processes', price: 'Custom Quote', icon: '🔁' },
    { title: 'Zorix — AI Assistant', desc: 'Zorix is a professional AI assistant that automates routine tasks (scheduling, drafting, summarization, developer support), streamlining workflows and handling up to ~80% of repetitive work.', price: 'Starting at $100', icon: '🧩' },
  ],
  faqs: [
    { q: 'What services do you offer?', a: 'I offer ML model development, web development, AI consultation, and WordPress development.' },
    { q: 'What is your experience level?', a: 'Software Engineer and AI Developer with a BSCS degree (CGPA 3.52/4.00), experience at PITB and InsightSol Technologies, and 10+ WordPress websites.' },
    { q: 'What technologies do you use?', a: 'Python, TensorFlow, PyTorch, React, Laravel, FastAPI, WordPress, Docker, SQL, and modern web development tools.' },
    { q: 'How do you approach projects?', a: 'I follow a structured process: Discovery → Planning → Execution → Delivery with regular updates and ongoing support.' },
  ],
};
