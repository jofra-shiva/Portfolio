"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { chatbotSystemPrompt } from './chatbotKnowledge';
import { getPortfolioInfo, getSkills, getProjects } from '../../lib/db';
import logoImg from '../../../public/logo.png';
import './Chatbot.css';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''; // Add to .env.local

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<any[]>([ ]);
  const [projectsData, setProjectsData] = useState<any[]>([ ]);
  const [suggestionChips, setSuggestionChips] = useState<any[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, skillsRes, projectsRes] = await Promise.all([
          getPortfolioInfo(),
          getSkills(),
          getProjects()
        ]);
        if (portfolioRes) setPortfolioData(portfolioRes);
        if (skillsRes) setSkillsData(skillsRes);
        if (projectsRes) setProjectsData(projectsRes);
      } catch (err) {
        console.error('Error fetching data for chatbot fallback', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const name = portfolioData.name || 'Sivaprakash';
      setMessages([
        { text: `Hi there! I'm ${name}'s AI Assistant. What would you like to know about his experience, projects, or skills?`, sender: 'bot' }
      ]);
      setSuggestionChips([ 
        { text: `Who is ${name}?`, query: `Who is ${name}?`, icon: "🙋‍♂️" },
        { text: "Tell me about his projects", query: "Tell me about his projects", icon: "💻" },
        { text: "Tech stack & skills", query: "What are his tech stack & skills?", icon: "🛠" },
        { text: "Contact & Hire", query: "How can I contact him?", icon: "📞" }
      ]);
    } else {
      setMessages([
        { text: "Hi there! I'm Sivaprakash's AI Assistant. What would you like to know about his experience, projects, or skills?", sender: 'bot' }
      ]);
      setSuggestionChips([ 
        { text: "Who is Sivaprakash?", query: "Who is Sivaprakash M?", icon: "🙋‍♂️" },
        { text: "Tell me about his projects", query: "Tell me about his projects", icon: "💻" },
        { text: "Tech stack & skills", query: "What are his tech stack & skills?", icon: "🛠" },
        { text: "Contact & Hire", query: "How can I contact him?", icon: "📞" }
      ]);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'user') {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      } else {
        const lastEl = document.getElementById(`msg-${messages.length - 1}`);
        if (lastEl) {
          lastEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [messages, isOpen]);

  const handleSend = async (e, textOverride = null) => {
    e?.preventDefault();
    const currentInput = textOverride || input;
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setSuggestionChips([]); // Close suggestions on send
    setLoading(true);

    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('project') || lowerMsg.includes('work')) {
      if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
        const reply = "Here are the projects Sivaprakash has built:\n\n" + 
          projectsData.map(p => `🚀 **${p.title}**\n${p.description}`).join('\n\n') + 
          "\n\nYou can view them in detail in the Projects section below!";
        setTimeout(() => {
          setMessages(prev => [...prev, { text: reply, sender: 'bot', isProjectLink: true }]);
          setLoading(false);
        }, 400);
        return;
      }
    }

    if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('stack')) {
      let skillsFromProjects = [];
      if (projectsData && Array.isArray(projectsData)) {
        projectsData.forEach(p => {
          if (p.techStack && Array.isArray(p.techStack)) {
            skillsFromProjects = [...skillsFromProjects, ...p.techStack];
          }
        });
      }
      skillsFromProjects = [...new Set(skillsFromProjects)];

      let reply = "";
      if (skillsFromProjects.length > 0) {
        reply = `Sivaprakash has worked with the following technologies across his projects: ${skillsFromProjects.map(s => `**${s}**`).join(', ')}.`;
      } else if (skillsData?.length > 0) {
        reply = `Sivaprakash's skills: ${skillsData.map(s => `**${s.name}**`).join(', ')}`;
      } else {
        reply = "Sivaprakash specializes in the MERN stack: **MongoDB**, **Express.js**, **React**, and **Node.js**. He also has experience with **REST APIs** and modern **CSS**.";
      }
      setTimeout(() => {
        setMessages(prev => [...prev, { text: reply, sender: 'bot', isSkillsLink: true }]);
        setLoading(false);
      }, 400);
      return;
    }
    if (lowerMsg.includes('contact') || lowerMsg.includes('hire') || lowerMsg.includes('email') || lowerMsg.includes('instagram') || lowerMsg.includes('whatsapp') || lowerMsg.includes('telegram') || lowerMsg.includes('linkedin')) {
      const email = portfolioData?.email || "sivaprakash@example.com";
      const phone = portfolioData?.phone || "";
      const linkedin = portfolioData?.linkedin || "";
      const instagram = portfolioData?.instagram || "";
      const github = portfolioData?.github || "";
      const twitter = portfolioData?.twitter || "";
      const telegram = portfolioData?.telegram || "";

      let reply = "Here are the direct ways to contact Sivaprakash:\n\n";

      if (email) reply += `📧 **Email**: [Click to Send Email](mailto:${email})\n\n`;
      if (phone) reply += `📞 **Phone / WhatsApp**: [Message on WhatsApp](https://wa.me/${phone.replace(/\D/g, '')})\n\n`;
      if (linkedin) reply += `🔗 **LinkedIn**: [View LinkedIn Profile](${linkedin})\n\n`;
      if (instagram) reply += `📸 **Instagram**: [Visit Instagram](${instagram})\n\n`;
      if (github) reply += `💻 **GitHub**: [Browse GitHub](${github})\n\n`;
      if (telegram) reply += `✈️ **Telegram**: [Message on Telegram](${telegram})\n\n`;
      if (twitter) reply += `𝕏 **X (Twitter)**: [Visit Twitter](${twitter})\n\n`;

      if (!phone && !linkedin && !instagram && !telegram && !twitter) {
        reply += "Please feel free to connect or drop a message via email directly!";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { text: reply, sender: 'bot', isContactLink: true }]);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      if (!API_KEY) throw new Error('No API Key');

      const dynamicContext = `
About Sivaprakash (from database):
Name: ${portfolioData?.name || 'Sivaprakash M'}
Role: ${portfolioData?.role || 'Full Stack Developer / MCA Student'}
Summary: ${portfolioData?.summary || portfolioData?.about || ''}
Contact Email: ${portfolioData?.email || 'sivaprakash@example.com'}
Phone: ${portfolioData?.phone || ''}

Projects from Admin:
${projectsData?.map(p => `- ${p.title}: ${p.description}`).join('\n') || 'N/A'}

Skills from Admin:
${skillsData?.map(s => `- ${s.name} (${s.category || ''})`).join('\n') || 'N/A'}
      `;

      // Uses the deeply specialized knowledge base built for Sivaprakash
      const fullPrompt = `${chatbotSystemPrompt}\n\nAdditional Dynamic Info from Database:\n${dynamicContext}\n\nUser Message:\n${userMessage}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: fullPrompt 
              }] 
            }]
          })
        }
      );
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);
      
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (botText) {
        const isProj = userMessage.toLowerCase().includes('project');
        const isSkills = userMessage.toLowerCase().includes('skill') || userMessage.toLowerCase().includes('tech') || userMessage.toLowerCase().includes('stack');
        setMessages(prev => [...prev, { text: botText, sender: 'bot', isProjectLink: isProj, isSkillsLink: isSkills }]);
        return;
      }
    } catch (error) {
      // Fallback local logic if API fails or key is missing
      const msg = userMessage.toLowerCase();
      let reply = portfolioData?.summary || portfolioData?.about || "Sivaprakash M is an MCA student and MERN Stack Developer building responsive, user-first web applications. Feel free to check out his projects or use the contact form to reach out!";
      
      if (/\b(hi|hello|hey)\b/i.test(msg)) {
        reply = "Hi there! I'm Sivaprakash's AI Assistant. How can I help you explore his portfolio today?";
      } else if (/\b(number|phone|mobile|whatsapp|call)\b/i.test(msg)) {
        reply = portfolioData?.phone ? `You can reach Sivaprakash directly via phone/WhatsApp at: ${portfolioData.phone}` : `You can contact him via the contact form or LinkedIn!`;
      } else if (/\b(who|he|about)\b/i.test(msg)) {
        reply = portfolioData?.summary || portfolioData?.about || "Sivaprakash M is an MCA student and Full Stack Developer specializing in the MERN Stack. He loves building responsive, scalable, and premium web applications.";
      } else if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack')) {
        let skillsFromProjects = [];
        if (projectsData && Array.isArray(projectsData)) {
          projectsData.forEach(p => {
            if (p.techStack && Array.isArray(p.techStack)) {
              skillsFromProjects = [...skillsFromProjects, ...p.techStack];
            }
          });
        }
        skillsFromProjects = [...new Set(skillsFromProjects)];

        if (skillsFromProjects.length > 0) {
          reply = `Sivaprakash has worked with the following technologies across his projects: ${skillsFromProjects.join(', ')}.`;
        } else if (skillsData?.length > 0) {
          reply = `Sivaprakash's skills: ${skillsData.map(s => s.name).join(', ')}`;
        } else {
          reply = "Sivaprakash specializes in the MERN stack: MongoDB, Express.js, React, and Node.js. He also has experience with REST APIs and modern CSS.";
        }
      } else if (msg.includes('project') || msg.includes('work')) {
        if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
          reply = "Here are the projects Sivaprakash has built:\n\n" + 
            projectsData.map(p => `• ${p.title}: ${p.description}`).join('\n') + 
            "\n\nYou can view them in the Projects section below!";
        } else {
          reply = "Sivaprakash has built several high-quality full-stack applications. You can view them in the Projects section below!";
        }
      } else if (/\b(contact|hire|email)\b/i.test(msg)) {
        reply = portfolioData?.email ? `You can reach Sivaprakash via email at: ${portfolioData.email} or use the contact form.` : "You can contact Sivaprakash directly using the form below, or reach out to him via LinkedIn!";
      } else if (/\b(education|mca|study)\b/i.test(msg)) {
        reply = "Sivaprakash is currently pursuing his MCA and continuously building scalable full-stack applications.";
      }
      
      setTimeout(() => {
        const isProj = userMessage.toLowerCase().includes('project');
        const isSkills = userMessage.toLowerCase().includes('skill') || userMessage.toLowerCase().includes('tech') || userMessage.toLowerCase().includes('stack');
        setMessages(prev => [...prev, { text: reply, sender: 'bot', isProjectLink: isProj, isSkillsLink: isSkills }]);
      }, 500); // Small delay to feel natural
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="chatbot-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const titleMatch = part.match(/\[(.*?)\]/);
        const linkMatch = part.match(/\((.*?)\)/);
        if (titleMatch && linkMatch) {
          return (
            <a 
              key={index} 
              href={linkMatch[1]} 
              target="_blank" 
              rel="noreferrer" 
              className="chatbot-link"
            >
              {titleMatch[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <>
      <button 
        className={`chatbot-fab ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
        title="Chat with AI"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && <div className="chatbot-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className={`chatbot-window card ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-title">
            <div className="chatbot-header-logo">
              <img 
                src={logoImg.src} 
                alt="AI Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} 
              />
            </div>
            <div className="header-title-text">
              <span>{portfolioData?.name ? `${portfolioData.name.split(' ')[0]} AI` : 'Sivaprakash AI'}</span>
            </div>
          </div>
          <button className="icon-btn close-btn" onClick={() => setIsOpen(false)} title="Close Chat">
            <X size={18} />
          </button>
        </div>
        
        <div className="chatbot-messages" ref={messagesRef}>
          <div className="chatbot-spacer"></div>
          {messages.map((msg, index) => (
            <div key={index} id={`msg-${index}`} className={`chatbot-bubble ${msg.sender}`}>
              <div>{renderMessageText(msg.text)}</div>
              {msg.isProjectLink && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="projects-redirect-btn"
                >
                  📁 Go to Projects Section
                </button>
              )}
              {msg.isSkillsLink && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="projects-redirect-btn"
                >
                  🛠 Go to Skills Section
                </button>
              )}
              {msg.isContactLink && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="projects-redirect-btn"
                >
                  ✉️ Go to Contact Section
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="chatbot-bubble bot loading-bubble">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          )}
        </div>

        <div className="chatbot-bottom-container">
          {suggestionChips.length > 0 && isInputFocused && !loading && (
            <div className="chatbot-suggestions-menu">
              <div className="suggestion-menu-list">
                {suggestionChips.map((chip, index) => (
                  <button 
                    key={index} 
                    type="button" 
                    onClick={() => {
                      setSuggestionChips(prev => prev.filter(c => c.text !== chip.text));
                      handleSend(null, chip.query);
                    }} 
                    className="suggestion-menu-item"
                  >
                    <span className="suggestion-icon">{chip.icon}</span>
                    <span className="suggestion-text">{chip.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <div className="chatbot-input-wrapper">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                placeholder="Ask me anything..." 
                className="chatbot-text-input"
                disabled={loading}
              />
              <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || loading} aria-label="Send message">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
