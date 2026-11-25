'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, Mail, Linkedin, Github, Instagram, Youtube, Download, ChevronDown, Send, Music, Bot, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Link from 'next/link';

import { AnimatedBorderCard } from '@/components/AnimatedBorderCard';
import { certificateSlug, defaultContent } from '@/lib/content';
import { normalizeImageUrl } from '@/lib/image-url';
import type { PortfolioContent } from '@/lib/content';

type ChatMessage = {
  role: 'assistant' | 'visitor';
  text: string;
  actions?: ChatAction[];
};

type ChatAction = {
  label: string;
  href: string;
  external?: boolean;
};

const directEmailHref = 'mailto:m.ehsan.contact@gmail.com?subject=Project%20inquiry%20for%20Muhammad%20Ehsan&body=Hello%20Muhammad%2C%0A%0AI%20would%20like%20to%20discuss%20a%20project%20with%20you.%0A%0AProject%20details%3A%0A';

function getAssistantReply(input: string, content: PortfolioContent) {
  const question = input.toLowerCase();
  const professionalNote = 'For a professional build or a complete solution, Muhammad Ehsan sir can guide you with the right approach.';
  if (/^(how are you|how r u|how're you|how are u|kesa ho|kesy ho|kese ho|kya haal|haal kaisa|kia haal)/.test(question)) {
    return 'Main bilkul theek hoon! Aap sunaiye, aaj kis project, website, AI/automation, ya technology problem mein madad chahiye?';
  }
  const isRomanUrdu = /\b(acha|ap|aap|apka|batao|chahiye|hai|hy|karna|karo|mujhe|meri|kaam|koi|kya|sakti|sakte|wala|wali)\b/i.test(question);

  if (isRomanUrdu) {
    return `Bilkul, main aapki query ko samajh kar practical solution suggest karunga. Agar aapko AI/ML, web development, WordPress, Zorix ya n8n automation ka professional build chahiye ho to Muhammad Ehsan sir uska complete solution guide kar denge.`;
  }

  if (/^(hi|hello|hey|salam|assalam)/.test(question)) {
    return 'Hello! Tell me what you are trying to build or solve, and I will suggest a practical direction. For a professional build, Muhammad Ehsan sir can guide you with the complete solution.';
  }
  if (question.includes('n8n') || question.includes('automation') || question.includes('workflow')) {
    return 'For an n8n workflow, first map the trigger, the data transformation, the services or APIs involved, and the final notification or action. This makes the automation reliable and easier to maintain. Muhammad Ehsan sir can handle the professional build and complete integration.';
  }
  if (question.includes('zorix') || question.includes('assistant')) {
    return 'Zorix is Muhammad’s professional AI assistant for scheduling, drafting, summarization, developer support, and routine automation. A custom assistant usually starts with a clear task list, knowledge source, permissions, and fallback behavior. Muhammad Ehsan sir can guide the professional build and solution.';
  }
  if (question.includes('service') || question.includes('hire') || question.includes('price') || question.includes('cost')) {
    const serviceNames = content.services.map((service) => service.title).join(', ');
    return `Muhammad’s services include ${serviceNames}. The right option depends on your goal, features, integrations, and timeline, so pricing is based on the actual scope. ${professionalNote}`;
  }
  if (question.includes('web') || question.includes('website') || question.includes('react') || question.includes('laravel')) {
    return `For a strong website or web app, define the users, main workflows, required pages, data/API needs, and deployment target first. Muhammad builds with React, Laravel, Python/FastAPI, and modern APIs, and ${professionalNote.toLowerCase()}`;
  }
  if (question.includes('ai') || question.includes('machine learning') || question.includes('ml') || question.includes('tensorflow') || question.includes('pytorch')) {
    return `For an AI/ML solution, start with the problem definition, quality of available data, success metric, and how the model will be used in the real application. Muhammad works with Python, TensorFlow, PyTorch, FastAPI, and practical model integration. ${professionalNote}`;
  }
  if (question.includes('wordpress')) {
    return `For WordPress, focus first on the page structure, mobile performance, content workflow, security, and SEO basics. Muhammad provides responsive WordPress websites, custom themes, performance tuning, and SEO improvements, with experience building 10+ websites. ${professionalNote}`;
  }
  if (question.includes('project') || question.includes('experience') || question.includes('about')) {
    return `${content.site.name} is a ${content.site.tagline} working on agentic AI and government digital services at PITB. The portfolio includes AI/ML, web, automation, and WordPress work. ${professionalNote}`;
  }

  return 'I can help you think through the problem, suggest a practical approach, and identify the next technical steps. For a professional build or complete solution, Muhammad Ehsan sir can guide you further.';
}

function getChatActions(input: string, content: PortfolioContent): ChatAction[] {
  const question = input.toLowerCase();
  const actions: ChatAction[] = [];
  const addAction = (action: ChatAction) => {
    if (!actions.some((existingAction) => existingAction.href === action.href)) {
      actions.push(action);
    }
  };

  const matchingCertificate = content.certificates.find((certificate) => {
    return question.includes(certificate.title.toLowerCase()) || question.includes(certificate.issuer.toLowerCase());
  });
  if (matchingCertificate) {
    addAction({ label: `View ${matchingCertificate.title}`, href: `/certificates/${certificateSlug(matchingCertificate.title)}` });
  }

  const matchingProject = content.projects.find((project) => {
    const projectWords = project.title.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2);
    return projectWords.some((word) => word.length >= 5 && question.includes(word));
  });
  if (matchingProject) {
    addAction({ label: 'View project', href: matchingProject.link, external: true });
  }

  if (question.includes('certificate') || question.includes('certification') || question.includes('credential')) {
    addAction({ label: 'All certificates', href: '#certificates' });
  } else if (question.includes('project') || question.includes('experience') || question.includes('portfolio')) {
    addAction({ label: 'View projects', href: '#projects' });
    addAction({ label: 'View experience', href: '#resume' });
  } else if (question.includes('skill') || question.includes('technology') || question.includes('stack') || question.includes('react') || question.includes('python')) {
    addAction({ label: 'View skills', href: '#skills' });
  } else if (question.includes('service') || question.includes('hire') || question.includes('price') || question.includes('cost') || question.includes('automation') || question.includes('wordpress') || question.includes('website') || question.includes('ai')) {
    addAction({ label: 'Explore services', href: '#services' });
  }

  addAction({ label: 'Let’s Talk', href: '#letstalk' });
  addAction({ label: 'Email me', href: directEmailHref });
  return actions.slice(0, 4);
}

