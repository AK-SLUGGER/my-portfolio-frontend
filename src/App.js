import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "@/App.css";
import { 
  Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, 
  Target, Zap, Users, Shield, Bot, Trophy, ChevronDown, X, LogIn, Save,
  Settings, Palette, Type, Image, List, ClipboardList, Menu, ExternalLink,
  Download, Plus, Trash2, Edit3, Check, FileText, Eye, EyeOff, Layout,
  Layers, Sparkles, MessageSquare
} from "lucide-react";


const API = `${BACKEND_URL}/api`;
const BACKEND_URL = "https://web-production-b3b71.up.railway.app";
const iconMap = {
  "clipboard-list": ClipboardList,
  "target": Target,
  "bot": Bot,
  "award": Award,
  "trophy": Trophy,
  "sparkles": Sparkles
};

// Theme presets
const THEME_PRESETS = [
  { name: "Ocean Dark", primaryColor: "#0ea5e9", accentColor: "#22d3ee", backgroundColor: "#0a0a0a", textColor: "#ffffff" },
  { name: "Emerald Night", primaryColor: "#10b981", accentColor: "#34d399", backgroundColor: "#0a0a0a", textColor: "#ffffff" },
  { name: "Royal Purple", primaryColor: "#8b5cf6", accentColor: "#a78bfa", backgroundColor: "#0f0a1a", textColor: "#ffffff" },
  { name: "Sunset Gold", primaryColor: "#f59e0b", accentColor: "#fbbf24", backgroundColor: "#0a0a0a", textColor: "#ffffff" },
  { name: "Rose Elegance", primaryColor: "#f43f5e", accentColor: "#fb7185", backgroundColor: "#0a0a0a", textColor: "#ffffff" },
  { name: "Arctic Blue", primaryColor: "#3b82f6", accentColor: "#60a5fa", backgroundColor: "#050a18", textColor: "#e2e8f0" },
  { name: "Forest Deep", primaryColor: "#059669", accentColor: "#6ee7b7", backgroundColor: "#021a0a", textColor: "#d1fae5" },
  { name: "Warm Light", primaryColor: "#ea580c", accentColor: "#f97316", backgroundColor: "#fffbf5", textColor: "#1a1a1a" },
  { name: "Clean Light", primaryColor: "#2563eb", accentColor: "#3b82f6", backgroundColor: "#ffffff", textColor: "#111827" },
  { name: "Soft Lavender", primaryColor: "#7c3aed", accentColor: "#8b5cf6", backgroundColor: "#faf5ff", textColor: "#1e1b4b" },
  { name: "Mint Fresh", primaryColor: "#0d9488", accentColor: "#14b8a6", backgroundColor: "#f0fdfa", textColor: "#134e4a" },
  { name: "Slate Professional", primaryColor: "#475569", accentColor: "#64748b", backgroundColor: "#f8fafc", textColor: "#0f172a" },
];

const DISPLAY_FONTS = [
  "Space Grotesk", "Playfair Display", "Montserrat", "Poppins", "Raleway", 
  "Oswald", "DM Serif Display", "Bitter", "Crimson Text", "Libre Baskerville"
];