function emphasize(text: string, phrases: string[]) {
  const escapedPhrases = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const phrasePattern = new RegExp(`(${escapedPhrases.join('|')})`, 'g');
  return text.split(phrasePattern).map((part, index) => (
    phrases.includes(part)
      ? <span key={`${part}-${index}`} className="font-semibold text-cyan-300">{part}</span>
      : part
  ));
}

export default function Portfolio() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [portfolioContent, setPortfolioContent] = useState(defaultContent);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatHint, setShowChatHint] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello — I’m Ehsan Assistant, your friendly guide to practical solutions and Muhammad Ehsan’s work. Tell me what you are trying to build or solve.',
      actions: [
        { label: 'Explore services', href: '#services' },
        { label: 'Let’s Talk', href: '#letstalk' },
        { label: 'Email me', href: directEmailHref },
      ],
    },
  ]);

  // ✅ Formspree hook
  const [state, handleSubmit] = useForm("xzdayker");

  // Cursor & interaction state
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18 });
  const innerLeft = useTransform(mouseX, (x: number) => x - 5);
  const innerTop = useTransform(mouseY, (y: number) => y - 5);
  const outerLeft = useTransform(springX, (x: number) => x - 20);
  const outerTop = useTransform(springY, (y: number) => y - 20);

  useEffect(() => {
    if (sessionStorage.getItem('portfolio-welcome-seen') === 'true') {
      setShowWelcome(false);
      return;
    }
    sessionStorage.setItem('portfolio-welcome-seen', 'true');
    const timer = setTimeout(() => setShowWelcome(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowChatHint(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;
    const messageContainer = chatMessagesRef.current;
    if (!messageContainer) return;
    messageContainer.scrollTo({ top: messageContainer.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  async function sendChatMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setChatInput('');
    setChatMessages((current) => [...current, { role: 'visitor', text: message }]);
    setIsChatSending(true);
    try {
      const history = [...chatMessages, { role: 'visitor' as const, text: message }]
        .map((item) => ({ role: item.role === 'visitor' ? 'user' as const : 'model' as const, text: item.text }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!response.ok) throw new Error('Assistant API unavailable.');
      const result = await response.json() as { answer?: string };
      const answer = result.answer;
      if (!answer) throw new Error('Assistant returned no answer.');
      setChatMessages((current) => [...current, { role: 'assistant', text: answer, actions: getChatActions(message, portfolioContent) }]);
    } catch (error) {
      console.error('Portfolio assistant request failed.', error);
      const answer = getAssistantReply(message, portfolioContent);
      setChatMessages((current) => [...current, { role: 'assistant', text: answer, actions: getChatActions(message, portfolioContent) }]);
    } finally {
      setIsChatSending(false);
    }
  }

  function rememberCertificatePosition() {
    sessionStorage.setItem('portfolio-scroll-position', String(window.scrollY));
    sessionStorage.setItem('portfolio-restore-scroll', 'true');
  }

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load saved portfolio content.');
        setPortfolioContent(await response.json());
      } catch (error) {
        console.error('Portfolio content refresh failed.', error);
      }
    };
    void loadContent();
    const refreshTimer = window.setInterval(() => void loadContent(), 5000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      document.body.style.cursor = 'none';
      const onMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      const onMouseDown = (e: MouseEvent) => {
        setIsClicking(true);
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
      };
      const onMouseUp = () => setIsClicking(false);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
      };
    } else {
      const onTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: touch.clientX, y: touch.clientY }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
      };
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      return () => window.removeEventListener('touchstart', onTouchStart);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      if (sessionStorage.getItem('portfolio-restore-scroll') !== 'true') {
        sessionStorage.setItem('portfolio-scroll-position', String(scrollTop));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (showWelcome || sessionStorage.getItem('portfolio-restore-scroll') !== 'true') return;
    const savedScrollPosition = Number(sessionStorage.getItem('portfolio-scroll-position'));
    if (!Number.isFinite(savedScrollPosition) || savedScrollPosition <= 0) {
      sessionStorage.removeItem('portfolio-restore-scroll');
      return;
    }

    let frameId = 0;
    const restoreWhenLayoutIsReady = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= savedScrollPosition) {
        window.scrollTo(0, Math.min(savedScrollPosition, maxScroll));
        sessionStorage.removeItem('portfolio-restore-scroll');
        return;
      }
      frameId = window.requestAnimationFrame(restoreWhenLayoutIsReady);
    };
    frameId = window.requestAnimationFrame(restoreWhenLayoutIsReady);
    return () => window.cancelAnimationFrame(frameId);
  }, [showWelcome]);

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <div className="text-3xl">⚙️</div>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-bold mb-2 text-white">
            WELCOME TO
          </motion.h1>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Muhammad Ehsan.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-gray-400 mt-4 text-lg">
            Building Digital Excellence
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const defaultSkills = [
    { title: 'AI & ML Engineering', category: 'Development', description: 'Python, TensorFlow, PyTorch, Keras, Scikit-learn, Computer Vision', color: 'from-cyan-500 to-blue-600' },
    { title: 'Web Development', category: 'Development', description: 'React.js, JavaScript, PHP, Laravel, Node.js, HTML, CSS', color: 'from-blue-500 to-cyan-600' },
    { title: 'APIs & Deployment', category: 'Development', description: 'FastAPI, REST APIs, Streamlit, Docker, Git/GitHub', color: 'from-cyan-400 to-teal-600' },
    { title: 'Data Science', category: 'Analytics', description: 'NumPy, Pandas, Matplotlib, Seaborn, SQL', color: 'from-blue-400 to-cyan-600' },
    { title: 'WordPress & Design', category: 'Creative', description: 'WordPress, Canva, Adobe Photoshop, custom themes', color: 'from-cyan-500 to-blue-600' },
    { title: 'Zorix Assistant', category: 'AI Product', description: 'Scheduling, drafting, summarization, automation, and developer support', color: 'from-cyan-500 to-blue-600' }
  ];

  const defaultProjects = [
    {
      title: 'DermaAI: Skin Cancer Detection Web App',
      tags: ['React.js', 'FastAPI', 'PyTorch', 'ONNX'],
      description: 'Full-stack skin lesion analysis app using ResUNet segmentation (Dice Score ≥0.85) and EfficientNet-B0 classification (AUC-ROC ≥0.88). CPU inference runs in under 3 seconds.',
      link: 'https://github.com/ehsanlabs/dermaai-skin-cancer-detection',
      icon: '🧬',
      badge: '2026'
    },
    {
      title: 'Language Translation Tool',
      tags: ['Python', 'Streamlit', 'deep-translator', 'gTTS'],
      description: 'Streamlit app translating text across 100+ languages with auto-detection, text-to-speech, one-click language swap, and copy controls.',
      link: 'https://github.com/ehsanlabs/Language_Translation_Tool',
      icon: '🌐',
      badge: null
    },
    {
      title: 'FAQ Chatbot',
      tags: ['Python', 'NLTK', 'TF-IDF', 'Scikit-learn'],
      description: 'NLP chatbot matching user questions to 28 FAQs using TF-IDF bigrams and cosine similarity, with greeting intent handling and low-confidence fallbacks.',
      link: 'https://github.com/ehsanlabs/FAQ_Chatbot',
      icon: '💬',
      badge: null
    },
    {
      title: 'Brain Tumor MRI Classification (FYP)',
      tags: ['Python', 'TensorFlow', 'CNN', 'Streamlit'],
      description: 'CNN model trained on MRI scans with 94% accuracy across four tumor classes, including explainable AI visualizations.',
      link: 'https://github.com/ehsanlabs/brain-tumor-mri-classifier-CNN-with-Explainable-AI',
      icon: '🧠',
      badge: 'FYP'
    },
    {
      title: 'SMS Spam Detection',
      tags: ['Python', 'Scikit-learn', 'NLP', 'TF-IDF', 'Logistic Regression'],
      description: 'Classified SMS messages as spam or ham with 98% accuracy using TF-IDF bigrams and Logistic Regression.',
      link: 'https://github.com/ehsanlabs/sms-spam-detection-naive-bayes-nlp',
      icon: '📩',
      badge: null
    },
    {
      title: 'Object Detection and Tracking',
      tags: ['YOLOv8', 'ByteTrack', 'OpenCV'],
      description: 'Real-time detection across 80 object classes with persistent ByteTrack IDs, motion trails, annotated video export, and 17 FPS CPU processing.',
      link: 'https://github.com/ehsanlabs',
      icon: '🎯',
      badge: null
    }
  ];

  const defaultCertificates = [
    {
      title: 'Microsoft Certified: Azure AI Fundamentals',
      issuer: 'Microsoft',
      issuerFull: 'Microsoft Learn — Official Certification',
      date: '2026',
      description: 'Microsoft certification covering core artificial intelligence concepts and Azure AI fundamentals.',
      image: '/images/certificates/microsoft.jpeg',
      badge: '🏅',
      color: 'from-blue-500 to-blue-700',
      borderColor: 'border-blue-400/40',
      verifyLink: 'https://learn.microsoft.com/api/credentials/share/en-us/MuhammadEhsan-8681/54827A32CC987BED?sharingId=16A6452C9B83F8FC',
    },
    {
      title: 'AI & Machine Learning',
      issuer: 'NAVTTC',
      issuerFull: 'National Vocational & Technical Training Commission',
      date: 'Verified',
      description: 'Verified training in artificial intelligence and machine learning, including Python, neural networks, and practical model development.',
      image: '/images/certificates/navttc.jpeg',
      badge: '🏆',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-400/40',
      verifyLink: null,
    },
    {
      title: 'BS Computer Science',
      issuer: 'University of South Asia',
      issuerFull: 'University of South Asia — Raiwind Road Campus',
      date: '2022–2026',
      description: 'Bachelor of Science in Computer Science with a 3.52/4.00 CGPA and coursework in algorithms, software engineering, databases, and machine learning.',
      image: '/images/certificates/university.jpeg',
      badge: '🎓',
      color: 'from-purple-500 to-blue-600',
      borderColor: 'border-purple-400/40',
      verifyLink: null,
    },
    {
      title: 'WordPress Development',
      issuer: 'NAVTTC',
      issuerFull: 'National Vocational & Technical Training Commission',
      date: 'Verified',
      description: 'Certified in full WordPress development — custom themes, plugins, WooCommerce, SEO optimization, and client project delivery.',
      image: '/images/certificates/wordpress.png',
      badge: '⚡',
      color: 'from-cyan-400 to-teal-600',
      borderColor: 'border-teal-400/40',
      verifyLink: null,
    },
    {
      title: 'Tech Event Participation — USA',
      issuer: 'International',
      issuerFull: 'International Technology Event — United States',
      date: '2026',
      description: 'Participated in an international technology event in the USA — networking with global tech professionals and showcasing AI/ML projects.',
      image: '/images/certificates/usa-event.jpeg',
      badge: '🌐',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-400/40',
      verifyLink: null,
    },
    {
      title: 'Fundamentals of Agents',
      issuer: 'Hugging Face',
      issuerFull: 'Hugging Face Agents Course — Unit 1',
      date: 'September 2026',
      description: 'Completed the fundamentals of AI agents, including agent workflows, tool use, and practical automation concepts.',
      image: '/images/certificates/huggingface.jpeg',
      badge: '🤗',
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-400/40',
      verifyLink: null,
    },
    {
      title: 'Claude 101',
      issuer: 'Anthropic',
      issuerFull: 'Anthropic — Certificate of Completion',
      date: 'May 2026',
      description: 'Certificate of completion focused on effective use of Claude and practical generative AI workflows.',
      image: '/images/certificates/claude.jpeg',
      badge: '🧠',
      color: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-400/40',
      verifyLink: null,
    },
    {
      title: '1 Million Prompters',
      issuer: 'Dubai Future Foundation',
      issuerFull: 'AI Prompt Engineering Program',
      date: '2026',
      description: 'Completed training in prompt engineering and practical generative AI communication techniques.',
      image: '/images/certificates/dubai.jpeg',
      badge: '✦',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400/40',
      verifyLink: null,
    },
  ];

  const defaultServices = [
    { title: 'ML Model Development', desc: 'Custom machine learning solutions with TensorFlow & PyTorch', price: 'Starting at $500', icon: '🤖' },
    { title: 'Web Development', desc: 'High-performance websites built with React & Next.js', price: 'Starting at $300', icon: '💻' },
    { title: 'AI Consultation', desc: 'Expert guidance on ML architecture & best practices', price: 'Hourly / Project', icon: '🧠' },
    { title: 'AI Development', desc: 'AI and machine learning solutions with Python, TensorFlow, PyTorch, and modern APIs.', price: 'Custom Quote', icon: '🤖' },
    { title: 'Zorix — AI Assistant', desc: 'Zorix is a professional AI assistant that automates routine tasks (scheduling, drafting, summarization, developer support), streamlining workflows and handling up to ~80% of repetitive work.', price: 'Starting at $100', icon: '🧩' }
  ];

  const defaultFaqs = [
    { q: 'What services do you offer?', a: 'I offer ML model development, web development with modern frameworks, AI consultation, AR product development, and portfolio projects for students and startups.' },
    { q: 'What is your experience level?', a: 'Software Engineer and AI Developer with a BSCS degree (CGPA 3.52/4.00), experience at PITB and InsightSol Technologies, and 10+ WordPress websites.' },
    { q: 'What technologies do you use?', a: 'Python, TensorFlow, PyTorch, React, Laravel, FastAPI, WordPress, Docker, SQL, and modern web development tools.' },
    { q: 'How do you approach projects?', a: 'I follow a structured process: Discovery → Planning → Execution → Delivery with regular updates and ongoing support.' },
    { q: 'What is your typical project timeline?', a: 'Depends on project scope. ML models: 2-4 weeks. Websites: 1-3 weeks. AR products: 3-6 weeks. Custom projects get detailed timelines after discussion.' },
    { q: 'Do you work remotely?', a: 'Yes! I work with clients globally. All communication happens via email, call, or messaging platforms.' },
    { q: 'What are your rates?', a: 'Competitive rates based on project complexity. Contact me for a custom quote based on your specific needs.' },
    { q: 'How can I get started?', a: 'Click the "Book Now" button or send me an email with project details. We\'ll schedule a consultation to discuss your goals.' }
  ];

  const skills = portfolioContent.skills.length ? portfolioContent.skills : defaultSkills;
  const projects = portfolioContent.projects.length ? portfolioContent.projects : defaultProjects;
  const certificates = portfolioContent.certificates.length ? portfolioContent.certificates : defaultCertificates;
  const services = portfolioContent.services.length ? portfolioContent.services : defaultServices;
  const faqs = portfolioContent.faqs.length ? portfolioContent.faqs : defaultFaqs;
  const experiences = portfolioContent.experiences;
  const featuredCertificateIndexes = portfolioContent.featuredCertificateIndexes?.length === 3 ? portfolioContent.featuredCertificateIndexes : [0, 1, 2];
  const visibleCertificates = showAllCertificates
    ? certificates
    : featuredCertificateIndexes.map((index) => certificates[index]).filter(Boolean);
  const heroTitleLines = portfolioContent.site.heroTitleLines?.length === 3
    ? portfolioContent.site.heroTitleLines
    : [portfolioContent.site.heroTitle, '', ''];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[100] pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
          style={{ width: `${scrollProgress}%`, boxShadow: '0 0 8px #22d3ee' }}
        />
      </div>
      {/* Custom Cursor – desktop only */}
      <motion.div
        className="fixed pointer-events-none z-[999] rounded-full border-2 border-cyan-400/80 hidden md:block"
        style={{ left: outerLeft, top: outerTop, width: 40, height: 40 }}
        animate={{ scale: isClicking ? 0.5 : 1, opacity: isClicking ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed pointer-events-none z-[999] rounded-full bg-cyan-400 hidden md:block"
        style={{ left: innerLeft, top: innerTop, width: 10, height: 10, boxShadow: '0 0 10px #22d3ee, 0 0 20px rgba(34,211,238,0.5)' }}
        animate={{ scale: isClicking ? 2 : 1 }}
        transition={{ duration: 0.1 }}
      />
      {/* Click / Touch Ripples */}
      {ripples.map(r => (
        <motion.div
          key={r.id}
          className="fixed pointer-events-none z-[998] rounded-full border border-cyan-400/70"
          style={{ left: r.x, top: r.y, width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 16, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      ))}
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/70 border-b border-cyan-500/20 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Muhammad Ehsan<span className="text-cyan-400">.</span>
          </motion.div>
          <div className="hidden md:flex space-x-1">
            {['About', 'Skills', 'Services', 'Projects', 'Resume', 'Certificates', 'FAQ', "Let's Talk"].map((item, i) => (
              item === "Let's Talk" ? (
                <motion.a key={i} href="#letstalk" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                  {item}
                </motion.a>
              ) : (
                <motion.a key={i} href={`#${item.toLowerCase().replace(/\s+/g, '')}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-all rounded-lg hover:bg-cyan-400/10 relative group">
                  {item}
                  <motion.div className="absolute inset-0 rounded-lg bg-cyan-400/20" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                </motion.a>
              )
            ))}
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-black/90 border-t border-cyan-500/20">
            <div className="flex flex-col space-y-2 p-6">
              {['About', 'Skills', 'Services', 'Projects', 'Resume', 'Certificates', 'FAQ', "Let's Talk"].map((item) => (
                item === "Let's Talk" ? (
                  <a key={item} href="#letstalk" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-center">{item}</a>
                ) : (
                  <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '')}`} className="text-gray-300 hover:text-cyan-400">{item}</a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="neuralGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <motion.circle cx="150" cy="100" r="8" fill="#06b6d4" opacity="0.9" filter="url(#glow)" animate={{ r: [6, 10, 6], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
            <motion.circle cx="300" cy="250" r="6" fill="#0ea5e9" opacity="0.8" filter="url(#glow)" animate={{ r: [4, 8, 4], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="500" cy="150" r="7" fill="#3b82f6" opacity="0.85" filter="url(#glow)" animate={{ r: [5, 9, 5], opacity: [0.6, 0.95, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} />
            <motion.circle cx="800" cy="200" r="6" fill="#06b6d4" opacity="0.8" filter="url(#glow)" animate={{ r: [4, 8, 4], opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }} />
            <motion.circle cx="1050" cy="350" r="8" fill="#0ea5e9" opacity="0.9" filter="url(#glow)" animate={{ r: [6, 10, 6], opacity: [0.65, 1, 0.65] }} transition={{ duration: 3.2, repeat: Infinity, delay: 0.6 }} />
            <motion.circle cx="200" cy="500" r="7" fill="#3b82f6" opacity="0.85" filter="url(#glow)" animate={{ r: [5, 9, 5], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 3, repeat: Infinity, delay: 0.4 }} />
            <motion.circle cx="700" cy="650" r="6" fill="#06b6d4" opacity="0.8" filter="url(#glow)" animate={{ r: [4, 8, 4], opacity: [0.55, 0.85, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: 0.1 }} />
            <motion.circle cx="950" cy="700" r="7" fill="#0ea5e9" opacity="0.85" filter="url(#glow)" animate={{ r: [5, 9, 5], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 3.3, repeat: Infinity, delay: 0.7 }} />
            <motion.line x1="150" y1="100" x2="300" y2="250" stroke="url(#neuralGrad1)" strokeWidth="2" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
            <motion.line x1="300" y1="250" x2="500" y2="150" stroke="url(#neuralGrad2)" strokeWidth="2" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }} />
            <motion.line x1="500" y1="150" x2="800" y2="200" stroke="url(#neuralGrad1)" strokeWidth="2" animate={{ opacity: [0.35, 0.75, 0.35] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }} />
            <motion.line x1="800" y1="200" x2="1050" y2="350" stroke="url(#neuralGrad2)" strokeWidth="2" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3.2, repeat: Infinity, delay: 0.5 }} />
            <motion.line x1="150" y1="100" x2="700" y2="650" stroke="url(#neuralGrad1)" strokeWidth="1.5" opacity="0.2" animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.line x1="500" y1="150" x2="200" y2="500" stroke="url(#neuralGrad2)" strokeWidth="1.5" opacity="0.2" animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.3 }} />
            <motion.line x1="300" y1="250" x2="950" y2="700" stroke="url(#neuralGrad1)" strokeWidth="1.5" opacity="0.2" animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 3.8, repeat: Infinity, delay: 0.6 }} />
            <motion.line x1="1050" y1="350" x2="700" y2="650" stroke="url(#neuralGrad2)" strokeWidth="2" animate={{ opacity: [0.35, 0.75, 0.35] }} transition={{ duration: 3.3, repeat: Infinity, delay: 0.4 }} />
            <motion.g opacity="0.08" animate={{ opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 8, repeat: Infinity }}>
              {Array.from({ length: 13 }).map((_, i) => (<line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" stroke="#06b6d4" strokeWidth="1" />))}
              {Array.from({ length: 9 }).map((_, i) => (<line key={`h-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} stroke="#06b6d4" strokeWidth="1" />))}
            </motion.g>
          </svg>
          <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-b from-cyan-500 to-transparent rounded-full blur-3xl opacity-10" animate={{ y: [0, -50, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-t from-blue-500 to-transparent rounded-full blur-3xl opacity-10" animate={{ y: [0, 50, 0], scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-cyan-300">{portfolioContent.site.heroAvailability}</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">{heroTitleLines[0].split(/(Digital)/g).map((part, index) => part === 'Digital' ? <span key={`${part}-${index}`} className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{part}</span> : part)}</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{heroTitleLines[1]}</span>
              <span className="block text-white">{heroTitleLines[2]}</span>
            </h1>
            <p className="text-base md:text-xl text-gray-300 mb-6 leading-relaxed">
              {portfolioContent.site.heroBadges?.join(' • ') || portfolioContent.site.heroSubtitle}
            </p>
            <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
              {portfolioContent.site.heroDescription}
            </p>
            <div className="flex gap-4 flex-wrap">
              <motion.a href="#letstalk" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all flex items-center gap-2">
                Work With Me <span>→</span>
              </motion.a>
              <motion.a href="https://wa.me/923234119975?text=I%20want%20to%20work%20with%20you" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Book Now
              </motion.a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="relative mx-auto w-full max-w-xs md:max-w-full">
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-cyan-500/20">
                <img src="/images/Portfolio_image.jpg" alt="Muhammad Ehsan" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <motion.div className="absolute -bottom-4 right-2 px-2 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-lg backdrop-blur-sm" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <p className="text-xs font-semibold text-cyan-300">Web Developer</p>
              </motion.div>
              <motion.div className="absolute top-4 left-4 px-2 py-1 bg-blue-500/20 border border-blue-400/50 rounded-lg backdrop-blur-sm" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <p className="text-xs font-semibold text-blue-300">AI Engineer</p>
              </motion.div>
              <motion.div className="absolute top-1/2 right-2 px-2 py-1 bg-teal-500/20 border border-teal-400/50 rounded-lg backdrop-blur-sm" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}>
                <p className="text-xs font-semibold text-teal-300">AI Assistant Architect</p>
              </motion.div>
              <motion.div className="absolute bottom-6 left-4 px-2 py-1 bg-blue-500/20 border border-blue-400/50 rounded-lg backdrop-blur-sm" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: 0.6 }}>
                <p className="text-xs font-semibold text-blue-300">Content Creator</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Me */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <motion.a href={portfolioContent.site.cvUrl} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            <Download size={16} /> Download CV
          </motion.a>
        </div>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-12 text-center">
          About <span className="text-cyan-400">Me</span>
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="border border-cyan-500/30">
          <AnimatedBorderCard className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm cursor-pointer">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              {emphasize(portfolioContent.site.aboutFirst, ['BSCS degree (CGPA: 3.52/4.00)', 'intelligent ML solutions', 'production-ready web applications'])}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              {emphasize(portfolioContent.site.aboutSecond, ['React, Laravel, Python, FastAPI, TensorFlow, PyTorch, and REST APIs', 'Zorix', 'PITB', '10+ responsive WordPress websites'])}
            </p>
          </AnimatedBorderCard>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          My <span className="text-cyan-400">Skills</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Technologies and expertise I use to build solutions</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -10 }}>
              <AnimatedBorderCard className="relative p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 group transition-all h-full hover:border-cyan-400/60">
                <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${skill.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">⚡</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{skill.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{skill.category}</p>
                  <p className="text-sm text-gray-300">{skill.description}</p>
                  <motion.div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ duration: 0.3 }}></motion.div>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          How I Can <span className="text-cyan-400">Help You</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Professional services tailored to your specific needs</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -15 }}>
              <AnimatedBorderCard className="relative p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 group transition-all h-full">
                <div className="relative">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">{service.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">{service.desc}</p>
                  <p className="text-sm font-semibold text-cyan-400">{service.price}</p>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          My <span className="text-cyan-400">Projects</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Real-world projects built with passion and precision</p>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -8 }}>
              <AnimatedBorderCard className="relative p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 group transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{project.icon}</div>
                    <h3 className="text-lg font-bold group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                  </div>
                  {project.badge && (
                    <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white flex-shrink-0 ml-2">{project.badge}</span>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="px-2 py-1 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">{tag}</span>
                  ))}
                </div>
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all mt-auto"
                >
                  <Github size={16} /> View on GitHub
                </motion.a>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey/Experience */}
      <section id="resume" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          My <span className="text-cyan-400">Journey</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Milestones that define my professional path</p>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -10 }}>
            <AnimatedBorderCard className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-all h-full">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎓</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Education</h3>
                  <p className="font-semibold text-cyan-300 mb-2">BS Computer Science</p>
                  <p className="text-gray-400 text-sm mb-2">University of South Asia, Raiwind Road Campus (CGPA: 3.52/4.00)</p>
                  <p className="text-gray-400 text-sm mb-4">2022 – 2026</p>
                  <p className="text-gray-300 text-sm">Focused on Machine Learning, Deep Learning, Algorithms, and Database Systems. Building practical projects with real-world applications.</p>
                </div>
              </div>
            </AnimatedBorderCard>
          </motion.div>
          <div className="space-y-5">
            {experiences.map((experience, index) => (
              <motion.div key={`${experience.company}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ y: -6 }}>
                <AnimatedBorderCard className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">💼</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-cyan-300">{experience.role}</h3>
                      <p className="text-white font-semibold">{experience.company}</p>
                      <p className="text-gray-400 text-sm mb-2">{experience.period} · {experience.location}</p>
                      <p className="text-gray-300 text-sm">{experience.description}</p>
                    </div>
                  </div>
                </AnimatedBorderCard>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <motion.a href={portfolioContent.site.cvUrl} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-all">
            <Download size={20} /> Download CV
          </motion.a>
        </div>
      </section>

      {/* ===== Certificates / Achievements Section ===== */}
      <section id="certificates" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm text-cyan-300 mb-4">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Verified Achievements
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 text-center"
        >
          Certificates &amp; <span className="text-cyan-400">Achievements</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-14">
          Verified credentials and accomplishments that validate my expertise
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleCertificates.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <AnimatedBorderCard className="relative rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 overflow-hidden group transition-all h-full flex flex-col">
                {/* Certificate Image */}
                <Link href={`/certificates/${certificateSlug(cert.title)}`} onClick={rememberCertificatePosition} className="relative block w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-900 to-black" aria-label={`View ${cert.title} certificate`}>
                  {/* Glow overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/10 transition-all duration-500 z-10" />

                  <img
                    src={normalizeImageUrl(cert.image)}
                    alt={cert.title}
                    className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.02]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = parent.querySelector('.cert-placeholder') as HTMLElement | null;
                        if (placeholder) placeholder.style.display = 'flex';
                      }
                    }}
                  />

                  {/* Placeholder shown when image missing */}
                  <div
                    className="cert-placeholder absolute inset-0 flex-col items-center justify-center text-center p-6 z-20"
                    style={{ display: 'none' }}
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                      {cert.badge}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Certificate image coming soon</p>
                  </div>

                  {/* Issuer badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`px-3 py-1 text-xs font-bold bg-gradient-to-r ${cert.color} text-white rounded-full shadow-lg`}>
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Achievement badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center text-lg">
                      {cert.badge}
                    </div>
                    </div>
                  </Link>

                {/* Certificate Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      <Link href={`/certificates/${certificateSlug(cert.title)}`} onClick={rememberCertificatePosition}>{cert.title}</Link>
                    </h3>
                    <span className="text-xs text-cyan-400 font-semibold whitespace-nowrap border border-cyan-400/30 px-2 py-0.5 rounded-full">
                      {cert.date}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 font-medium">{cert.issuerFull}</p>

                  <p className="text-sm text-gray-300 leading-relaxed flex-1">{cert.description}</p>

                  {/* Bottom glow line + Verify button */}
                  <div className="mt-4 pt-4 border-t border-cyan-500/15">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cert.color} animate-pulse`} />
                      <span className="text-xs text-cyan-400 font-semibold">Verified Credential</span>
                      <div className="ml-auto">
                        <div className={`h-0.5 w-16 bg-gradient-to-r ${cert.color} rounded-full opacity-60`} />
                      </div>
                    </div>
                    {cert.verifyLink && (
                      <motion.a
                        href={cert.verifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify on Microsoft Learn
                      </motion.a>
                    )}
                  </div>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <motion.button
            type="button"
            onClick={() => setShowAllCertificates((visible) => !visible)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-cyan-400 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            {showAllCertificates ? 'Show Featured' : `See More Certificates (${Math.max(certificates.length - visibleCertificates.length, 0)})`}
          </motion.button>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-3 gap-3 md:gap-6"
        >
          {[
            { num: '8+', label: 'Certifications' },
            { num: '10+', label: 'WordPress Sites' },
            { num: '2025–26', label: 'Latest Credentials' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <AnimatedBorderCard className="h-full rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5 text-center md:p-8">
                <p className="mb-2 text-3xl font-bold text-cyan-400 md:text-4xl">{stat.num}</p>
                <p className="text-sm text-gray-400 md:text-base">{stat.label}</p>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Accelerate Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4">Accelerate Your <span className="text-cyan-400">Growth</span></h2>
            <p className="text-gray-400 mb-6">Get personalized guidance on AI/ML projects, web development, and career roadmap.</p>
            <motion.a href="https://wa.me/923234119975?text=I%20want%20to%20work%20with%20you" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all">
              Book a Session <span>→</span>
            </motion.a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -10 }}>
            <AnimatedBorderCard className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-all h-full">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Quick Consultation</h3>
              <p className="text-2xl font-bold text-cyan-400 mb-2">Rs 1000</p>
              <p className="text-sm text-gray-400 mb-4">30 Minutes</p>
              <p className="text-sm text-gray-300 mb-4">Quick code review or specific problem solving.</p>
              <motion.a href="https://wa.me/923234119975?text=I%20need%20a%20Quick%20Consultation%20(Rs%203000)%20-%2030%20minutes" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full inline-flex items-center justify-center py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Book Now
              </motion.a>
            </AnimatedBorderCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} whileHover={{ y: -10 }}>
            <AnimatedBorderCard className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-all h-full">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Deep Dive Session</h3>
              <p className="text-2xl font-bold text-cyan-400 mb-2">Rs 3000</p>
              <p className="text-sm text-gray-400 mb-4">1 Hour</p>
              <p className="text-sm text-gray-300 mb-4">Comprehensive project review & career roadmap.</p>
              <motion.a href="https://wa.me/923234119975?text=I%20need%20a%20Deep%20Dive%20Session%20(Rs%205000)%20-%201%20hour" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full inline-flex items-center justify-center py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Book Now
              </motion.a>
            </AnimatedBorderCard>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[{ num: '15+', label: 'Projects Done' }, { num: '92%', label: 'Avg Accuracy' }, { num: '24h', label: 'Response Time' }, { num: '1:1', label: 'Personal Attention' }].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <AnimatedBorderCard className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/5 to-blue-500/5 text-center h-full">
                <p className="text-3xl font-bold text-cyan-400 mb-2">{stat.num}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Small Note */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <AnimatedBorderCard className="p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center"><span>📌</span></div>
            </div>
            <h3 className="text-2xl font-bold mb-4">A Small Note</h3>
            <p className="text-gray-300 mb-4">I keep consultations limited so that each one gets proper time and attention. Every session is personalized to help you achieve your specific goals.</p>
            <p className="text-gray-400">Looking for practical guidance and real insights? Let&apos;s work together to elevate your projects and career.</p>
          </AnimatedBorderCard>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          Frequently Asked <span className="text-cyan-400">Questions</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Everything you need to know</p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
              <AnimatedBorderCard className="rounded-lg overflow-hidden bg-gradient-to-r from-cyan-500/5 to-blue-500/5 transition-all">
                <button onClick={() => setActiveTab(activeTab === i ? null : i)} className="w-full p-6 flex justify-between items-center hover:bg-cyan-500/10 transition-all">
                  <span className="text-lg font-semibold text-left text-white">{faq.q}</span>
                  <motion.div animate={{ rotate: activeTab === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={20} className="text-cyan-400" />
                  </motion.div>
                </button>
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: activeTab === i ? 'auto' : 0, opacity: activeTab === i ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="px-6 pb-6 text-gray-300">{faq.a}</p>
                </motion.div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          My <span className="text-cyan-400">Process</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">A structured approach to deliver quality results</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[{ num: 1, title: 'Discovery', desc: 'Understand your goals & requirements', icon: '🔍' }, { num: 2, title: 'Planning', desc: 'Create roadmap & timeline', icon: '📋' }, { num: 3, title: 'Execution', desc: 'Build with regular updates', icon: '⚡' }, { num: 4, title: 'Delivery', desc: 'Launch & ongoing support', icon: '🚀' }].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="relative">
              <div className="absolute -top-4 left-6 z-10 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white">{step.num}</div>
              <AnimatedBorderCard className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-all mt-4">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Let&apos;s Talk - Formspree Integrated */}
      <section id="letstalk" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold mb-4 text-center">
          Let&apos;s <span className="text-cyan-400">Talk</span>
        </motion.h2>
        <p className="text-center text-gray-400 mb-12">Ready to start your next project? Send me a message.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AnimatedBorderCard className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Mail size={20} className="text-white" />
                  </div>
                    <div className="min-w-0">
                    <p className="text-sm text-gray-400">Email</p>
                      <a href={directEmailHref} className="break-all text-sm font-semibold text-white transition-colors hover:text-cyan-400 sm:text-base">m.ehsan.contact@gmail.com</a>
                    </div>
                    </div>
                    <a href={directEmailHref} className="inline-flex h-11 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-500/25">Email me directly</a>
                  </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">📍</div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white font-semibold">Lahore, Punjab, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">📞</div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a href="tel:+923234119975" className="text-white font-semibold hover:text-cyan-400 transition-colors">+92-323-4119975</a>
                  </div>
                </div>
              </div>
            </AnimatedBorderCard>
          </motion.div>

          {/* ✅ Formspree Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AnimatedBorderCard className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5">

              {/* ✅ Success message */}
              {state.succeeded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Message Sent!</h3>
                  <p className="text-gray-300">Thanks for reaching out. I&apos;ll get back to you soon!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>
                    <div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project..."
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all resize-none"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={state.submitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {state.submitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </AnimatedBorderCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">Muhammad Ehsan.</p>
              <p className="text-gray-400">Software Engineer and AI Developer building practical web applications and machine learning solutions.</p>
            </div>
            <div></div>
            <div className="flex flex-wrap justify-start md:justify-end gap-3">
              {[
                { icon: Mail, href: directEmailHref, label: 'Email' },
                { icon: Linkedin, href: 'https://linkedin.com/in/muhammad-ehsan-88b232340', label: 'LinkedIn' },
                { icon: Github, href: 'https://github.com/ehsanlabs', label: 'GitHub' },
                { icon: Instagram, href: 'https://www.instagram.com/ask_tech_ehsan?igsh=YzdzbjF3cGN0bXVq', label: 'Instagram' },
                { icon: Youtube, href: 'https://youtube.com/@ask_tech_ehsan?si=xIsR5bm9mUIpOi8Y', label: 'YouTube' },
                { icon: Music, href: 'https://www.tiktok.com/@ask_tech_ehsan?_r=1&_t=ZN-948pB0i1s9O', label: 'TikTok' }
              ].map((social, i) => (
                <motion.a key={i} href={social.href} target={!social.href.startsWith('#') ? '_blank' : undefined} rel={!social.href.startsWith('#') ? 'noopener noreferrer' : undefined} whileHover={{ scale: 1.2, y: -3 }} className="w-10 h-10 rounded-lg border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all relative group" title={social.label}>
                  <motion.div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-cyan-500/60 transition-all duration-300" />
                  <div className="relative z-10"><social.icon size={18} /></div>
                </motion.a>
              ))}
            </div>
          </div>
          <div className="border-t border-cyan-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>Designed and developed by <span className="text-cyan-400 font-semibold">Muhammad Ehsan</span>.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/admin" className="hover:text-cyan-400 transition-colors">Login as Admin</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">© 2026</a>
              <a href="/privacy" className="hover:text-cyan-400 transition-colors" aria-label="Read Privacy Policy">Privacy Policy</a>
              <a href="/terms" className="hover:text-cyan-400 transition-colors" aria-label="Read Terms of Use">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/923234119975?text=Need%20help%20with%20in%20my%20Project" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:scale-105 transition-transform">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.88 11.88 0 0012 .5C6  .5 1.2 5.3 1.2 11.3c0 2.05.54 4.02 1.57 5.77L.5 23.5l6.66-1.74a11.73 11.73 0 005.82 1.45c6 0 10.8-4.8 10.8-10.8 0-3.02-1.18-5.85-3.26-7.93zM12 21.1c-1.9 0-3.76-.5-5.34-1.44l-.38-.23-3.96 1.04 1.06-3.85-.24-.39A8.15 8.15 0 013.9 11.3c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.76 2.4a7.92 7.92 0 012.4 5.76c0 4.5-3.66 8.16-8.16 8.16z" />
          <path d="M17.6 14.2c-.3-.15-1.78-.88-2.05-.98-.27-.1-.46-.15-.65.15-.18.3-.7.98-.86 1.18-.16.2-.33.22-.62.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.28-.02-.43.13-.58.13-.13.3-.33.45-.5.15-.17.2-.28.3-.47.1-.19.05-.35-.02-.5-.07-.15-.65-1.56-.9-2.15-.24-.57-.49-.49-.67-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.27.28-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.1 4.48 2.99 1.28 3.02.85 3.56.8.54-.05 1.78-.72 2.03-1.41.25-.7.25-1.3.18-1.41-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </a>

      {isChatOpen && (
        <section className="fixed bottom-40 right-4 z-50 flex h-[min(31rem,calc(100vh-11rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950 shadow-2xl shadow-cyan-950/50" aria-label="Portfolio assistant">
          <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-400/10 px-4 py-3">
            <div className="flex items-center gap-2"><Bot size={18} className="text-cyan-300" /><div><p className="text-sm font-semibold text-white">Ehsan Assistant</p><p className="text-[11px] text-slate-400">Friendly portfolio &amp; solutions guide</p></div></div>
            <button type="button" onClick={() => setIsChatOpen(false)} className="text-slate-400 transition hover:text-white" aria-label="Close assistant"><X size={18} /></button>
          </div>
          <div ref={chatMessagesRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[90%] ${message.role === 'visitor' ? 'ml-auto' : ''}`}>
                <div className={`rounded-xl px-3 py-2 text-sm leading-6 ${message.role === 'visitor' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>{message.text}</div>
                {message.role === 'assistant' && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(message.actions ?? []).map((action) => (
                      <a
                        key={`${action.href}-${action.label}`}
                        href={action.href}
                        target={action.external ? '_blank' : undefined}
                        rel={action.external ? 'noopener noreferrer' : undefined}
                        onClick={() => { if (!action.external) setIsChatOpen(false); }}
                        className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-white"
                      >
                        {action.label}
                        {action.external && <ArrowUpRight size={12} aria-hidden="true" />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendChatMessage} className="flex gap-2 border-t border-cyan-500/20 p-3">
            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about a service..." className="min-w-0 flex-1 rounded-lg border border-cyan-500/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" aria-label="Ask the portfolio assistant" />
            <button type="submit" disabled={isChatSending} className="inline-flex min-w-12 items-center justify-center rounded-lg bg-cyan-400 px-3 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70" aria-label="Send message">{isChatSending ? <span className="text-xs font-semibold">Wait</span> : <Send size={16} />}</button>
          </form>
        </section>
      )}
      {showChatHint && !isChatOpen && <div className="fixed bottom-40 right-4 z-50 max-w-[15rem] rounded-xl border border-cyan-400/30 bg-slate-950 px-4 py-2.5 text-sm text-cyan-100 shadow-xl shadow-cyan-950/40">Need help choosing a service?</div>}
      <button type="button" onClick={() => { setIsChatOpen((open) => !open); setShowChatHint(false); }} className="fixed bottom-24 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-slate-950 text-cyan-300 shadow-lg shadow-cyan-950/40 transition hover:scale-105 hover:bg-cyan-400 hover:text-slate-950" aria-label="Open portfolio assistant">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}