const BODY_FONTS = [
  "Inter", "Open Sans", "Lato", "Source Sans Pro", "Nunito", 
  "Work Sans", "DM Sans", "Rubik", "Karla", "Manrope"
];

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [activeNav, setActiveNav] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("theme");
  const [editingExp, setEditingExp] = useState(null);
  const [editingRec, setEditingRec] = useState(null);
  const [showFormspreeSetup, setShowFormspreeSetup] = useState(false);
  const [formspreeId, setFormspreeId] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/profile`);
      setProfile(response.data);
      setEditedProfile(JSON.parse(JSON.stringify(response.data)));
    } catch (e) {
      console.error("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    const token = localStorage.getItem("admin_token");
    if (token) setIsLoggedIn(true);
  }, [fetchProfile]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "skills", "education", "achievements", "recommendations", "certifications", "contact"];
      const scrollY = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveNav(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post(`${API}/auth/login`, loginForm);
      if (response.data.success) {
        localStorage.setItem("admin_token", response.data.token);
        setIsLoggedIn(true);
        setShowLogin(false);
        setShowAdmin(true);
      }
    } catch (e) {
      setLoginError(e.response?.data?.detail || "Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    setShowAdmin(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus({ type: "", message: "" });
    try {
      const response = await axios.post(`${API}/contact/submit`, contactForm);
      if (response.data.success) {
        setContactStatus({ type: "success", message: response.data.message });
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setContactStatus({ type: "error", message: response.data.message });
      }
    } catch (e) {
      setContactStatus({ type: "error", message: e.response?.data?.detail || "Failed to send message. Please try again." });
    } finally {
      setContactLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    try {
      const response = await axios.post(`${API}/profile`, editedProfile);
      if (response.data.success) {
        setProfile(JSON.parse(JSON.stringify(editedProfile)));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    } catch (e) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const updateTheme = (key, value) => {
    setEditedProfile(prev => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  };

  const applyPreset = (preset) => {
    setEditedProfile(prev => ({
      ...prev,
      theme: { ...prev.theme, ...preset }
    }));
  };

  const updateHeroStats = (key, value) => {
    setEditedProfile(prev => ({ ...prev, heroStats: { ...prev.heroStats, [key]: value } }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${API}/upload/image`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.data.success) {
        setEditedProfile(prev => ({ ...prev, profileImage: response.data.imageUrl }));
      }
    } catch (e) {
      console.error("Upload error:", e);
    }
  };

  // Experience CRUD
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "New Position",
      company: "Company Name",
      location: "Location",
      period: "Start – End",
      current: false,
      description: ["Describe your responsibilities and achievements."]
    };
    setEditedProfile(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp]
    }));
    setEditingExp(newExp.id);
  };

  const updateExperience = (id, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const deleteExperience = (id) => {
    setEditedProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const moveExperience = (id, direction) => {
    setEditedProfile(prev => {
      const exps = [...prev.experiences];
      const idx = exps.findIndex(e => e.id === id);
      if ((direction === -1 && idx === 0) || (direction === 1 && idx === exps.length - 1)) return prev;
      [exps[idx], exps[idx + direction]] = [exps[idx + direction], exps[idx]];
      return { ...prev, experiences: exps };
    });
  };

  // Recommendation CRUD
  const addRecommendation = () => {
    const newRec = {
      id: Date.now().toString(),
      name: "Name",
      role: "Role / Company",
      text: "Recommendation text...",
      initials: "XX"
    };
    setEditedProfile(prev => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), newRec]
    }));
    setEditingRec(newRec.id);
  };

  const updateRecommendation = (id, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(rec => {
        if (rec.id !== id) return rec;
        const updated = { ...rec, [field]: value };
        if (field === "name") {
          const parts = value.split(" ");
          updated.initials = parts.length >= 2 
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
            : value.substring(0, 2).toUpperCase();
        }
        return updated;
      })
    }));
  };

  const deleteRecommendation = (id) => {
    setEditedProfile(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.id !== id)
    }));
  };

  const handleFormspreeSetup = async () => {
    if (!formspreeId.trim()) return;
    try {
      await axios.post(`${API}/settings/formspree`, { formId: formspreeId.trim() });
      setShowFormspreeSetup(false);
    } catch (e) {
      console.error("Formspree setup error:", e);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Portfolio...</p>
      </div>
    );
  }

  const theme = profile?.theme || {};
  const isLightBg = theme.backgroundColor && parseInt(theme.backgroundColor.replace('#',''), 16) > 0x888888;

  return (
    <div 
      className={`portfolio-app ${isLightBg ? 'light-mode' : ''}`}
      style={{
        "--primary-color": theme.primaryColor || "#0ea5e9",
        "--accent-color": theme.accentColor || "#22d3ee",
        "--bg-color": theme.backgroundColor || "#0a0a0a",
        "--text-color": theme.textColor || "#ffffff",
        "--display-font": `'${theme.displayFont || "Space Grotesk"}', sans-serif`,
        "--body-font": `'${theme.bodyFont || "Inter"}', sans-serif`,
        "--font-size": `${theme.fontSize || 16}px`,
        "--card-bg": isLightBg ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
        "--border-color": isLightBg ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
        "--text-muted": isLightBg ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)"
      }}
    >
      {/* Navigation */}
      <nav className="main-nav" data-testid="main-nav">
        <div className="nav-container">
          <a href="#" className="nav-logo">AY</a>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </button>
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            {["about", "experience", "skills", "achievements", "recommendations", "contact"].map(section => (
              <a key={section} href={`#${section}`} className={activeNav === section ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <button className="admin-btn" onClick={() => setShowAdmin(true)} data-testid="admin-panel-btn"><Settings size={18} /></button>
                <button className="logout-btn" onClick={handleLogout} data-testid="logout-btn">Logout</button>
              </>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)} data-testid="login-btn"><LogIn size={18} /> Admin</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-badge"><span className="badge-dot"></span>Open to New Opportunities · Germany</div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-name">{profile?.name || "Abhishek Yadav"}</h1>
            <h2 className="hero-title">{profile?.title || "Supply Chain & Operations Manager"}</h2>
            <p className="hero-subtitle">{profile?.heroSubtitle}</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">{profile?.heroStats?.yearsExp || "5+"}</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile?.heroStats?.leadTimeCut || "53%"}</span>
                <span className="stat-label">Lead Time Cut</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile?.heroStats?.teamLed || "150+"}</span>
                <span className="stat-label">Team Led</span>
              </div>
            </div>
            <div className="hero-cta">
              <a href="#contact" className="cta-primary" data-testid="get-in-touch-btn">Get in Touch</a>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="cta-resume" data-testid="download-resume-btn">
                  <Download size={18} /> Download CV
                </a>
              )}
              <a href="https://linkedin.com/in/abhishek-yadav-535219150" target="_blank" rel="noopener noreferrer" className="cta-secondary">
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
            <div className="hero-tags">
              <span><Globe size={14} /> EU Blue Card</span>
              <span><MapPin size={14} /> Konstanz, Germany</span>
              <span className="tag-highlight"><Zap size={14} /> Open to Work</span>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-frame">
              <img src={profile?.profileImage || "https://abhishekyadav.de/Image_Abhishek.png"} alt={profile?.name || "Abhishek Yadav"}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div className="image-fallback" style={{display: 'none'}}>AY</div>
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-indicator"><ChevronDown size={24} /></a>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section" data-testid="about-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Supply Chain Strategist & Operations Expert</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              {(profile?.aboutText || "").split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="about-info">
              <div className="info-card"><Mail size={20} /><div><span className="info-label">Email</span><a href="mailto:raoabhi001@gmail.com">raoabhi001@gmail.com</a></div></div>
              <div className="info-card"><Phone size={20} /><div><span className="info-label">Phone</span><a href="tel:+4917623663701">+49 176 23663701</a></div></div>
              <div className="info-card"><MapPin size={20} /><div><span className="info-label">Location</span><span>78462 Konstanz, Germany</span></div></div>
              <div className="info-card"><Linkedin size={20} /><div><span className="info-label">LinkedIn</span><a href="https://linkedin.com/in/abhishek-yadav-535219150" target="_blank" rel="noopener noreferrer">abhishek-yadav-535219150</a></div></div>
              <div className="info-card"><Globe size={20} /><div><span className="info-label">Languages</span><span>English (Fluent) · Hindi (Native) · German (B1)</span></div></div>
            </div>
          </div>
          <div className="about-highlights">
            <div className="highlight-card"><Briefcase size={24} /><h4>Current Role</h4><p>Operations Manager — RIVAFY (Connect) Germany GmbH, Konstanz · Jan 2025 to Present</p></div>
            <div className="highlight-card"><GraduationCap size={24} /><h4>MBA — Supply Chain Management</h4><p>IU International University of Applied Sciences, Berlin (2024–2025).</p></div>
            <div className="highlight-card"><Bot size={24} /><h4>AI & Tech Expertise</h4><p>Prompt Engineering (ChatGPT, Claude, Gemini) · Vibe Coding · SAP S/4HANA · WMS · Advanced Excel</p></div>
            <div className="highlight-card"><Shield size={24} /><h4>Work Authorisation</h4><p>EU Blue Card — Germany (valid, unrestricted work rights). Open to On-site & Hybrid roles.</p></div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section experience-section" data-testid="experience-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Career Journey</span>
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-desc">5+ years across Germany and India in supply chain, warehouse management, transportation logistics, and e-commerce fulfilment.</p>
          </div>
          <div className="timeline">
            {profile?.experiences?.map((exp, index) => (
              <div key={exp.id || index} className={`timeline-item ${exp.current ? 'current' : ''}`}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div><h3>{exp.title}</h3><p className="company">{exp.company}</p></div>
                    <div className="timeline-meta">
                      <span className="period">{exp.period}</span>
                      <span className="location"><MapPin size={14} /> {exp.location}</span>
                    </div>
                  </div>
                  <ul className="timeline-points">
                    {exp.description?.map((point, i) => (<li key={i}>{point}</li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills-section" data-testid="skills-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">Skills & Competencies</h2>
          </div>
          <div className="skills-grid">
            {[
              { title: "Operations & Logistics", skills: ["Supply Chain Management", "Warehouse Operations", "Intralogistics", "First/Middle/Last Mile", "Cross-Border Logistics", "Reverse Logistics", "Inventory Management", "Order Fulfilment", "Vendor Management"] },
              { title: "Planning & Improvement", skills: ["S&OP Planning", "Demand Forecasting", "Kaizen", "5S Implementation", "Lean Operations", "KPI Tracking", "MIS Reporting", "Strategic Planning", "Six Sigma Black Belt"] },
              { title: "Systems & Tools", skills: ["SAP S/4HANA", "WMS (JTL, META pixi)", "TMS", "ERP", "CRM", "MS Excel (Advanced)", "OTIF & SLA Monitoring"] },
              { title: "AI & Tech Skills", skills: ["Prompt Engineering", "Vibe Coding", "ChatGPT", "Claude AI", "Gemini", "AI Workflow Automation", "MIS Automation"] },
              { title: "Leadership & Languages", skills: ["Team Leadership (150+)", "Cross-functional Coordination", "Escalation Management", "Performance Coaching", "English (Fluent)", "Hindi (Native)", "German (B1)"] }
            ].map(cat => (
              <div key={cat.title} className="skill-category">
                <h4>{cat.title}</h4>
                <div className="skill-tags">{cat.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section education-section" data-testid="education-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Education</span>
            <h2 className="section-title">Academic Background</h2>
          </div>
          <div className="education-cards">
            <div className="education-card">
              <div className="edu-icon"><GraduationCap size={32} /></div>
              <div className="edu-content">
                <h3>MBA – Supply Chain Management</h3>
                <p className="edu-institution">IU International University of Applied Sciences, Berlin</p>
                <p className="edu-period">Jun 2024 – Mar 2025</p>
                <p className="edu-desc">Supply Chain Strategy, Procurement, Logistics Network Design, Operations Management. Thesis: Blockchain for Returns Management.</p>
              </div>
            </div>
            <div className="education-card">
              <div className="edu-icon"><GraduationCap size={32} /></div>
              <div className="edu-content">
                <h3>B.Tech – Mechanical Engineering</h3>
                <p className="edu-institution">Global Institute of Technology & Management, Gurgaon</p>
                <p className="edu-period">Jul 2013 – Aug 2017</p>
                <p className="edu-desc">Engineering fundamentals, quality control systems, lean production methodologies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="section achievements-section" data-testid="achievements-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Key Achievements</span>
            <h2 className="section-title">What I've Delivered</h2>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card"><Zap size={32} /><h4>53% Delivery Lead Time Cut</h4><p>Re-engineered supply chain at RIVAFY — from 15 days down to 7 days.</p></div>
            <div className="achievement-card"><Trophy size={32} /><h4>99% On-Time Pickup Rate</h4><p>Highest-performing site regionally at Mahindra Logistics.</p></div>
            <div className="achievement-card"><Target size={32} /><h4>100% Seller Pickup Growth</h4><p>Doubled pickup points 60→120 via Kaizen. Regional benchmark.</p></div>
            <div className="achievement-card"><Award size={32} /><h4>90% Return Loss Reduction</h4><p>Redesigned reverse shipment processes, recovering significant annual cost.</p></div>
            <div className="achievement-card"><Users size={32} /><h4>150+ Team Leadership</h4><p>Led cross-functional teams across warehouse, transport, and customer-facing operations.</p></div>
            <div className="achievement-card"><Shield size={32} /><h4>40% Accident Reduction</h4><p>Designed site-wide safety programme with daily audits and hazard reporting.</p></div>
            <div className="achievement-card"><Bot size={32} /><h4>Prompt Engineering & Vibe Coding</h4><p>Builds AI-powered operational tools — automating MIS, workflows, and reporting.</p></div>
            <div className="achievement-card highlight"><Trophy size={32} /><h4>Uday Award – Champion of the Month</h4><p>Recognised by Mahindra Logistics for outstanding operational leadership (Sep 2021).</p></div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="recommendations" className="section recommendations-section" data-testid="recommendations-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">What People Say</span>
            <h2 className="section-title">Recommendations</h2>
          </div>
          <div className="recommendations-grid">
            {profile?.recommendations?.map((rec, index) => (
              <div key={rec.id || index} className="recommendation-card">
                <div className="quote-icon">"</div>
                <p className="rec-text">{rec.text}</p>
                <div className="rec-author">
                  <div className="author-avatar">{rec.initials}</div>
                  <div><h5>{rec.name}</h5><span>{rec.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section certifications-section" data-testid="certifications-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Certifications</span>
            <h2 className="section-title">Professional Development</h2>
          </div>
          <div className="certifications-grid">
            {profile?.certifications?.map((cert, index) => {
              const IconComponent = iconMap[cert.icon] || Award;
              return (
                <div key={cert.id || index} className="certification-card">
                  <IconComponent size={28} />
                  <div><h4>{cert.title}</h4><p>{cert.issuer} · {cert.period}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section" data-testid="contact-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Let's Work Together</h2>
            <p className="section-desc">Open to opportunities in Germany. Always curious, always improving — let's connect and drive the future of logistics together.</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <a href="mailto:raoabhi001@gmail.com" className="contact-card"><Mail size={24} /><div><span className="contact-label">Email</span><span className="contact-value">raoabhi001@gmail.com</span></div></a>
              <a href="tel:+4917623663701" className="contact-card"><Phone size={24} /><div><span className="contact-label">Phone</span><span className="contact-value">+49 176 23663701</span></div></a>
              <a href="https://linkedin.com/in/abhishek-yadav-535219150" target="_blank" rel="noopener noreferrer" className="contact-card"><Linkedin size={24} /><div><span className="contact-label">LinkedIn</span><span className="contact-value">abhishek-yadav-535219150</span></div><ExternalLink size={16} /></a>
              <div className="contact-card"><MapPin size={24} /><div><span className="contact-label">Location</span><span className="contact-value">78462 Konstanz, Germany</span></div></div>
            </div>
            <div className="contact-form-wrapper">
              <h3>Send a Message</h3>
              {contactStatus.message && <div className={`form-status ${contactStatus.type}`} data-testid="contact-status">{contactStatus.message}</div>}
              <form onSubmit={handleContactSubmit} className="contact-form" data-testid="contact-form">
                <div className="form-group"><label htmlFor="name">Your Name</label><input type="text" id="name" value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter your name" required disabled={contactLoading} data-testid="contact-name-input" /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Enter your email" required disabled={contactLoading} data-testid="contact-email-input" /></div>
                <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Your message (minimum 10 characters)" rows="5" required minLength={10} disabled={contactLoading} data-testid="contact-message-input" /></div>
                <button type="submit" className="submit-btn" disabled={contactLoading} data-testid="contact-submit-btn">{contactLoading ? "Sending..." : "Send Message"}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Abhishek Yadav. All rights reserved.</p>
          <div className="footer-links">
            <a href="https://linkedin.com/in/abhishek-yadav-535219150" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            <a href="mailto:raoabhi001@gmail.com"><Mail size={20} /></a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)} data-testid="login-modal">
          <div className="modal login-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}><X size={24} /></button>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              {loginError && <div className="form-error" data-testid="login-error">{loginError}</div>}
              <div className="form-group"><label>Email</label><input type="email" value={loginForm.email} onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))} required data-testid="login-email-input" /></div>
              <div className="form-group"><label>Password</label><input type="password" value={loginForm.password} onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))} required data-testid="login-password-input" /></div>
              <button type="submit" className="submit-btn" data-testid="login-submit-btn">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowAdmin(false)} data-testid="admin-modal">
          <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-header">
              <h2><Settings size={24} /> Admin Panel</h2>
              <div className="admin-actions">
                <button className={`save-btn ${saveStatus}`} onClick={handleSaveProfile} disabled={saveStatus === "saving"} data-testid="save-changes-btn">
                  <Save size={18} />{saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error!" : "Save Changes"}
                </button>
                <button className="close-btn" onClick={() => setShowAdmin(false)}><X size={24} /></button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="admin-tabs">
              {[
                { key: "theme", icon: <Palette size={16} />, label: "Theme" },
                { key: "content", icon: <Type size={16} />, label: "Content" },
                { key: "experience", icon: <Briefcase size={16} />, label: "Experience" },
                { key: "recommendations", icon: <MessageSquare size={16} />, label: "Recommendations" },
                { key: "media", icon: <Image size={16} />, label: "Media" },
                { key: "settings", icon: <Settings size={16} />, label: "Settings" },
              ].map(tab => (
                <button key={tab.key} className={`admin-tab ${adminTab === tab.key ? 'active' : ''}`} onClick={() => setAdminTab(tab.key)} data-testid={`admin-tab-${tab.key}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="admin-content">
              {/* Theme Tab */}
              {adminTab === "theme" && (
                <>
                  <div className="admin-section">
                    <h3><Sparkles size={20} /> Theme Presets</h3>
                    <div className="presets-grid">
                      {THEME_PRESETS.map((preset, i) => (
                        <button key={i} className="preset-btn" onClick={() => applyPreset(preset)} data-testid={`preset-${i}`}
                          style={{ background: `linear-gradient(135deg, ${preset.backgroundColor} 0%, ${preset.backgroundColor} 50%, ${preset.primaryColor} 100%)` }}>
                          <span className="preset-dot" style={{ background: preset.primaryColor }}></span>
                          <span className="preset-name" style={{ color: preset.textColor }}>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3><Palette size={20} /> Custom Colors</h3>
                    <div className="settings-grid">
                      {[
                        { key: "primaryColor", label: "Primary Color" },
                        { key: "accentColor", label: "Accent Color" },
                        { key: "backgroundColor", label: "Background" },
                        { key: "textColor", label: "Text Color" }
                      ].map(({ key, label }) => (
                        <div key={key} className="setting-item">
                          <label>{label}</label>
                          <div className="color-input">
                            <input type="color" value={editedProfile?.theme?.[key] || "#000"} onChange={(e) => updateTheme(key, e.target.value)} data-testid={`${key}-input`} />
                            <input type="text" value={editedProfile?.theme?.[key] || ""} onChange={(e) => updateTheme(key, e.target.value)} className="color-text-input" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3><Type size={20} /> Typography</h3>
                    <div className="settings-grid">
                      <div className="setting-item">
                        <label>Display Font</label>
                        <select value={editedProfile?.theme?.displayFont || "Space Grotesk"} onChange={(e) => updateTheme("displayFont", e.target.value)} data-testid="display-font-select">
                          {DISPLAY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="setting-item">
                        <label>Body Font</label>
                        <select value={editedProfile?.theme?.bodyFont || "Inter"} onChange={(e) => updateTheme("bodyFont", e.target.value)} data-testid="body-font-select">
                          {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="setting-item full-width">
                        <label>Base Font Size: {editedProfile?.theme?.fontSize || 16}px</label>
                        <input type="range" min="12" max="22" value={editedProfile?.theme?.fontSize || 16} onChange={(e) => updateTheme("fontSize", parseInt(e.target.value))} data-testid="font-size-slider" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Content Tab */}
              {adminTab === "content" && (
                <>
                  <div className="admin-section">
                    <h3><List size={20} /> Hero Stats</h3>
                    <div className="settings-grid">
                      <div className="setting-item"><label>Years Experience</label><input type="text" value={editedProfile?.heroStats?.yearsExp || ""} onChange={(e) => updateHeroStats("yearsExp", e.target.value)} data-testid="years-exp-input" /></div>
                      <div className="setting-item"><label>Lead Time Cut</label><input type="text" value={editedProfile?.heroStats?.leadTimeCut || ""} onChange={(e) => updateHeroStats("leadTimeCut", e.target.value)} data-testid="lead-time-input" /></div>
                      <div className="setting-item"><label>Team Led</label><input type="text" value={editedProfile?.heroStats?.teamLed || ""} onChange={(e) => updateHeroStats("teamLed", e.target.value)} data-testid="team-led-input" /></div>
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3>Name & Title</h3>
                    <div className="settings-grid">
                      <div className="setting-item"><label>Full Name</label><input type="text" value={editedProfile?.name || ""} onChange={(e) => setEditedProfile(p => ({...p, name: e.target.value}))} data-testid="name-input" /></div>
                      <div className="setting-item"><label>Job Title</label><input type="text" value={editedProfile?.title || ""} onChange={(e) => setEditedProfile(p => ({...p, title: e.target.value}))} data-testid="title-input" /></div>
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3>Hero Subtitle</h3>
                    <textarea value={editedProfile?.heroSubtitle || ""} onChange={(e) => setEditedProfile(p => ({ ...p, heroSubtitle: e.target.value }))} rows="2" data-testid="hero-subtitle-input" />
                  </div>
                  <div className="admin-section">
                    <h3>About Text</h3>
                    <textarea value={editedProfile?.aboutText || ""} onChange={(e) => setEditedProfile(p => ({ ...p, aboutText: e.target.value }))} rows="8" data-testid="about-text-input" />
                  </div>
                </>
              )}

              {/* Experience Tab */}
              {adminTab === "experience" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h3><Briefcase size={20} /> Experiences ({editedProfile?.experiences?.length || 0})</h3>
                    <button className="add-btn" onClick={addExperience} data-testid="add-experience-btn"><Plus size={16} /> Add</button>
                  </div>
                  <div className="editable-list">
                    {editedProfile?.experiences?.map((exp, idx) => (
                      <div key={exp.id} className={`editable-card ${editingExp === exp.id ? 'editing' : ''}`}>
                        <div className="editable-card-header">
                          <div className="card-order-btns">
                            <button onClick={() => moveExperience(exp.id, -1)} disabled={idx === 0} title="Move Up">&#9650;</button>
                            <button onClick={() => moveExperience(exp.id, 1)} disabled={idx === editedProfile.experiences.length - 1} title="Move Down">&#9660;</button>
                          </div>
                          <div className="card-info">
                            <strong>{exp.title}</strong>
                            <span>{exp.company}</span>
                          </div>
                          <div className="card-actions">
                            <button onClick={() => setEditingExp(editingExp === exp.id ? null : exp.id)} data-testid={`edit-exp-${exp.id}`}>
                              {editingExp === exp.id ? <Check size={16} /> : <Edit3 size={16} />}
                            </button>
                            <button className="delete-btn" onClick={() => deleteExperience(exp.id)} data-testid={`delete-exp-${exp.id}`}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        {editingExp === exp.id && (
                          <div className="editable-card-body">
                            <div className="edit-row"><label>Title</label><input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} /></div>
                            <div className="edit-row"><label>Company</label><input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} /></div>
                            <div className="edit-row-half">
                              <div className="edit-row"><label>Location</label><input value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} /></div>
                              <div className="edit-row"><label>Period</label><input value={exp.period} onChange={(e) => updateExperience(exp.id, "period", e.target.value)} /></div>
                            </div>
                            <div className="edit-row">
                              <label>
                                <input type="checkbox" checked={exp.current || false} onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} /> Current Position
                              </label>
                            </div>
                            <div className="edit-row">
                              <label>Description (one bullet per line)</label>
                              <textarea value={(exp.description || []).join('\n')} onChange={(e) => updateExperience(exp.id, "description", e.target.value.split('\n'))} rows="6" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {adminTab === "recommendations" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h3><MessageSquare size={20} /> Recommendations ({editedProfile?.recommendations?.length || 0})</h3>
                    <button className="add-btn" onClick={addRecommendation} data-testid="add-recommendation-btn"><Plus size={16} /> Add</button>
                  </div>
                  <div className="editable-list">
                    {editedProfile?.recommendations?.map((rec) => (
                      <div key={rec.id} className={`editable-card ${editingRec === rec.id ? 'editing' : ''}`}>
                        <div className="editable-card-header">
                          <div className="author-avatar small">{rec.initials}</div>
                          <div className="card-info">
                            <strong>{rec.name}</strong>
                            <span>{rec.role}</span>
                          </div>
                          <div className="card-actions">
                            <button onClick={() => setEditingRec(editingRec === rec.id ? null : rec.id)} data-testid={`edit-rec-${rec.id}`}>
                              {editingRec === rec.id ? <Check size={16} /> : <Edit3 size={16} />}
                            </button>
                            <button className="delete-btn" onClick={() => deleteRecommendation(rec.id)} data-testid={`delete-rec-${rec.id}`}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        {editingRec === rec.id && (
                          <div className="editable-card-body">
                            <div className="edit-row-half">
                              <div className="edit-row"><label>Name</label><input value={rec.name} onChange={(e) => updateRecommendation(rec.id, "name", e.target.value)} /></div>
                              <div className="edit-row"><label>Role</label><input value={rec.role} onChange={(e) => updateRecommendation(rec.id, "role", e.target.value)} /></div>
                            </div>
                            <div className="edit-row"><label>Recommendation Text</label><textarea value={rec.text} onChange={(e) => updateRecommendation(rec.id, "text", e.target.value)} rows="5" /></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {adminTab === "media" && (
                <>
                  <div className="admin-section">
                    <h3><Image size={20} /> Profile Image</h3>
                    <div className="image-upload">
                      <div className="current-image"><img src={editedProfile?.profileImage} alt="Profile" /></div>
                      <div className="upload-controls">
                        <input type="file" id="profile-image" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} data-testid="image-upload-input" />
                        <label htmlFor="profile-image" className="upload-btn"><Image size={18} /> Upload New Image</label>
                        <p className="upload-hint">JPEG, PNG or WebP. Max 5MB.</p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3><FileText size={20} /> Resume / CV</h3>
                    <div className="resume-setting">
                      <div className="setting-item full-width">
                        <label>Resume URL</label>
                        <input type="text" value={editedProfile?.resumeUrl || ""} onChange={(e) => setEditedProfile(p => ({...p, resumeUrl: e.target.value}))} placeholder="https://... or upload PDF" data-testid="resume-url-input" />
                      </div>
                      {editedProfile?.resumeUrl && (
                        <a href={editedProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="preview-resume-btn"><Eye size={16} /> Preview CV</a>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Settings Tab */}
              {adminTab === "settings" && (
                <>
                  <div className="admin-section">
                    <h3><Mail size={20} /> Formspree Setup</h3>
                    <p className="setting-desc">Connect Formspree to receive contact form emails. Create a free form at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer">formspree.io</a></p>
                    <div className="settings-grid">
                      <div className="setting-item">
                        <label>Formspree Form ID</label>
                        <input type="text" value={formspreeId} onChange={(e) => setFormspreeId(e.target.value)} placeholder="e.g. xpzbbgrn" data-testid="formspree-id-input" />
                      </div>
                      <div className="setting-item" style={{justifyContent: "flex-end"}}>
                        <button className="add-btn" onClick={handleFormspreeSetup} data-testid="save-formspree-btn"><Save size={16} /> Save Formspree ID</button>
                      </div>
                    </div>
                  </div>
                  <div className="admin-section">
                    <h3><MessageSquare size={20} /> Recent Messages</h3>
                    <p className="setting-desc">Contact form submissions are saved to the database and forwarded via Formspree.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
