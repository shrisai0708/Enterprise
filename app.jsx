const { useState, useCallback, useMemo, useEffect } = React;

const SUPABASE_URL = 'https://zrgsdrytmtngsbrhszep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ3Nkcnl0bXRuZ3NicmhzemVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk0MzAsImV4cCI6MjA5Mjg2NTQzMH0.IQhnbgrw2Ti0h3mUbQZ7doy3uQoQrrrRfutWtBxCTIE';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Component
const AuthUI = ({ session, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [msg, setMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (authData?.user) {
          await supabase.from('profiles').update({ full_name: fullName }).eq('id', authData.user.id);
        }
        setMsg('Account created! You can now log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMsg(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (session) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5' }}>
      <FontLoader />
      {onBack && (
        <button onClick={onBack} style={{ position: 'absolute', top: 30, left: 40, background: 'white', border: '1px solid #e5e7eb', color: '#047857', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          ← Back to Home
        </button>
      )}
      <div style={{ background: 'white', padding: 40, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: 400 }}>
        <h2 className="fd" style={{ fontSize: '1.5rem', marginBottom: 20 }}>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
              <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 14 }} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 14 }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#0d1117', color: 'white', border: 'none', padding: '12px', borderRadius: 6, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        {msg && <p style={{ marginTop: 16, fontSize: 13, color: msg.includes('error')||msg.includes('Invalid') ? '#b91c1c' : '#047857' }}>{msg}</p>}
        <p style={{ marginTop: 24, fontSize: 13, textAlign: 'center', color: '#6b7280' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsSignUp(!isSignUp); setMsg(''); }} style={{ background: 'none', border: 'none', color: '#0d1117', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; color: #0d1117; -webkit-font-smoothing: antialiased; }
    .fd { font-family: 'Libre Baskerville', serif; letter-spacing: -0.02em; }
    .fdi { font-family: 'Libre Baskerville', serif; font-style: italic; letter-spacing: -0.02em; }
    * { box-sizing: border-box; }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes subtleZoom {
      0% { transform: scale(0.98); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes subtleBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-zoom { animation: subtleZoom 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(4, 120, 87, 0.15);
      box-shadow: 0 4px 24px rgba(4, 120, 87, 0.05);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(4, 120, 87, 0.12);
      border: 1px solid rgba(4, 120, 87, 0.3);
    }
  `}}/>
);

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  ink:'#0d1117', ink2:'#1c2128', muted:'#6b7280', faint:'#9ca3af',
  border:'#e5e7eb', surface:'#ffffff', surfaceMuted:'#f8f7f5', red:'#b91c1c',
  dark:'#080c0a',
};

const GREEN_THEME = {
  bg:'#022c22', bg2:'#064e3b', accent:'#047857', mid:'#10b981',
  highlight:'#d1fae5', text:'#a7f3d0', border:'rgba(167,243,208,0.18)',
  btn:'#047857', btnHover:'#065f46',
};

const THEMES = {
  analytics: GREEN_THEME, esg: GREEN_THEME, dei: GREEN_THEME, dpdp: GREEN_THEME, aiGov: GREEN_THEME,
};

// ─── SHARED DATA ──────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { value:'bfsi',          label:'BFSI (Banking, Financial Services & Insurance)' },
  { value:'it',            label:'IT & ITeS (Technology & Software)' },
  { value:'telecom',       label:'Telecom & Media' },
  { value:'retail',        label:'Retail & E-commerce' },
  { value:'fmcg',          label:'FMCG & Consumer Goods' },
  { value:'manufacturing', label:'Manufacturing & Engineering' },
  { value:'healthcare',    label:'Healthcare & Pharma / Life Sciences' },
  { value:'logistics',     label:'Logistics & Supply Chain' },
  { value:'auto',          label:'Auto & Auto Components' },
  { value:'energy',        label:'Energy & Utilities' },
  { value:'realestate',    label:'Real Estate & Infrastructure' },
  { value:'education',     label:'Education & EdTech' },
  { value:'agriculture',   label:'Agriculture & Agritech' },
  { value:'government',    label:'Government & PSU' },
];
const SIZES = [
  { value:1, name:'Micro',      range:'Less than ₹5 Crore' },
  { value:2, name:'Small',      range:'₹5 Cr – ₹50 Cr' },
  { value:3, name:'Medium',     range:'₹50 Cr – ₹250 Cr' },
  { value:4, name:'Large',      range:'₹250 Cr – ₹1,000 Cr' },
  { value:5, name:'Very Large', range:'More than ₹1,000 Crore' },
];
const SCALE = ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'];
const LEVEL_COLORS = ['#9ca3af','#ea580c','#d97706','#059669','#022c22'];
const LEVEL_BG     = ['#f3f4f6','#fff7ed','#fffbeb','#d1fae5','#022c22'];
const LEVEL_TEXT   = ['#374151','#9a3412','#92400e','#065f46','#a7f3d0'];

function getLevel(score, descs) {
  const ranges = [[1,1.8],[1.8,2.6],[2.6,3.4],[3.4,4.2],[4.2,5.1]];
  const names  = ['Nascent','Emerging','Developing','Advanced','Leading'];
  const i = Math.max(0, ranges.findIndex(([lo,hi]) => score >= lo && score < hi));
  const idx = i === -1 ? 0 : i;
  return { level:idx+1, name:names[idx], color:LEVEL_COLORS[idx], description:descs[idx] };
}
function getBenchmark(config, industry, size) {
  const vl   = config.vlBenchmarks[industry] || config.vlBenchmarks.it;
  const flex = config.indFlex[industry] ?? 0;
  const sm   = config.sizeMulti[size] || config.sizeMulti[5];
  const out  = {};
  Object.keys(vl).forEach(dim => {
    const m = size === 5 ? 1.0 : Math.min(0.98, Math.max(0.28, sm[dim] + flex));
    out[dim] = Math.max(1.0, Number((vl[dim] * m).toFixed(1)));
  });
  return out;
}
const dimScoreFn    = (qs, answers, key) => { const d=qs.filter(q=>q.dim===key); const done=d.filter(q=>answers[q.id]!=null); if(!done.length) return 0; return Number((done.reduce((a,q)=>a+answers[q.id],0)/done.length).toFixed(1)); };
const dimCompleteFn = (qs, answers, key) => qs.filter(q=>q.dim===key).every(q=>answers[q.id]!=null);


// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT 1 — ANALYTICS MATURITY INDEX
// ═══════════════════════════════════════════════════════════════════════════════
const ANALYTICS = {
  id: 'analytics',
  name: 'Analytics Maturity Index',
  badge: '01',
  tagline: 'Know exactly where your organisation stands on analytics.',
  outcomeDimKey: 'outcomes',
  outcomeDimLabel: 'Value & Benefits Realization',
  outcomeDesc: 'The outcomes your analytics programme is currently delivering.',
  dimColors: { leadership:'#022c22', it:'#1d4ed8', people:'#7c3aed', org:'#c2410c', catalysts:'#be185d', outcomes:'#b45309' },
  levelDescs: [
    'Analytics is absent or ad hoc. No consistent data-driven culture or infrastructure.',
    'Awareness is growing but inconsistent. Pockets of good practice with no enterprise approach.',
    'Analytics is operational in parts of the business. Scale talent and culture to advance.',
    'Analytics is embedded enterprise-wide. Focus on translators and continuous improvement.',
    'Analytics is a core competitive advantage. A benchmark for your industry.',
  ],
  dimensions: [
    { key:'leadership', name:'Leadership & Strategy',   shortName:'Leadership',   description:'How effectively leadership drives analytics strategy, vision, and decision-making.',                                  weight:0.084 },
    { key:'it',         name:'IT & Data Systems',       shortName:'IT & Data',    description:'The quality, accessibility, governance, and integration of your data infrastructure and technology.',               weight:0.186 },
    { key:'people',     name:'Human Capital',           shortName:'People',       description:'The skills, talent, organisational structure, and learning culture that make analytics possible.',                   weight:0.293 },
    { key:'org',        name:'Organisation & Culture',  shortName:'Org & Culture',description:'The norms, governance structures, and change management capacity that create the right environment.',               weight:0.203 },
    { key:'catalysts',  name:'Maturity Catalysts',      shortName:'Catalysts',    description:'Use-case strategy, evangelism programmes, and analytics translators that accelerate maturity.',                    weight:0.233 },
    { key:'outcomes',   name:'Value & Benefits',        shortName:'Value',        description:'The actual financial, operational, and commercial outcomes your analytics initiatives are delivering.',             weight:0.10, isOutcome:true },
  ],
  vlBenchmarks: {
    bfsi:         { leadership:3.5, it:3.7, people:3.2, org:3.1, catalysts:2.9, outcomes:3.3 },
    it:           { leadership:3.8, it:4.0, people:3.6, org:3.4, catalysts:3.3, outcomes:3.5 },
    telecom:      { leadership:3.3, it:3.5, people:3.0, org:2.9, catalysts:2.7, outcomes:3.0 },
    retail:       { leadership:3.0, it:3.2, people:2.8, org:2.7, catalysts:2.5, outcomes:2.8 },
    fmcg:         { leadership:3.2, it:3.1, people:2.9, org:2.8, catalysts:2.6, outcomes:2.9 },
    manufacturing:{ leadership:2.8, it:2.9, people:2.5, org:2.4, catalysts:2.3, outcomes:2.5 },
    healthcare:   { leadership:2.9, it:3.0, people:2.7, org:2.6, catalysts:2.4, outcomes:2.7 },
    logistics:    { leadership:2.7, it:2.8, people:2.4, org:2.3, catalysts:2.2, outcomes:2.4 },
    auto:         { leadership:3.1, it:3.2, people:2.8, org:2.7, catalysts:2.5, outcomes:2.8 },
    energy:       { leadership:2.9, it:3.0, people:2.6, org:2.5, catalysts:2.3, outcomes:2.6 },
    realestate:   { leadership:2.4, it:2.5, people:2.2, org:2.1, catalysts:2.0, outcomes:2.2 },
    education:    { leadership:2.5, it:2.6, people:2.3, org:2.2, catalysts:2.1, outcomes:2.3 },
    agriculture:  { leadership:2.2, it:2.3, people:2.0, org:1.9, catalysts:1.8, outcomes:2.0 },
    government:   { leadership:2.3, it:2.4, people:2.1, org:2.0, catalysts:1.9, outcomes:2.1 },
  },
  sizeMulti: {
    1:{ leadership:0.46, it:0.42, people:0.44, org:0.49, catalysts:0.46, outcomes:0.44 },
    2:{ leadership:0.59, it:0.55, people:0.57, org:0.62, catalysts:0.59, outcomes:0.57 },
    3:{ leadership:0.73, it:0.70, people:0.72, org:0.76, catalysts:0.74, outcomes:0.72 },
    4:{ leadership:0.87, it:0.85, people:0.86, org:0.88, catalysts:0.87, outcomes:0.86 },
    5:{ leadership:1.00, it:1.00, people:1.00, org:1.00, catalysts:1.00, outcomes:1.00 },
  },
  indFlex: { it:+0.07, bfsi:+0.05, education:+0.03, telecom:+0.02, retail:+0.01, fmcg:+0.01, healthcare:+0.01, auto:0, manufacturing:-0.02, logistics:-0.02, energy:-0.02, realestate:-0.03, government:-0.03, agriculture:-0.05 },
  questions: [
    {id:'L1',text:'Our senior leadership has a clearly articulated vision for analytics and data-driven decision making.',dim:'leadership'},
    {id:'L2',text:'There is a designated C-level executive (CDO, CAO, or equivalent) accountable for analytics outcomes.',dim:'leadership'},
    {id:'L3',text:'Analytics is a standing agenda item in board-level and leadership meetings.',dim:'leadership'},
    {id:'L4',text:'Leadership actively uses analytics insights in their own decision-making processes.',dim:'leadership'},
    {id:'L5',text:'There is a formal, funded analytics strategy aligned with overall business strategy.',dim:'leadership'},
    {id:'L6',text:'Analytics ROI is measured and reported regularly to leadership.',dim:'leadership'},
    {id:'L7',text:'Leadership champions a data-driven culture and communicates its importance across the organisation.',dim:'leadership'},
    {id:'L8',text:'Investment in analytics capabilities has increased year-over-year.',dim:'leadership'},
    {id:'L9',text:'There is alignment between IT and business leadership on analytics priorities.',dim:'leadership'},
    {id:'T1',text:'We have a centralised, well-governed data warehouse or data lake that serves as a single source of truth.',dim:'it'},
    {id:'T2',text:'Data quality is actively monitored, measured, and continuously improved.',dim:'it'},
    {id:'T3',text:'Business users can access the data they need in a self-service manner without heavy IT dependency.',dim:'it'},
    {id:'T4',text:'We have a formal data governance framework with clear data ownership and stewardship.',dim:'it'},
    {id:'T5',text:'Our data infrastructure can handle real-time or near-real-time data processing needs.',dim:'it'},
    {id:'T6',text:'We use modern analytics tools (BI platforms, ML platforms, cloud analytics) effectively.',dim:'it'},
    {id:'T7',text:'Data security and privacy regulations (DPDP Act, etc.) are systematically addressed.',dim:'it'},
    {id:'T8',text:'Our systems are well-integrated — data flows smoothly between operational and analytical systems.',dim:'it'},
    {id:'T9',text:'We have established data cataloguing and metadata management practices.',dim:'it'},
    {id:'P1',text:'We have a dedicated analytics team with clearly defined roles (data engineers, analysts, scientists).',dim:'people'},
    {id:'P2',text:'Our organisation invests in ongoing analytics training and upskilling for both technical and business staff.',dim:'people'},
    {id:'P3',text:'We can attract and retain quality analytics talent in a competitive market.',dim:'people'},
    {id:'P4',text:'Business users across functions have sufficient data literacy to interpret and act on analytics outputs.',dim:'people'},
    {id:'P5',text:'We have "analytics translators" who bridge the gap between technical teams and business stakeholders.',dim:'people'},
    {id:'P6',text:'Analytics career paths are well-defined and offer growth within the organisation.',dim:'people'},
    {id:'P7',text:'Cross-functional collaboration between analytics and business teams is the norm, not the exception.',dim:'people'},
    {id:'P8',text:'Our analytics team size is appropriate for the scale and ambition of our analytics programme.',dim:'people'},
    {id:'O1',text:'Data-driven decision-making is embedded in our organisational culture, not just in pockets.',dim:'org'},
    {id:'O2',text:'We have a formal analytics governance structure (CoE, committees, or equivalent) that operates effectively.',dim:'org'},
    {id:'O3',text:'There is a strong change management process in place to drive analytics adoption.',dim:'org'},
    {id:'O4',text:'Experimentation and hypothesis testing are encouraged across the organisation.',dim:'org'},
    {id:'O5',text:'Analytics outputs are trusted across the organisation — people believe in and act on the insights.',dim:'org'},
    {id:'O6',text:'There is clear accountability for acting on analytics insights at the business unit level.',dim:'org'},
    {id:'O7',text:'We have an effective process for prioritising analytics use cases across the organisation.',dim:'org'},
    {id:'O8',text:'Knowledge sharing around analytics best practices happens systematically (not ad hoc).',dim:'org'},
    {id:'C1',text:'We have a structured use-case pipeline that systematically identifies, prioritises, and delivers analytics projects.',dim:'catalysts'},
    {id:'C2',text:'Analytics success stories are actively communicated and celebrated across the organisation.',dim:'catalysts'},
    {id:'C3',text:'We have an analytics evangelism programme that builds demand and excitement for data-driven approaches.',dim:'catalysts'},
    {id:'C4',text:'We actively participate in industry analytics communities, conferences, or peer benchmarking.',dim:'catalysts'},
    {id:'C5',text:'We leverage external partnerships (consultancies, vendors, academia) strategically to accelerate maturity.',dim:'catalysts'},
    {id:'C6',text:'We have a process for scaling successful analytics pilots into enterprise-wide deployments.',dim:'catalysts'},
    {id:'C7',text:'We use design thinking or human-centred approaches to make analytics outputs actionable.',dim:'catalysts'},
    {id:'C8',text:'There is a formal process for learning from analytics project failures and iterating.',dim:'catalysts'},
    {id:'V1',text:'Analytics has demonstrably improved operational efficiency (cost reduction, process optimisation).',dim:'outcomes'},
    {id:'V2',text:'Analytics has directly contributed to revenue growth or new revenue streams.',dim:'outcomes'},
    {id:'V3',text:'We can quantify the financial impact of our analytics investments with confidence.',dim:'outcomes'},
    {id:'V4',text:'Analytics has improved our customer experience, satisfaction scores, or Net Promoter Score.',dim:'outcomes'},
    {id:'V5',text:'Analytics insights have led to measurable improvements in risk management or compliance.',dim:'outcomes'},
    {id:'V6',text:'Analytics has improved our speed of decision-making (time from data to decision to action).',dim:'outcomes'},
    {id:'V7',text:'Our analytics programme has helped create competitive advantages that are difficult for competitors to replicate.',dim:'outcomes'},
    {id:'V8',text:'The value delivered by analytics is recognised and appreciated by business stakeholders beyond the analytics team.',dim:'outcomes'},
  ],
  recs: {
    leadership:{ low:['Appoint a senior executive (CDO/CAO) with explicit accountability for analytics outcomes.','Include analytics as a standing agenda item in quarterly leadership reviews.','Establish an analytics steering committee with cross-functional leadership representation.'], mid:['Implement a formal analytics ROI measurement framework linked to business KPIs.','Develop an executive data literacy programme for the senior leadership team.','Create a 3-year analytics roadmap aligned with corporate strategy.'], high:['Institutionalise analytics-driven decision-making through embedded decision-support frameworks.','Benchmark analytics investments against industry leaders and adjust upward.','Champion AI/ML adoption at the board level with dedicated innovation budgets.'] },
    it:{ low:['Establish a single source of truth — invest in a modern data warehouse or lakehouse architecture.','Implement basic data quality monitoring with automated alerts for critical data assets.','Create a data governance policy with clear ownership for key data domains.'], mid:['Enable self-service analytics with governed tools and a curated data catalogue.','Invest in real-time data processing capabilities for time-sensitive use cases.','Strengthen data security posture to comply with DPDP Act requirements.'], high:['Build a DataOps pipeline with automated testing, monitoring, and deployment.','Implement a data mesh architecture for domain-oriented decentralised data ownership.','Invest in MLOps infrastructure for production-grade machine learning deployment.'] },
    people:{ low:['Hire at least one experienced analytics leader to build and mentor the team.','Launch a company-wide data literacy programme starting with high-impact business teams.','Partner with analytics training providers for structured upskilling pathways.'], mid:['Create formal analytics career paths with clear progression from analyst to principal.','Develop an "analytics translator" programme to bridge business and technical teams.','Establish an internal analytics community of practice for knowledge sharing.'], high:['Build a world-class employer brand for analytics talent with competitive compensation.','Create an analytics academy for continuous advanced skill development.','Implement rotation programmes between analytics and business functions.'] },
    org:{ low:['Start with a small Analytics Centre of Excellence (CoE) to demonstrate value.','Identify 2-3 high-visibility use cases to build organisational trust in analytics.','Assign analytics champions in each major business function.'], mid:['Formalise the analytics governance structure with clear decision-rights.','Implement a change management programme specifically for analytics adoption.','Create accountability metrics for acting on analytics insights at the BU level.'], high:['Embed experimentation culture — A/B testing, hypothesis-driven decision making.','Transition from centralised CoE to a federated model with embedded analysts.','Build systematic knowledge management for analytics insights and methodologies.'] },
    catalysts:{ low:['Create a use case backlog and prioritise based on business impact and feasibility.','Document and communicate 3-5 analytics success stories across the organisation.','Join industry analytics forums and peer networks for benchmarking.'], mid:['Build a formal use-case pipeline with stage-gates from ideation to production.','Launch an internal analytics evangelism programme with regular showcases.','Develop partnerships with 1-2 strategic analytics vendors or consultancies.'], high:['Implement a scaling playbook for taking successful pilots to enterprise deployment.','Apply design thinking to analytics products for better user adoption.','Create an innovation lab for experimenting with emerging analytics technologies.'] },
    outcomes:{ low:['Define clear, measurable KPIs for your top 3 analytics initiatives.','Start tracking time-to-insight and time-to-decision as operational metrics.','Conduct a baseline assessment of current decision-making speed and accuracy.'], mid:['Build a value tracking dashboard that links analytics initiatives to business outcomes.','Quantify analytics ROI for your top 10 use cases with financial rigour.','Survey business stakeholders quarterly on analytics value perception.'], high:['Create an "analytics P&L" that tracks cumulative value delivered by the function.','Benchmark your analytics value metrics against global best-in-class organisations.','Develop predictive models for estimating value of proposed analytics initiatives.'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT 2 — ESG READINESS ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════
const ESG = {
  id: 'esg',
  name: 'ESG Readiness Assessment',
  badge: '02',
  tagline: 'Evaluate your ESG maturity across governance, environment, and social dimensions.',
  outcomeDimKey: 'reporting',
  outcomeDimLabel: 'Reporting & Disclosure Quality',
  outcomeDesc: 'The quality and completeness of your current ESG disclosures (BRSR / GRI).',
  dimColors: { governance:'#022c22', environmental:'#047857', social:'#1d4ed8', strategy:'#7c3aed', supplychain:'#c2410c', reporting:'#b45309' },
  levelDescs: [
    'ESG is absent or reactive. No formal policies, minimal compliance, no structured reporting.',
    'Basic compliance is in place. ESG awareness is growing but disconnected from strategy.',
    'ESG policies exist and are being implemented. Reporting is underway but incomplete.',
    'ESG is integrated into strategy and operations. Reporting is structured and improving.',
    'ESG is a strategic differentiator. Stakeholder trust is high and disclosure is exemplary.',
  ],
  dimensions: [
    { key:'governance',    name:'Governance & Ethics',         shortName:'Governance',    description:'Board-level ESG oversight, ethics frameworks, transparency, and accountability structures.',                                     weight:0.28 },
    { key:'environmental', name:'Environmental Management',    shortName:'Environment',   description:'GHG emissions tracking, energy and water management, climate risk assessment, and circular economy practices.',                   weight:0.22 },
    { key:'social',        name:'Social & Human Capital',      shortName:'Social',        description:'Employee wellbeing, POSH compliance, human rights, fair wages, and community development.',                                       weight:0.20 },
    { key:'strategy',      name:'ESG Strategy & Leadership',   shortName:'ESG Strategy',  description:'Board-approved ESG strategy, executive accountability, materiality assessment, and stakeholder engagement.',                      weight:0.18 },
    { key:'supplychain',   name:'Supply Chain Responsibility', shortName:'Supply Chain',  description:'Supplier ESG assessments, responsible sourcing, value chain emissions, and supplier capacity building.',                         weight:0.12 },
    { key:'reporting',     name:'Reporting & Disclosure',      shortName:'Reporting',     description:'Quality, completeness, and assurance of BRSR and GRI-aligned disclosures.',                                                      weight:0.10, isOutcome:true },
  ],
  vlBenchmarks: {
    bfsi:         { governance:3.9, environmental:2.8, social:3.3, strategy:3.5, supplychain:2.5, reporting:3.6 },
    it:           { governance:3.7, environmental:3.0, social:3.5, strategy:3.5, supplychain:2.8, reporting:3.3 },
    telecom:      { governance:3.3, environmental:2.9, social:3.2, strategy:3.1, supplychain:2.6, reporting:3.0 },
    retail:       { governance:3.0, environmental:2.7, social:3.0, strategy:2.8, supplychain:3.1, reporting:2.8 },
    fmcg:         { governance:3.1, environmental:3.0, social:3.1, strategy:2.9, supplychain:3.2, reporting:2.9 },
    manufacturing:{ governance:3.2, environmental:3.5, social:2.9, strategy:3.0, supplychain:3.3, reporting:3.0 },
    healthcare:   { governance:3.4, environmental:2.9, social:3.4, strategy:3.2, supplychain:2.8, reporting:3.1 },
    logistics:    { governance:2.9, environmental:3.0, social:2.8, strategy:2.7, supplychain:2.9, reporting:2.7 },
    auto:         { governance:3.2, environmental:3.3, social:3.0, strategy:3.1, supplychain:3.1, reporting:3.0 },
    energy:       { governance:3.3, environmental:3.8, social:3.1, strategy:3.4, supplychain:3.0, reporting:3.2 },
    realestate:   { governance:2.7, environmental:2.8, social:2.6, strategy:2.5, supplychain:2.4, reporting:2.5 },
    education:    { governance:2.8, environmental:2.4, social:3.0, strategy:2.6, supplychain:2.1, reporting:2.4 },
    agriculture:  { governance:2.3, environmental:2.8, social:2.4, strategy:2.2, supplychain:2.5, reporting:2.1 },
    government:   { governance:2.9, environmental:2.6, social:2.7, strategy:2.5, supplychain:2.3, reporting:2.4 },
  },
  sizeMulti: {
    1:{ governance:0.50, environmental:0.55, social:0.60, strategy:0.46, supplychain:0.62, reporting:0.40 },
    2:{ governance:0.62, environmental:0.65, social:0.70, strategy:0.58, supplychain:0.72, reporting:0.52 },
    3:{ governance:0.76, environmental:0.77, social:0.79, strategy:0.73, supplychain:0.81, reporting:0.67 },
    4:{ governance:0.88, environmental:0.88, social:0.89, strategy:0.87, supplychain:0.89, reporting:0.83 },
    5:{ governance:1.00, environmental:1.00, social:1.00, strategy:1.00, supplychain:1.00, reporting:1.00 },
  },
  indFlex: { bfsi:+0.06, energy:+0.04, it:+0.03, manufacturing:+0.02, telecom:+0.01, healthcare:+0.01, fmcg:0, auto:0, retail:0, logistics:-0.01, education:-0.01, realestate:-0.02, government:-0.01, agriculture:-0.03 },
  questions: [
    {id:'G1',text:'Our board has clear oversight and accountability for ESG performance, including dedicated agenda time.',dim:'governance'},
    {id:'G2',text:'We have a formal, publicly available code of ethics and anti-corruption policy that is actively enforced.',dim:'governance'},
    {id:'G3',text:'A whistle-blower mechanism is in place and accessible to all employees and stakeholders.',dim:'governance'},
    {id:'G4',text:'ESG-related risks are formally integrated into our enterprise risk management (ERM) framework.',dim:'governance'},
    {id:'G5',text:'Our board composition includes independent directors, and their skills matrix is publicly disclosed.',dim:'governance'},
    {id:'G6',text:'We have transparent policies on related-party transactions and potential conflicts of interest.',dim:'governance'},
    {id:'G7',text:'Business ethics training is conducted regularly across the organisation and is tracked for completion.',dim:'governance'},
    {id:'G8',text:'Stakeholder grievance mechanisms are in place and response timelines are tracked.',dim:'governance'},
    {id:'G9',text:'Our governance practices are benchmarked against applicable regulations (SEBI LODR, Companies Act) annually.',dim:'governance'},
    {id:'E1',text:'We measure and track our Scope 1 and Scope 2 greenhouse gas (GHG) emissions with documented methodology.',dim:'environmental'},
    {id:'E2',text:'We have set quantified, time-bound targets for reducing energy consumption and carbon emissions.',dim:'environmental'},
    {id:'E3',text:'Water consumption is measured, and water efficiency or recycling programmes are operational.',dim:'environmental'},
    {id:'E4',text:'We have a formal waste management strategy that tracks waste generated, recycled, and disposed.',dim:'environmental'},
    {id:'E5',text:'A formal climate risk assessment has been conducted covering both physical and transition risks.',dim:'environmental'},
    {id:'E6',text:'We are actively reducing our dependence on fossil fuels and increasing renewable energy usage.',dim:'environmental'},
    {id:'E7',text:'Biodiversity and land-use impact is assessed as part of our environmental planning.',dim:'environmental'},
    {id:'E8',text:'Environmental performance data is independently verified or assured by a third party.',dim:'environmental'},
    {id:'E9',text:'We track and actively manage Scope 3 (value chain) emissions across key upstream and downstream categories.',dim:'environmental'},
    {id:'S1',text:'Employee health, safety, and wellbeing programmes are formally structured and outcomes are measured.',dim:'social'},
    {id:'S2',text:'We comply with and go meaningfully beyond POSH Act requirements for prevention of workplace harassment.',dim:'social'},
    {id:'S3',text:'Fair wages are benchmarked regularly and pay equity gaps are identified and addressed.',dim:'social'},
    {id:'S4',text:'We have formal programmes to support employee mental health, financial wellbeing, and work-life balance.',dim:'social'},
    {id:'S5',text:'Human rights policies extend to our supply chain and compliance is actively monitored.',dim:'social'},
    {id:'S6',text:'Community development programmes are linked to our core business operations and are measured for social impact.',dim:'social'},
    {id:'S7',text:'Customer data privacy, product safety, and responsible marketing are systematically addressed and governed.',dim:'social'},
    {id:'S8',text:'Employee satisfaction and engagement is formally measured and results drive management actions.',dim:'social'},
    {id:'S9',text:'Our workforce policies promote inclusion and address the needs of contract, migrant, and seasonal workers.',dim:'social'},
    {id:'ST1',text:'Our organisation has a board-approved, publicly stated ESG strategy with measurable targets.',dim:'strategy'},
    {id:'ST2',text:'ESG KPIs are formally linked to executive and senior leadership compensation.',dim:'strategy'},
    {id:'ST3',text:'We have a dedicated ESG lead, sustainability officer, or equivalent role with sufficient authority and resources.',dim:'strategy'},
    {id:'ST4',text:'A formal materiality assessment has been conducted to identify our most significant ESG topics.',dim:'strategy'},
    {id:'ST5',text:'ESG considerations are integrated into capital allocation, M&A evaluation, and business strategy processes.',dim:'strategy'},
    {id:'ST6',text:'We proactively engage investors and analysts on our ESG strategy and performance.',dim:'strategy'},
    {id:'ST7',text:'Our ESG performance is benchmarked against sector peers and global frameworks at least annually.',dim:'strategy'},
    {id:'ST8',text:'ESG innovation — sustainable products, services, or business models — is a strategic growth priority.',dim:'strategy'},
    {id:'SC1',text:'We have a supplier code of conduct that covers ESG minimum standards and is publicly disclosed.',dim:'supplychain'},
    {id:'SC2',text:'ESG compliance clauses are included in contracts with key and high-risk suppliers.',dim:'supplychain'},
    {id:'SC3',text:'We conduct ESG audits or self-assessments for our top suppliers by spend or risk.',dim:'supplychain'},
    {id:'SC4',text:'We provide capacity-building support to strategic suppliers to improve their ESG performance.',dim:'supplychain'},
    {id:'SC5',text:'Responsible sourcing policies cover conflict minerals, forced labour, and child labour.',dim:'supplychain'},
    {id:'SC6',text:'We actively promote local and diverse supplier procurement with measurable targets.',dim:'supplychain'},
    {id:'SC7',text:'Supply chain ESG risk mapping is formally conducted and integrated into business continuity planning.',dim:'supplychain'},
    {id:'SC8',text:'We track and report supply chain (Scope 3) emissions across key procurement categories.',dim:'supplychain'},
    {id:'R1',text:'We publish an annual sustainability or ESG report aligned to BRSR mandatory requirements.',dim:'reporting'},
    {id:'R2',text:'Our BRSR disclosure covers all mandatory KPIs, and we additionally disclose leadership indicators.',dim:'reporting'},
    {id:'R3',text:'ESG data is independently assured or verified — at minimum on BRSR Core KPIs.',dim:'reporting'},
    {id:'R4',text:'We disclose against at least one global framework (GRI, TCFD, SASB, or ISSB) in addition to BRSR.',dim:'reporting'},
    {id:'R5',text:'Our ESG disclosures are consistent year-on-year and include restated comparative data where relevant.',dim:'reporting'},
    {id:'R6',text:'We voluntarily disclose beyond the mandatory BRSR requirements to improve stakeholder transparency.',dim:'reporting'},
    {id:'R7',text:'Stakeholder feedback is actively sought and incorporated into our disclosure priorities each cycle.',dim:'reporting'},
  ],
  recs: {
    governance:{ low:['Establish a formal board ESG committee with a clear oversight mandate and meeting schedule.','Develop and publish a code of ethics and anti-corruption policy accessible to all stakeholders.','Implement an accessible whistle-blower mechanism with documented investigation and response process.'], mid:['Integrate ESG risk formally into your enterprise risk management framework and report to the board.','Ensure board-level ESG expertise through director training or appointment of a sustainability specialist.','Formalise stakeholder grievance mechanisms with tracked response timelines and published outcomes.'], high:['Achieve independent assurance on governance and compliance disclosures.','Align your governance framework to global standards — UN Global Compact, OECD Principles of Corporate Governance.','Publish a board diversity and skills matrix with explicit ESG competency mapping and succession planning.'] },
    environmental:{ low:['Begin measuring Scope 1 and Scope 2 GHG emissions to establish a documented baseline.','Set initial energy and water consumption reduction targets referenced to a base year.','Establish a waste tracking system with categories for disposal, recycling, and recovery.'], mid:['Develop science-based or time-bound carbon reduction targets aligned to India\'s NDC commitments.','Commission a formal climate risk assessment covering both physical and transition risks.','Begin tracking key Scope 3 emissions categories — purchased goods, logistics, and business travel.'], high:['Achieve third-party assurance for all material environmental performance data.','Publish a net-zero roadmap with interim milestones aligned to IPCC 1.5°C pathways.','Integrate circular economy principles into product design, procurement, and end-of-life management.'] },
    social:{ low:['Conduct a pay equity audit and develop a time-bound remediation plan for identified gaps.','Establish a structured POSH compliance framework with ICC, regular training, and published outcomes.','Develop baseline community development initiatives tied to your operational footprint.'], mid:['Extend human rights due diligence formally to your supply chain with documented monitoring.','Implement formal employee wellbeing and mental health programmes with utilisation tracking.','Formally measure and publish employee engagement scores with management response commitments.'], high:['Achieve external certification for workplace safety and wellbeing (ISO 45001 or equivalent).','Publish a Social Impact Report with quantified outcomes across community, employee, and supply chain.','Build a responsible business conduct programme with third-party social audit capability.'] },
    strategy:{ low:['Conduct a materiality assessment with structured stakeholder input to define your ESG priorities.','Appoint a dedicated ESG lead with sufficient budget and direct access to senior leadership.','Develop a 3-year ESG roadmap with measurable targets approved by the board.'], mid:['Link executive compensation to ESG KPIs with transparent reporting to shareholders.','Engage investors and analysts proactively on your ESG strategy through dedicated briefings.','Benchmark your performance against sector peers and global leaders annually.'], high:['Integrate ESG formally into capital allocation decisions and M&A evaluation frameworks.','Publish a board-level ESG strategy with science-backed targets and investor commitments.','Establish an ESG innovation mandate with dedicated funding for sustainable products and services.'] },
    supplychain:{ low:['Develop a supplier code of conduct covering ESG minimum standards and publish it.','Map your top suppliers by spend and identify high-risk vendors for prioritised ESG engagement.','Include ESG compliance clauses in all new supplier contracts.'], mid:['Conduct ESG audits or self-assessments for your top 20% of suppliers by spend or risk.','Provide structured ESG capacity-building support to strategic suppliers.','Set measurable targets for local and diverse supplier procurement and track progress.'], high:['Achieve transparent Scope 3 supply chain emissions reporting with verified methodology.','Build a supplier ESG rating system with annual benchmarking and published results.','Pursue recognised responsible sourcing certification for high-risk categories (e.g., Sedex, SA8000).'] },
    reporting:{ low:['Publish an initial BRSR filing covering all mandatory KPIs with consistent data quality.','Establish internal data collection systems for all BRSR essential indicators.','Disclose key ESG metrics clearly in your annual report with year-on-year comparisons.'], mid:['Align your disclosure additionally to GRI Standards for a globally comparable framework.','Obtain at minimum limited assurance on BRSR Core KPIs from an independent assessor.','Implement structured stakeholder engagement to prioritise future disclosure improvements.'], high:['Achieve reasonable assurance on all material ESG disclosures and publish the assurance statement.','Align reporting to ISSB standards (IFRS S1/S2) and TCFD recommendations for investor-grade disclosure.','Publish integrated reporting combining financial and sustainability performance in a single, comparable format.'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT 3 — DEI MATURITY INDEX
// ═══════════════════════════════════════════════════════════════════════════════
const DEI = {
  id: 'dei',
  name: 'DEI Maturity Index',
  badge: '03',
  tagline: 'Assess diversity, equity, and inclusion maturity with an India-first lens.',
  outcomeDimKey: 'measurement',
  outcomeDimLabel: 'Measurement & Accountability',
  outcomeDesc: 'The rigour of your DEI data collection, tracking, and external reporting.',
  dimColors: { gender:'#7c3aed', culture:'#be185d', deistrategy:'#022c22', social:'#c2410c', disability:'#1d4ed8', measurement:'#b45309' },
  levelDescs: [
    'DEI is absent or compliance-only. No formal strategy, minimal representation data, limited accountability.',
    'DEI awareness exists. Basic policies are in place but implementation is inconsistent across the organisation.',
    'DEI programmes are active but siloed. Culture and measurement are evolving but not yet systemic.',
    'DEI is embedded in talent strategy and culture. Data-driven and improving year-on-year.',
    'DEI is a core organisational value. Recognised externally as an inclusive employer and benchmark for peers.',
  ],
  dimensions: [
    { key:'gender',      name:'Gender Equity',              shortName:'Gender',        description:'Women\'s representation, leadership pipeline, pay parity, POSH, and return-to-work programmes.',                                weight:0.30 },
    { key:'culture',     name:'Inclusion Culture',          shortName:'Culture',       description:'Psychological safety, unconscious bias programmes, ERGs, and embedding inclusive norms across the organisation.',              weight:0.25 },
    { key:'deistrategy', name:'DEI Leadership & Strategy',  shortName:'DEI Strategy',  description:'Board-level ownership, dedicated DEI roles, ring-fenced budgets, and integration into business planning.',                    weight:0.20 },
    { key:'social',      name:'Social Equity',              shortName:'Social Equity', description:'SC/ST/OBC representation, caste equity, first-generation professional support, and regional diversity. India-specific.',       weight:0.15 },
    { key:'disability',  name:'Disability & Accessibility', shortName:'Disability',    description:'RPWD Act 2016 compliance, accessible infrastructure, disability-inclusive hiring, and reasonable accommodation policies.',     weight:0.10 },
    { key:'measurement', name:'Measurement & Accountability',shortName:'Measurement',  description:'DEI data rigour, pay equity disclosure, board-level review, and external reporting.',                                          weight:0.10, isOutcome:true },
  ],
  vlBenchmarks: {
    bfsi:         { gender:3.2, culture:3.0, deistrategy:3.1, social:2.5, disability:2.6, measurement:2.9 },
    it:           { gender:3.6, culture:3.3, deistrategy:3.4, social:2.8, disability:2.9, measurement:3.1 },
    telecom:      { gender:2.9, culture:2.8, deistrategy:2.8, social:2.4, disability:2.4, measurement:2.7 },
    retail:       { gender:2.7, culture:2.6, deistrategy:2.5, social:2.2, disability:2.1, measurement:2.4 },
    fmcg:         { gender:2.9, culture:2.8, deistrategy:2.7, social:2.3, disability:2.3, measurement:2.6 },
    manufacturing:{ gender:2.2, culture:2.3, deistrategy:2.2, social:2.0, disability:1.9, measurement:2.1 },
    healthcare:   { gender:3.0, culture:2.9, deistrategy:2.8, social:2.4, disability:2.7, measurement:2.7 },
    logistics:    { gender:2.3, culture:2.3, deistrategy:2.2, social:2.0, disability:1.9, measurement:2.1 },
    auto:         { gender:2.4, culture:2.4, deistrategy:2.3, social:2.1, disability:2.0, measurement:2.2 },
    energy:       { gender:2.5, culture:2.4, deistrategy:2.4, social:2.1, disability:2.0, measurement:2.3 },
    realestate:   { gender:2.1, culture:2.1, deistrategy:2.0, social:1.9, disability:1.8, measurement:2.0 },
    education:    { gender:3.0, culture:2.9, deistrategy:2.7, social:2.5, disability:2.4, measurement:2.5 },
    agriculture:  { gender:1.9, culture:2.0, deistrategy:1.9, social:1.8, disability:1.7, measurement:1.8 },
    government:   { gender:2.6, culture:2.4, deistrategy:2.5, social:2.3, disability:2.5, measurement:2.4 },
  },
  sizeMulti: {
    1:{ gender:0.55, culture:0.60, deistrategy:0.48, social:0.58, disability:0.52, measurement:0.43 },
    2:{ gender:0.65, culture:0.69, deistrategy:0.60, social:0.67, disability:0.63, measurement:0.55 },
    3:{ gender:0.77, culture:0.78, deistrategy:0.73, social:0.76, disability:0.74, measurement:0.69 },
    4:{ gender:0.88, culture:0.88, deistrategy:0.87, social:0.87, disability:0.86, measurement:0.83 },
    5:{ gender:1.00, culture:1.00, deistrategy:1.00, social:1.00, disability:1.00, measurement:1.00 },
  },
  indFlex: { it:+0.08, bfsi:+0.04, healthcare:+0.03, education:+0.02, telecom:+0.01, fmcg:+0.01, retail:0, government:0, auto:-0.03, energy:-0.02, logistics:-0.03, manufacturing:-0.04, realestate:-0.02, agriculture:-0.05 },
  questions: [
    {id:'GE1',text:'Women represent at least 30% of our total permanent workforce.',dim:'gender'},
    {id:'GE2',text:'Women hold at least 20% of senior leadership and board-level positions.',dim:'gender'},
    {id:'GE3',text:'A formal pay equity audit is conducted at least every two years and identified gaps are addressed.',dim:'gender'},
    {id:'GE4',text:'Our maternity, paternity, and parental leave policies meaningfully exceed statutory minimum requirements.',dim:'gender'},
    {id:'GE5',text:'We have active returnship or career-restart programmes for women re-entering the workforce.',dim:'gender'},
    {id:'GE6',text:'Structured women\'s leadership development and mentoring programmes are formally in place.',dim:'gender'},
    {id:'GE7',text:'Recruitment processes are designed to reduce gender bias — blind screening and diverse interview panels are standard.',dim:'gender'},
    {id:'GE8',text:'Gender representation targets are set, tracked, and reviewed at each organisational level.',dim:'gender'},
    {id:'GE9',text:'Flexible and hybrid working arrangements are equally available to and utilised by all genders.',dim:'gender'},
    {id:'GE10',text:'POSH complaints are resolved within mandated timelines and ICC composition is compliant.',dim:'gender'},
    {id:'IC1',text:'Our organisation has a formally articulated DEI vision that is communicated consistently across the business.',dim:'culture'},
    {id:'IC2',text:'All people managers receive regular unconscious bias and inclusion training.',dim:'culture'},
    {id:'IC3',text:'Senior leaders visibly champion DEI through concrete actions, not just communication.',dim:'culture'},
    {id:'IC4',text:'Employees from all backgrounds report feeling psychologically safe to speak up without fear of retaliation.',dim:'culture'},
    {id:'IC5',text:'Inclusive language and communication standards are embedded in our policies and day-to-day culture.',dim:'culture'},
    {id:'IC6',text:'Employee Resource Groups (ERGs) or affinity networks are active, resourced, and have executive sponsorship.',dim:'culture'},
    {id:'IC7',text:'Diverse cultural, religious, and regional occasions are acknowledged and celebrated across the organisation.',dim:'culture'},
    {id:'IC8',text:'Our workplace has a documented process for addressing discrimination, harassment, and micro-aggressions.',dim:'culture'},
    {id:'IC9',text:'DEI-related factors are tracked in exit interviews and attrition analysis drives systemic corrective action.',dim:'culture'},
    {id:'DL1',text:'There is a board-level or C-suite owner formally accountable for DEI outcomes with defined KPIs.',dim:'deistrategy'},
    {id:'DL2',text:'A written DEI strategy with measurable targets and a multi-year roadmap has been board-approved.',dim:'deistrategy'},
    {id:'DL3',text:'DEI performance metrics are included in senior leadership annual performance reviews.',dim:'deistrategy'},
    {id:'DL4',text:'A dedicated, ring-fenced DEI budget is formally allocated and tracked.',dim:'deistrategy'},
    {id:'DL5',text:'DEI goals are integrated into business unit plans and line manager scorecards, not just HR.',dim:'deistrategy'},
    {id:'DL6',text:'Our recruitment partner ecosystem is regularly vetted and selected for strong DEI practices.',dim:'deistrategy'},
    {id:'DL7',text:'We participate in at least one external DEI benchmark, index, or certification programme.',dim:'deistrategy'},
    {id:'DL8',text:'DEI strategy is reviewed and refreshed at least annually with input from diverse employee stakeholders.',dim:'deistrategy'},
    {id:'SE1',text:'We track and disclose workforce representation across social categories (SC/ST/OBC) as required under applicable law.',dim:'social'},
    {id:'SE2',text:'We have active outreach and recruitment programmes targeting underrepresented social communities.',dim:'social'},
    {id:'SE3',text:'First-generation professionals receive structured onboarding, mentoring, and development support.',dim:'social'},
    {id:'SE4',text:'Regional and linguistic diversity is actively promoted in our workforce and communications.',dim:'social'},
    {id:'SE5',text:'Our anti-discrimination policies explicitly address caste-based discrimination and are actively enforced.',dim:'social'},
    {id:'SE6',text:'Socioeconomic background is considered as a dimension in our diversity monitoring and reporting.',dim:'social'},
    {id:'SE7',text:'We partner with NGOs, community organisations, or skill development bodies to build talent pipelines from underrepresented communities.',dim:'social'},
    {id:'SE8',text:'Our procurement policy promotes sourcing from SC/ST, women-owned, and micro-enterprise suppliers.',dim:'social'},
    {id:'SE9',text:'Employee assistance programmes address socioeconomic challenges faced by diverse and first-generation employees.',dim:'social'},
    {id:'DA1',text:'We meet or are on a documented roadmap toward the 3% mandatory employment target for persons with disabilities under the RPWD Act 2016.',dim:'disability'},
    {id:'DA2',text:'Our physical premises and digital tools and platforms are accessible to persons with disabilities.',dim:'disability'},
    {id:'DA3',text:'Reasonable accommodation policies are in place and all employees know how to access them.',dim:'disability'},
    {id:'DA4',text:'Disability-inclusive recruitment processes are designed and consistently applied across all roles.',dim:'disability'},
    {id:'DA5',text:'Employees with disabilities have equal access to career development, training, and promotion opportunities.',dim:'disability'},
    {id:'DA6',text:'We partner with disability-focused organisations for talent sourcing and employee awareness.',dim:'disability'},
    {id:'DA7',text:'Disability representation and inclusion metrics are formally tracked, reviewed by leadership, and reported.',dim:'disability'},
    {id:'MA1',text:'Comprehensive DEI data — gender, disability, social categories — is collected, validated, and maintained.',dim:'measurement'},
    {id:'MA2',text:'DEI metrics are reported formally in our annual report, sustainability disclosure, or BRSR.',dim:'measurement'},
    {id:'MA3',text:'Pay equity gaps are quantified across gender and relevant diversity dimensions and disclosed internally.',dim:'measurement'},
    {id:'MA4',text:'Progress against DEI targets is reviewed by the board or senior leadership at least quarterly.',dim:'measurement'},
    {id:'MA5',text:'DEI-related employee satisfaction is measured through formal, regular, anonymised surveys.',dim:'measurement'},
    {id:'MA6',text:'Attrition is formally analysed by diversity dimensions to identify and address systemic barriers.',dim:'measurement'},
    {id:'MA7',text:'An external DEI audit or independent assessment has been conducted in the last two years.',dim:'measurement'},
  ],
  recs: {
    gender:{ low:['Conduct a pay equity audit and publish the findings internally with a time-bound remediation plan.','Strengthen maternity and paternity policies to meaningfully exceed statutory minimums.','Set measurable gender representation targets at each organisational level and track quarterly.'], mid:['Launch a women\'s leadership development and sponsorship programme with senior executive involvement.','Introduce structured returnship programmes for women re-entering the workforce after career breaks.','Audit all recruitment stages for gender bias and implement blind screening and diverse interview panels.'], high:['Achieve 30%+ women in senior leadership with a board-level public commitment and timeline.','Publish an annual gender pay gap report with trend data and remediation progress.','Embed gender equity metrics into business unit leader scorecards with consequences for underperformance.'] },
    culture:{ low:['Roll out mandatory unconscious bias and inclusion training for all people managers.','Establish safe, accessible channels for employees to report discrimination or micro-aggressions.','Create a formal DEI communication calendar acknowledging diverse cultural and religious occasions.'], mid:['Launch Employee Resource Groups (ERGs) with executive sponsorship and dedicated budget.','Embed inclusive language standards in all internal and external communications.','Systematically track DEI factors in exit interviews and act on identified patterns.'], high:['Conduct annual inclusion culture surveys and publish results with management response commitments.','Make DEI capability a formal criterion in all leadership promotion and succession decisions.','Achieve measurable year-on-year improvement in psychological safety scores.'] },
    deistrategy:{ low:['Appoint a C-suite DEI champion with formal accountability, defined KPIs, and board-level visibility.','Develop a written DEI strategy with measurable targets and a 3-year roadmap, approved by the board.','Allocate a dedicated, ring-fenced DEI budget and track expenditure transparently.'], mid:['Integrate DEI KPIs formally into senior leadership annual performance reviews.','Participate in at least one external DEI benchmark, certification, or recognised index.','Extend DEI goals beyond HR into all business unit plans and line manager scorecards.'], high:['Establish board-level quarterly review of DEI performance with published outcomes.','Publish a comprehensive annual DEI report with quantified outcomes, trend data, and forward commitments.','Establish a DEI advisory council with external experts and diverse employee representation.'] },
    social:{ low:['Ensure SC/ST/OBC workforce data is tracked and disclosed as required by applicable law.','Develop outreach programmes with institutions serving underrepresented social communities.','Create structured onboarding, mentoring, and development support for first-generation professionals.'], mid:['Implement explicit caste equity policies within your anti-discrimination framework with enforcement.','Build talent pipelines through formal partnerships with NGOs and community-based skill development bodies.','Actively promote regional and linguistic diversity in hiring processes and internal communications.'], high:['Publish social equity representation data voluntarily beyond legal requirements, with trend analysis.','Include social equity metrics in procurement by setting targets for SC/ST and women-owned supplier sourcing.','Conduct a formal caste equity audit and publish findings with time-bound corrective actions.'] },
    disability:{ low:['Audit your physical premises and all digital platforms for accessibility gaps against RPWD Act standards.','Develop a documented roadmap to meet the 3% RPWD Act employment target with interim milestones.','Ensure disability-inclusive recruitment with reasonable accommodation processes accessible to all applicants.'], mid:['Partner with disability-focused organisations for specialised talent sourcing and awareness programmes.','Train all people managers on disability inclusion, neurodiversity, and reasonable accommodation.','Formally track and report disability representation and career progression metrics.'], high:['Achieve full digital and physical accessibility certification against recognised standards.','Establish a disability inclusion advisory group with employee representation and external expertise.','Publish a disability inclusion report with detailed RPWD Act compliance progress and outcomes.'] },
    measurement:{ low:['Establish a comprehensive DEI data collection framework covering gender, disability, and social categories.','Set quantified baseline metrics and begin including basic DEI data in your annual report.','Institute at minimum a biannual anonymised DEI employee survey.'], mid:['Formally analyse attrition by diversity dimensions and share findings with leadership quarterly.','Quantify pay equity gaps across gender and relevant diversity dimensions with documented methodology.','Have DEI metrics reviewed by board or senior leadership on a quarterly cadence.'], high:['Commission an external DEI audit and publish findings with management response.','Achieve comprehensive pay equity disclosure across all material diversity dimensions.','Integrate DEI metrics into investor reporting and ESG/BRSR disclosures for full stakeholder transparency.'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT 4 — DATA PRIVACY & DPDP READINESS
// ═══════════════════════════════════════════════════════════════════════════════
const DPDP = {
  id:'dpdp', name:'Data Privacy & DPDP Readiness', badge:'04',
  tagline:'Are you ready for the DPDP Act — before the deadline arrives?',
  outcomeDimKey:'complianceGov',
  outcomeDimLabel:'Compliance Governance & Accountability',
  outcomeDesc:'The maturity of your DPO function, DPIA processes, and overall privacy governance programme.',
  dimColors:{ consent:'#0369a1', dataGov:'#0891b2', security:'#022c22', rights:'#7c3aed', vendor:'#c2410c', complianceGov:'#b45309' },
  levelDescs:[
    'No formal data privacy programme. Processing is undocumented and ungoverned. Significant regulatory exposure.',
    'Basic awareness exists. Some policies drafted but implementation is fragmented and untested.',
    'Core obligations are understood. Implementation is underway but incomplete across systems and teams.',
    'Privacy programme is operational. Consent, rights, and breach response are functional and improving.',
    'Privacy is embedded by design. Demonstrable DPDP readiness across all obligations with governance maturity.',
  ],
  dimensions:[
    { key:'consent',      name:'Consent & Notice Management',      shortName:'Consent',      description:'Standalone notices, consent collection, withdrawal mechanisms, multilingual compliance, and parental consent for children\'s data.',                                                      weight:0.22 },
    { key:'dataGov',      name:'Data Governance & Classification',  shortName:'Data Gov',     description:'Data inventory, purpose limitation, data minimisation, retention schedules, data classification, and cross-border transfer controls.',                                                  weight:0.20 },
    { key:'security',     name:'Security Safeguards & Breach Response', shortName:'Security', description:'Reasonable technical and organisational safeguards, 72-hour breach notification to the Data Protection Board and affected individuals.',                                              weight:0.25 },
    { key:'rights',       name:'Individual Rights & Grievance',     shortName:'Rights',       description:'Access, correction, erasure, nomination rights. Grievance redressal mechanism. 90-day response SLA. Data Protection Board escalation readiness.',                                    weight:0.15 },
    { key:'vendor',       name:'Vendor & Cross-Border Management',  shortName:'Vendor',       description:'Data Processor contracts, third-party assessments, sub-processor controls, and cross-border transfer compliance with MeitY\'s trusted jurisdiction list.',                          weight:0.12 },
    { key:'complianceGov',name:'Compliance Governance',             shortName:'Governance',   description:'DPO appointment, DPIA process, records of processing, board oversight, gap assessment, privacy-by-design, and readiness for Data Protection Board scrutiny.', weight:0.06, isOutcome:true },
  ],
  vlBenchmarks:{
    bfsi:         { consent:3.4, dataGov:3.5, security:3.6, rights:3.2, vendor:3.0, complianceGov:3.4 },
    it:           { consent:3.3, dataGov:3.4, security:3.5, rights:3.1, vendor:3.2, complianceGov:3.2 },
    telecom:      { consent:2.9, dataGov:2.9, security:3.0, rights:2.7, vendor:2.6, complianceGov:2.8 },
    retail:       { consent:2.8, dataGov:2.7, security:2.6, rights:2.5, vendor:2.6, complianceGov:2.6 },
    fmcg:         { consent:2.5, dataGov:2.4, security:2.5, rights:2.3, vendor:2.2, complianceGov:2.3 },
    manufacturing:{ consent:2.1, dataGov:2.2, security:2.3, rights:2.0, vendor:1.9, complianceGov:2.0 },
    healthcare:   { consent:2.6, dataGov:2.5, security:2.7, rights:2.4, vendor:2.3, complianceGov:2.5 },
    logistics:    { consent:2.3, dataGov:2.2, security:2.3, rights:2.1, vendor:2.1, complianceGov:2.1 },
    auto:         { consent:2.4, dataGov:2.4, security:2.5, rights:2.2, vendor:2.1, complianceGov:2.3 },
    energy:       { consent:2.4, dataGov:2.5, security:2.6, rights:2.2, vendor:2.1, complianceGov:2.3 },
    realestate:   { consent:2.0, dataGov:2.0, security:2.1, rights:1.9, vendor:1.8, complianceGov:1.9 },
    education:    { consent:2.2, dataGov:2.1, security:2.2, rights:2.0, vendor:1.9, complianceGov:2.0 },
    agriculture:  { consent:1.8, dataGov:1.8, security:1.9, rights:1.7, vendor:1.6, complianceGov:1.7 },
    government:   { consent:2.2, dataGov:2.4, security:2.5, rights:2.1, vendor:2.0, complianceGov:2.3 },
  },
  sizeMulti:{
    1:{ consent:0.58, dataGov:0.52, security:0.44, rights:0.56, vendor:0.50, complianceGov:0.40 },
    2:{ consent:0.68, dataGov:0.63, security:0.56, rights:0.66, vendor:0.61, complianceGov:0.52 },
    3:{ consent:0.78, dataGov:0.74, security:0.68, rights:0.76, vendor:0.72, complianceGov:0.66 },
    4:{ consent:0.88, dataGov:0.86, security:0.83, rights:0.87, vendor:0.85, complianceGov:0.81 },
    5:{ consent:1.00, dataGov:1.00, security:1.00, rights:1.00, vendor:1.00, complianceGov:1.00 },
  },
  indFlex:{ bfsi:+0.06, it:+0.05, telecom:+0.02, healthcare:+0.02, retail:+0.01, fmcg:0, auto:0, energy:+0.01, logistics:-0.01, education:-0.01, realestate:-0.02, government:0, manufacturing:-0.03, agriculture:-0.04 },
  questions:[
    {id:'DP1', text:'We maintain standalone, itemised privacy notices for each processing activity, written in plain language and independently understandable.', dim:'consent'},
    {id:'DP2', text:'Consent withdrawal is as easy as consent collection — technically implemented across all our digital channels.', dim:'consent'},
    {id:'DP3', text:'We have a documented and tested process to obtain and verify parental consent before processing personal data of children under 18.', dim:'consent'},
    {id:'DP4', text:'Data principals are notified at least 48 hours before their personal data is erased, allowing them to opt to preserve it.', dim:'consent'},
    {id:'DP5', text:'Privacy notices are available in English and, where applicable, in the Schedule 8 languages relevant to our data principals.', dim:'consent'},
    {id:'DP6', text:'Consent records are maintained with timestamps, specific purpose descriptions, and evidence of the notice provided at collection.', dim:'consent'},
    {id:'DP7', text:'We have assessed and documented the lawful basis (consent or legitimate use) for every category of personal data we process.', dim:'consent'},
    {id:'DP8', text:'Consent management processes are reviewed and updated whenever our processing purposes change.', dim:'consent'},
    {id:'DG1', text:'We maintain a comprehensive data inventory documenting all personal data collected, its purpose, storage location, and retention period.', dim:'dataGov'},
    {id:'DG2', text:'Personal data processing is strictly limited to the specified purpose for which consent was obtained — no secondary use without fresh consent.', dim:'dataGov'},
    {id:'DG3', text:'We collect only the minimum personal data necessary for each stated purpose (data minimisation is actively enforced, not aspirational).', dim:'dataGov'},
    {id:'DG4', text:'Retention schedules are formally defined and operationally enforced — personal data is deleted or anonymised when its purpose is served.', dim:'dataGov'},
    {id:'DG5', text:'Personal data is classified by sensitivity and appropriate access, encryption, and handling controls are applied based on classification.', dim:'dataGov'},
    {id:'DG6', text:'Cross-border data transfers are mapped and occur only to countries on MeitY\'s approved trusted jurisdiction list, or under equivalent safeguards.', dim:'dataGov'},
    {id:'DG7', text:'Data flows across internal systems and to third parties are documented through up-to-date, verified data flow diagrams.', dim:'dataGov'},
    {id:'DG8', text:'We have identified all Data Processors we engage and documented the categories of personal data shared with each.', dim:'dataGov'},
    {id:'DS1', text:'Reasonable technical and organisational security safeguards are implemented, proportionate to the volume and sensitivity of personal data processed.', dim:'security'},
    {id:'DS2', text:'A personal data breach response plan exists, has been tested within the last 12 months, and can activate within the 72-hour regulatory reporting window.', dim:'security'},
    {id:'DS3', text:'Breach notification processes are operationally ready to cover both the Data Protection Board and affected data principals without undue delay.', dim:'security'},
    {id:'DS4', text:'Access controls, encryption at rest and in transit, and real-time monitoring are applied to all systems processing personal data.', dim:'security'},
    {id:'DS5', text:'Periodic security assessments — including vulnerability assessments and penetration testing — are conducted on systems handling personal data.', dim:'security'},
    {id:'DS6', text:'Incident logs are maintained for all suspected or confirmed personal data breaches, including near-misses and false positives.', dim:'security'},
    {id:'DS7', text:'Employee training on data security obligations and DPDP Act requirements is conducted at least annually and completion is tracked.', dim:'security'},
    {id:'DS8', text:'We have controls to detect and contain data exfiltration, unauthorised access, and insider threats across personal data environments.', dim:'security'},
    {id:'DR1', text:'A publicly available, easily accessible mechanism exists for data principals to request access to, correction of, or erasure of their personal data.', dim:'rights'},
    {id:'DR2', text:'All data principal requests — access, correction, erasure, nomination — are resolved within the 90-day statutory requirement.', dim:'rights'},
    {id:'DR3', text:'A grievance redressal mechanism for data privacy complaints is published on our website or app and is actively monitored with defined SLAs.', dim:'rights'},
    {id:'DR4', text:'The process for data principals to nominate another person to exercise data rights on their behalf is defined, documented, and operationally functional.', dim:'rights'},
    {id:'DR5', text:'Systems can execute verified erasure requests completely — including backups, logs, and downstream data stores — not just front-end deletion.', dim:'rights'},
    {id:'DR6', text:'We have a documented process to respond to Data Protection Board complaints and to cooperate with Board investigations.', dim:'rights'},
    {id:'DR7', text:'Consent withdrawal is handled in near-real-time and triggers cessation of processing across all linked systems within a defined SLA.', dim:'rights'},
    {id:'DR8', text:'Data principal rights requests are logged, tracked, and reported to leadership as part of ongoing compliance monitoring.', dim:'rights'},
    {id:'DV1', text:'All Data Processors are engaged under written contracts that explicitly bind them to comply with DPDP Act obligations on our behalf.', dim:'vendor'},
    {id:'DV2', text:'We assess the security and compliance posture of Data Processors before engagement and at defined periodic intervals.', dim:'vendor'},
    {id:'DV3', text:'Contracts with Data Processors prohibit engagement of sub-processors without our explicit prior written approval.', dim:'vendor'},
    {id:'DV4', text:'Cross-border data transfers are assessed and restricted to MeitY-notified trusted jurisdictions or equivalent approved mechanisms.', dim:'vendor'},
    {id:'DV5', text:'We maintain an up-to-date register of all third-party processors, sub-processors, and the personal data categories shared with each.', dim:'vendor'},
    {id:'DV6', text:'Vendor contracts include breach notification obligations aligned with the DPDP Act\'s 72-hour reporting requirement.', dim:'vendor'},
    {id:'DV7', text:'We conduct periodic audits or compliance reviews of key Data Processor obligations and document findings.', dim:'vendor'},
    {id:'DV8', text:'There is a formal offboarding process for Data Processors that ensures deletion or return of all personal data upon contract termination.', dim:'vendor'},
    {id:'DC1', text:'A Data Protection Officer or designated privacy lead has been appointed with a clear mandate, adequate authority, and board-level reporting access.', dim:'complianceGov'},
    {id:'DC2', text:'A Data Protection Impact Assessment (DPIA) process has been established and is conducted for all high-risk processing activities before deployment.', dim:'complianceGov'},
    {id:'DC3', text:'Records of processing activities (ROPA) are maintained, reviewed, and updated as our data practices change.', dim:'complianceGov'},
    {id:'DC4', text:'The board or senior leadership receives regular, structured updates on DPDP compliance status, open gaps, and data breach risk.', dim:'complianceGov'},
    {id:'DC5', text:'A formal DPDP gap assessment has been completed and an active remediation roadmap with assigned ownership and deadlines is being executed.', dim:'complianceGov'},
    {id:'DC6', text:'Privacy-by-design principles are formally embedded in our product and system development and procurement lifecycle.', dim:'complianceGov'},
    {id:'DC7', text:'We monitor DPDP enforcement actions, Board orders, and regulatory guidance to keep our compliance programme current.', dim:'complianceGov'},
    {id:'DC8', text:'An external privacy audit or independent compliance assessment has been conducted or is formally scheduled within the current cycle.', dim:'complianceGov'},
  ],
  recs:{
    consent:{
      low:['Draft and publish standalone, itemised privacy notices for each data processing activity in plain language.','Build a consent management system that captures, stores, and enables withdrawal of consent at the individual level.','Map all your processing activities to establish what lawful basis applies to each — consent or legitimate use.'],
      mid:['Audit all digital touchpoints to ensure consent mechanisms are as easy to withdraw as to give — technically enforce this.','Implement a parental consent verification workflow for any products or services accessible to under-18s.','Ensure privacy notices are available in all Schedule 8 languages relevant to your customer base.'],
      high:['Conduct an end-to-end consent lifecycle audit — from collection through withdrawal through deletion — with automated enforcement.','Implement a Consent Manager integration or equivalent to enable data principals to manage consents across touchpoints.','Build automated re-consent workflows triggered by changes in processing purpose.'],
    },
    dataGov:{
      low:['Conduct an enterprise-wide data discovery exercise to build your first personal data inventory across all systems.','Define and document retention schedules for every category of personal data — start with the highest-volume categories.','Map all cross-border data flows and assess each against MeitY\'s trusted jurisdiction requirements.'],
      mid:['Implement automated data lifecycle management — retention enforcement, deletion workflows, and audit trails.','Enforce data minimisation at the collection stage — remove unnecessary fields from all forms and APIs.','Build and maintain verified data flow diagrams covering all internal systems, processors, and cross-border transfers.'],
      high:['Deploy a data governance platform with real-time classification, lineage tracking, and policy enforcement.','Integrate data minimisation and purpose limitation checks into your engineering and product development lifecycle.','Establish a continuous data inventory programme with automated drift detection for new data stores and processing activities.'],
    },
    security:{
      low:['Conduct a baseline security assessment of all systems processing personal data and remediate critical gaps immediately.','Develop and document a personal data breach response plan with clear roles, timelines, and the 72-hour notification procedure.','Implement basic access controls, encryption, and logging on all systems storing or transmitting personal data.'],
      mid:['Test your breach response plan with a tabletop drill — simulate detection, containment, notification, and Board reporting.','Extend penetration testing and vulnerability assessments to cover all personal data systems at least annually.','Deploy a Security Information and Event Management (SIEM) system for real-time monitoring of personal data environments.'],
      high:['Achieve ISO 27001 or SOC 2 Type II certification as a formal demonstration of reasonable security safeguards.','Implement automated breach detection with sub-hour response capability and pre-approved notification templates.','Build a continuous compliance monitoring platform that provides real-time visibility into your DPDP security posture.'],
    },
    rights:{
      low:['Build and publish a rights request mechanism on your website or app — cover access, correction, erasure, and nomination.','Define an internal SLA of 72 hours for triaging rights requests to ensure the 90-day statutory deadline is consistently met.','Appoint and train a team responsible for managing and responding to data principal rights requests.'],
      mid:['Implement technical erasure capability that deletes personal data across all systems — including backups — within a defined SLA.','Create an automated rights request tracking system that logs receipt, status, and completion of each request.','Develop a formal process for responding to Data Protection Board complaints, including template responses and legal escalation paths.'],
      high:['Deploy a self-service privacy portal where data principals can exercise all rights digitally and track request status.','Implement a real-time consent withdrawal engine that propagates cessation of processing across all linked systems within minutes.','Benchmark your rights response performance against best practice and report completion rates to leadership quarterly.'],
    },
    vendor:{
      low:['Audit all existing vendor contracts and add DPDP-compliant Data Processing Agreements (DPAs) to each.','Build a register of all Data Processors and the personal data categories shared — prioritise by data volume and sensitivity.','Include breach notification obligations aligned to the 72-hour DPDP requirement in all new and renewed vendor contracts.'],
      mid:['Implement a vendor onboarding process that includes a mandatory DPDP compliance assessment before any personal data is shared.','Restrict sub-processor engagements contractually and implement a process to approve and log all sub-processor additions.','Conduct annual compliance reviews of top-tier Data Processors by data volume or processing sensitivity.'],
      high:['Build a vendor trust portal that provides real-time visibility into the compliance posture of your Data Processor ecosystem.','Implement automated cross-border transfer controls that enforce the MeitY trusted jurisdiction list at the data flow level.','Achieve contractual audit rights with all material Data Processors and exercise them on a risk-based rotation cycle.'],
    },
    complianceGov:{
      low:['Appoint a Data Protection Officer or privacy lead with explicit authority, resources, and board-level reporting access.','Conduct a formal DPDP gap assessment against the Act and Rules and document your remediation roadmap with owners and deadlines.','Establish Records of Processing Activities (ROPA) as the foundation of your compliance programme.'],
      mid:['Implement a DPIA process and conduct DPIAs for all existing high-risk processing activities within 90 days.','Embed privacy-by-design into your product and systems development lifecycle — make it a gate, not an afterthought.','Schedule quarterly DPDP compliance reviews with senior leadership and report open risks to the board.'],
      high:['Achieve readiness for Data Protection Board scrutiny — conduct an independent external privacy audit and publish findings internally.','Build a continuous compliance monitoring programme with automated controls testing against DPDP obligations.','Contribute to industry DPDP forums and peer benchmarking to maintain leading-edge programme maturity.'],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT 5 — AI GOVERNANCE READINESS
// ═══════════════════════════════════════════════════════════════════════════════
const AI_GOV = {
  id:'aiGov', name:'AI Governance Readiness', badge:'05',
  tagline:'Is your AI deployment responsible, accountable, and regulator-ready?',
  outcomeDimKey:'aiOutcomes',
  outcomeDimLabel:'AI Value & Responsible Outcomes',
  outcomeDesc:'Measurable evidence that your AI systems are delivering value responsibly, fairly, and without material incidents.',
  dimColors:{ aiStrategy:'#4338ca', dataEthics:'#0369a1', transparency:'#022c22', riskMgmt:'#c2410c', humanOversight:'#7c3aed', aiOutcomes:'#b45309' },
  levelDescs:[
    'AI is deployed informally with no governance. No policies, no accountability, no oversight. Significant legal and reputational exposure.',
    'AI governance awareness is growing. Basic policies exist but are not consistently applied or enforced.',
    'AI governance frameworks are in place for key use cases. Risk management and oversight are operational but incomplete.',
    'AI governance is mature and proactive. Systems are transparent, human-overseen, and aligned with regulatory expectations.',
    'AI governance is a strategic differentiator. Demonstrably responsible, sector-leading, and continuously improving.',
  ],
  dimensions:[
    { key:'aiStrategy',     name:'AI Strategy & Governance',           shortName:'AI Strategy',    description:'Board-approved AI governance framework, risk classification, accountability allocation, and alignment with MeitY AI Governance Guidelines and sector-specific regulations.',                 weight:0.22 },
    { key:'dataEthics',     name:'Data Quality & Ethics in AI',        shortName:'Data & Ethics',  description:'Training data governance, bias audits, DPDP compliance for AI data, fairness metrics, and ongoing monitoring for data drift and model degradation.',                                      weight:0.20 },
    { key:'transparency',   name:'Algorithmic Transparency & Explainability', shortName:'Transparency', description:'Explainable AI for consequential decisions, model documentation, disclosure of AI use, labelling of AI-generated content, and audit trails.',                              weight:0.22 },
    { key:'riskMgmt',       name:'Risk Management & AI Safety',        shortName:'AI Risk',        description:'AI risk assessments, adversarial testing, fail-safe mechanisms, incident management, generative AI risk controls, and third-party AI component assessment.',                             weight:0.20 },
    { key:'humanOversight', name:'Human Oversight & Control',          shortName:'Human Oversight',description:'Human-in-the-loop for high-risk decisions, override capabilities, AI literacy of oversight personnel, escalation processes, and accountability assignment per system.',                 weight:0.10 },
    { key:'aiOutcomes',     name:'AI Value & Responsible Outcomes',    shortName:'AI Outcomes',    description:'Measurable value delivered, fairness and compliance metrics, absence of material incidents, and stakeholder trust in AI systems.',                                                       weight:0.06, isOutcome:true },
  ],
  vlBenchmarks:{
    bfsi:         { aiStrategy:3.0, dataEthics:3.1, transparency:2.8, riskMgmt:3.1, humanOversight:2.9, aiOutcomes:2.9 },
    it:           { aiStrategy:3.2, dataEthics:3.1, transparency:2.9, riskMgmt:3.0, humanOversight:2.8, aiOutcomes:3.0 },
    telecom:      { aiStrategy:2.6, dataEthics:2.7, transparency:2.5, riskMgmt:2.6, humanOversight:2.4, aiOutcomes:2.5 },
    retail:       { aiStrategy:2.3, dataEthics:2.4, transparency:2.1, riskMgmt:2.2, humanOversight:2.0, aiOutcomes:2.2 },
    fmcg:         { aiStrategy:2.2, dataEthics:2.3, transparency:2.0, riskMgmt:2.2, humanOversight:2.1, aiOutcomes:2.2 },
    manufacturing:{ aiStrategy:2.0, dataEthics:2.1, transparency:1.9, riskMgmt:2.0, humanOversight:1.9, aiOutcomes:1.9 },
    healthcare:   { aiStrategy:2.4, dataEthics:2.5, transparency:2.2, riskMgmt:2.4, humanOversight:2.5, aiOutcomes:2.3 },
    logistics:    { aiStrategy:1.9, dataEthics:2.0, transparency:1.8, riskMgmt:1.9, humanOversight:1.8, aiOutcomes:1.8 },
    auto:         { aiStrategy:2.2, dataEthics:2.2, transparency:2.0, riskMgmt:2.1, humanOversight:2.0, aiOutcomes:2.1 },
    energy:       { aiStrategy:2.1, dataEthics:2.2, transparency:2.0, riskMgmt:2.2, humanOversight:2.0, aiOutcomes:2.0 },
    realestate:   { aiStrategy:1.7, dataEthics:1.8, transparency:1.6, riskMgmt:1.7, humanOversight:1.6, aiOutcomes:1.7 },
    education:    { aiStrategy:2.1, dataEthics:2.2, transparency:2.0, riskMgmt:2.0, humanOversight:2.1, aiOutcomes:2.0 },
    agriculture:  { aiStrategy:1.6, dataEthics:1.7, transparency:1.5, riskMgmt:1.6, humanOversight:1.5, aiOutcomes:1.5 },
    government:   { aiStrategy:2.0, dataEthics:2.1, transparency:1.9, riskMgmt:2.0, humanOversight:2.1, aiOutcomes:1.9 },
  },
  sizeMulti:{
    1:{ aiStrategy:0.44, dataEthics:0.50, transparency:0.44, riskMgmt:0.48, humanOversight:0.55, aiOutcomes:0.48 },
    2:{ aiStrategy:0.56, dataEthics:0.62, transparency:0.56, riskMgmt:0.60, humanOversight:0.65, aiOutcomes:0.59 },
    3:{ aiStrategy:0.70, dataEthics:0.74, transparency:0.70, riskMgmt:0.73, humanOversight:0.76, aiOutcomes:0.72 },
    4:{ aiStrategy:0.85, dataEthics:0.87, transparency:0.85, riskMgmt:0.86, humanOversight:0.88, aiOutcomes:0.86 },
    5:{ aiStrategy:1.00, dataEthics:1.00, transparency:1.00, riskMgmt:1.00, humanOversight:1.00, aiOutcomes:1.00 },
  },
  indFlex:{ it:+0.08, bfsi:+0.06, healthcare:+0.02, telecom:+0.02, retail:+0.01, fmcg:0, auto:0, education:+0.01, energy:0, logistics:-0.02, realestate:-0.02, government:0, manufacturing:-0.03, agriculture:-0.05 },
  questions:[
    {id:'AG1', text:'Our organisation has a board-approved AI governance policy covering the development, procurement, deployment, and ongoing monitoring of AI systems.', dim:'aiStrategy'},
    {id:'AG2', text:'There is a designated AI governance lead, committee, or equivalent function with clear authority, defined KPIs, and accountability to senior leadership.', dim:'aiStrategy'},
    {id:'AG3', text:'AI systems are formally classified by risk level (high, medium, low) with greater oversight, documentation, and controls applied to higher-risk systems.', dim:'aiStrategy'},
    {id:'AG4', text:'AI governance considerations — risk, ethics, regulatory alignment — are integrated into our procurement and build-vs-buy decisions for AI tools and models.', dim:'aiStrategy'},
    {id:'AG5', text:'Our AI governance framework aligns with the MeitY India AI Governance Guidelines (Nov 2025) and applicable sector-specific requirements (RBI FREE-AI, SEBI, ICMR, IRDAI).', dim:'aiStrategy'},
    {id:'AG6', text:'AI-related risks are formally included in our enterprise risk management framework and reviewed by the board or risk committee at least annually.', dim:'aiStrategy'},
    {id:'AG7', text:'There is a formal approval process for new AI use cases before deployment, including accountability assignment and regulatory compliance review.', dim:'aiStrategy'},
    {id:'AG8', text:'Responsibility among AI developers, deployers, and end-users is clearly allocated in written policy — accountability does not fall into undefined gaps.', dim:'aiStrategy'},
    {id:'AE1', text:'Training data for AI systems is documented for provenance, quality, known limitations, and potential sources of bias before use in model development.', dim:'dataEthics'},
    {id:'AE2', text:'Bias audits are conducted on AI models that affect individuals — particularly those used in hiring, lending, pricing, insurance, or customer decisions.', dim:'dataEthics'},
    {id:'AE3', text:'Personal data used for AI training or inference complies with DPDP Act requirements — consent, purpose limitation, minimisation, and retention.', dim:'dataEthics'},
    {id:'AE4', text:'We maintain a data lineage record — from source to model to output — for all personal or sensitive data used in production AI systems.', dim:'dataEthics'},
    {id:'AE5', text:'There are controls preventing the use of sensitive personal data (health, financial, biometric, children\'s data) in AI training without explicit, documented safeguards.', dim:'dataEthics'},
    {id:'AE6', text:'Production AI systems are monitored for data drift, distributional shift, and degradation in output quality, with defined thresholds for escalation.', dim:'dataEthics'},
    {id:'AE7', text:'Fairness metrics are defined, measured, and tracked for AI systems that make or influence decisions impacting individuals.', dim:'dataEthics'},
    {id:'AE8', text:'There is a documented process to identify, remediate, and log bias or fairness violations discovered in deployed AI systems.', dim:'dataEthics'},
    {id:'AT1', text:'AI systems used for decisions that materially affect individuals (credit, employment, insurance, healthcare) can provide an explanation of the basis for that decision.', dim:'transparency'},
    {id:'AT2', text:'We maintain model cards or equivalent documentation covering architecture, training data summary, known limitations, and decision logic for all deployed AI systems.', dim:'transparency'},
    {id:'AT3', text:'Where required by regulation or contract, automated AI decisions are disclosed to affected individuals in plain, accessible language.', dim:'transparency'},
    {id:'AT4', text:'AI-generated or AI-assisted content — text, images, recommendations, scores — is clearly labelled to end users in all customer-facing applications.', dim:'transparency'},
    {id:'AT5', text:'For AI systems subject to DPDP Significant Data Fiduciary obligations or sector regulations, we have conducted an algorithm transparency assessment.', dim:'transparency'},
    {id:'AT6', text:'Internal audit or independent review of AI decision outputs is conducted at defined intervals to verify consistency, fairness, and regulatory alignment.', dim:'transparency'},
    {id:'AT7', text:'All deployed AI systems have documented human override mechanisms that allow qualified personnel to challenge, adjust, or reverse automated decisions.', dim:'transparency'},
    {id:'AT8', text:'Individuals adversely affected by AI decisions have a clear, accessible mechanism to seek human review and a meaningful redressal pathway.', dim:'transparency'},
    {id:'AR1', text:'A formal AI risk assessment is conducted for all significant AI systems before production deployment — outputs are documented and tracked to closure.', dim:'riskMgmt'},
    {id:'AR2', text:'Adversarial testing or red-teaming is conducted for high-risk AI systems to identify failure modes, edge cases, and potential for misuse.', dim:'riskMgmt'},
    {id:'AR3', text:'AI systems have defined fail-safe mechanisms that default to conservative or human-reviewed outputs under uncertainty, anomalous inputs, or low-confidence conditions.', dim:'riskMgmt'},
    {id:'AR4', text:'A documented AI incident management process exists — covering detection, containment, notification, root cause analysis, and remediation of AI-related failures or harms.', dim:'riskMgmt'},
    {id:'AR5', text:'We assess the potential societal and ethical impacts of AI systems — including discriminatory or disproportionate outcomes — as a gate in the deployment process.', dim:'riskMgmt'},
    {id:'AR6', text:'AI systems in production are continuously monitored for performance degradation, unexpected outputs, and signs of misuse or adversarial manipulation.', dim:'riskMgmt'},
    {id:'AR7', text:'We have evaluated and mitigated specific risks from generative AI use — including hallucinations, deepfakes, prompt injection, and data leakage via LLM APIs.', dim:'riskMgmt'},
    {id:'AR8', text:'Third-party AI components, APIs, and foundation models used in our products are formally assessed for risk — including vendor reliability, model provenance, and terms of service.', dim:'riskMgmt'},
    {id:'AH1', text:'All high-risk AI systems operate with defined human oversight — no fully autonomous AI makes consequential decisions affecting individuals without human review.', dim:'humanOversight'},
    {id:'AH2', text:'We have formally defined what constitutes a consequential AI decision that requires human-in-the-loop verification, and this definition is operationally enforced.', dim:'humanOversight'},
    {id:'AH3', text:'Personnel responsible for overseeing AI systems are trained in AI literacy, system limitations, bias recognition, and appropriate escalation protocols.', dim:'humanOversight'},
    {id:'AH4', text:'Human override capabilities are technically implemented, accessible to authorised personnel, and tested regularly to confirm they function as designed.', dim:'humanOversight'},
    {id:'AH5', text:'Clear escalation paths exist when AI system outputs conflict with human judgement, company policy, regulatory requirements, or ethical principles.', dim:'humanOversight'},
    {id:'AH6', text:'A named owner is formally assigned to each deployed AI system — accountable for its outputs, performance, compliance, and lifecycle management.', dim:'humanOversight'},
    {id:'AH7', text:'Processes exist to suspend, roll back, or decommission AI systems that exhibit harmful, biased, or non-compliant behaviour — with defined trigger criteria.', dim:'humanOversight'},
    {id:'AH8', text:'Periodic human reviews of AI system decision samples are conducted to validate alignment with intended objectives, fairness standards, and regulatory requirements.', dim:'humanOversight'},
    {id:'AO1', text:'AI systems in production are delivering measurable, documented value aligned with the stated business objectives defined at deployment approval.', dim:'aiOutcomes'},
    {id:'AO2', text:'AI system performance, fairness, and compliance metrics are tracked, reviewed by leadership, and reported on a defined cadence.', dim:'aiOutcomes'},
    {id:'AO3', text:'AI-driven decisions have not resulted in material regulatory, legal, consumer protection, or reputational incidents in the past 12 months.', dim:'aiOutcomes'},
    {id:'AO4', text:'Customer, employee, and regulator trust in our AI systems is assessed through structured feedback mechanisms and shows stable or improving trends.', dim:'aiOutcomes'},
    {id:'AO5', text:'Our AI deployments have contributed positively to operational efficiency, revenue, or customer outcomes — with quantified evidence reviewed by leadership.', dim:'aiOutcomes'},
    {id:'AO6', text:'A mechanism exists to receive and act on external complaints or concerns about AI system outputs, with documented response and remediation processes.', dim:'aiOutcomes'},
    {id:'AO7', text:'AI governance and outcome metrics are disclosed appropriately in regulatory filings, annual reports, or sustainability and BRSR disclosures.', dim:'aiOutcomes'},
    {id:'AO8', text:'Our AI governance programme is benchmarked against recognised external frameworks (ISO 42001, NIST AI RMF, MeitY Guidelines) at least annually.', dim:'aiOutcomes'},
  ],
  recs:{
    aiStrategy:{
      low:['Appoint a named AI governance lead or committee with board-level visibility and a mandate to establish policy within 90 days.','Conduct an AI inventory — catalogue every AI system in production or development, its purpose, data inputs, and decision scope.','Develop a foundational AI governance policy aligned to the MeitY India AI Governance Guidelines (Nov 2025).'],
      mid:['Implement a risk classification framework for AI systems and assign appropriate oversight tiers — treat high-risk AI differently.','Integrate AI governance review into your product development and procurement approval processes as a formal gate.','Include AI risk formally in your enterprise risk management framework and report to the board at least annually.'],
      high:['Build an AI governance programme aligned to ISO 42001 or NIST AI RMF for internationally recognised accountability.','Engage sector-specific regulators (RBI, SEBI, IRDAI, ICMR) proactively to demonstrate AI governance maturity.','Publish an annual AI governance and responsible AI report with performance metrics and independent validation.'],
    },
    dataEthics:{
      low:['Establish a data governance protocol specifically for AI training data — covering provenance, quality assessment, and bias screening.','Conduct an audit of all personal data used in existing AI systems to verify DPDP Act compliance (consent, purpose, minimisation).','Define and document fairness metrics for any AI system that makes or influences decisions affecting individuals.'],
      mid:['Implement bias auditing as a mandatory pre-deployment step for all AI systems in hiring, lending, insurance, or customer decisions.','Build a data lineage tracking capability to trace data from source through model training to production output.','Deploy continuous monitoring for data drift and model degradation across all production AI systems.'],
      high:['Achieve third-party bias audit certification for high-risk AI systems and publish summary findings.','Build an AI ethics review board with external membership to provide independent oversight of high-stakes AI deployments.','Implement fairness-aware machine learning practices across model development — fairness by design, not post-hoc correction.'],
    },
    transparency:{
      low:['Implement explainability mechanisms for all AI systems making consequential individual decisions — start with the highest-impact use cases.','Create model cards or equivalent documentation for every deployed AI system — architecture, data, limitations, decision logic.','Establish a disclosure standard for AI-generated and AI-assisted content in all customer-facing applications.'],
      mid:['Conduct an algorithm transparency assessment for AI systems falling under DPDP Significant Data Fiduciary or sector regulations.','Implement an accessible human review pathway for individuals adversely affected by automated AI decisions.','Integrate model documentation into your AI deployment approval process — no model goes live without a complete model card.'],
      high:['Achieve explainable AI across all high-risk decision systems — move beyond "black box" to auditable, contestable outputs.','Participate in industry algorithmic transparency standards development (BIS, ISO) to shape India-specific best practice.','Publish regular model performance and transparency disclosures aligned to emerging SEBI and RBI algorithmic accountability expectations.'],
    },
    riskMgmt:{
      low:['Conduct AI risk assessments for all production AI systems retroactively — start with highest-risk (credit, health, hiring) use cases.','Develop an AI incident response plan — define what constitutes an AI incident, who is notified, and how it is contained.','Implement fail-safe defaults for all AI systems — any system should degrade gracefully to human decision-making under uncertainty.'],
      mid:['Conduct adversarial testing or red-teaming for high-risk AI systems before and after major model updates.','Implement continuous production monitoring for AI systems — automated alerts for performance degradation, outliers, and misuse signals.','Conduct a specific generative AI risk assessment covering hallucination, prompt injection, and data leakage for all LLM-based products.'],
      high:['Build a formal AI safety programme with dedicated red-team capability and regular third-party AI security assessments.','Integrate AI risk into your business continuity and crisis management frameworks — including AI system failure scenarios.','Contribute to national AI safety forums under the IndiaAI Safety Institute and align internal practices to emerging Indian AI safety standards.'],
    },
    humanOversight:{
      low:['Define and document which AI systems require human-in-the-loop oversight and implement that oversight technically and operationally.','Assign a named accountability owner to every deployed AI system — accountability must not be diffuse or unspecified.','Provide AI literacy training for all personnel who oversee, review, or act on AI system outputs.'],
      mid:['Test human override mechanisms for all high-risk AI systems at least semi-annually and document results.','Formalise escalation processes for AI-human conflicts — clear criteria for when humans must override AI.','Conduct periodic human sample audits of AI decision outputs to validate consistency, fairness, and policy alignment.'],
      high:['Implement a continuous human oversight programme with defined review frequencies scaled to AI system risk classification.','Build a cross-functional AI oversight committee with business, legal, ethics, and technical representation.','Develop and publish your human oversight standards — position this as a public commitment to responsible AI deployment.'],
    },
    aiOutcomes:{
      low:['Define measurable success metrics for each AI system at deployment — financial, operational, and fairness KPIs.','Build a basic AI performance dashboard that tracks value delivered and flags systems performing below defined thresholds.','Implement a feedback mechanism for customers and employees to raise concerns about AI system outputs.'],
      mid:['Quantify and report AI business value to leadership on a quarterly basis — connect AI performance to business outcomes.','Include AI incident data (near-misses, complaints, corrections) in your risk reporting to the board.','Align AI outcome disclosures with BRSR requirements and sector-specific regulatory expectations.'],
      high:['Publish annual AI performance and governance disclosures benchmarked against ISO 42001 and NIST AI RMF.','Achieve independent third-party validation of AI fairness and value claims for high-stakes deployments.','Position AI governance and outcome transparency as a competitive differentiator in investor communications and customer relationships.'],
    },
  },
};

const CONFIGS = { analytics: ANALYTICS, esg: ESG, dei: DEI, dpdp: DPDP, aiGov: AI_GOV };


const IND_SCROLL = ['BFSI','IT & ITeS','Telecom','Retail','FMCG','Manufacturing','Healthcare','Logistics','Auto','Energy','Real Estate','Education','Agriculture','Government'];

function calcResults(config, answers, profile) {
  const bench = getBenchmark(config, profile?.industry||'it', profile?.companySize||5);
  const scores = config.dimensions.map(d => {
    const score = dimScoreFn(config.questions, answers, d.key);
    const bScore = bench[d.key] || 2.5;
    return { key:d.key, name:d.name, score, bScore, gap:Number((score-bScore).toFixed(1)), level:getLevel(score,config.levelDescs) };
  });
  const caps = scores.filter(d=>d.key!==config.outcomeDimKey);
  const tw   = config.dimensions.filter(d=>!d.isOutcome).reduce((a,d)=>a+d.weight,0);
  const overall   = Number((caps.reduce((a,d)=>{ const dim=config.dimensions.find(x=>x.key===d.key); return a+d.score*dim.weight; },0)/tw).toFixed(1));
  const benchOver = Number((caps.reduce((a,d)=>{ const dim=config.dimensions.find(x=>x.key===d.key); return a+d.bScore*dim.weight; },0)/tw).toFixed(1));
  const outScore  = scores.find(d=>d.key===config.outcomeDimKey)?.score||0;
  return { overall, benchOver, outScore, scores };
}

// ─── CERTIFICATE SYSTEM ──────────────────────────────────────────────────────
const CERT_TIERS = [
  { id:'gold',   label:'Gold',   name:'Pramanik Leading',    minScore:4.2,
    color:'#047857', bg:'#ecfdf5', border:'#a7f3d0', badge:'#047857',
    tagline:'Sector-leading maturity. Validated against Indian industry benchmarks.',
    perks:['Gold Certificate — display in RFPs, investor decks, website','Pramanik Leading digital badge for LinkedIn & email signature','Listed on Pramanik Annual India Leaders Registry','Priority access to Verified Assessment (consultant co-signed)','12-month validity with year-on-year Progress Report on renewal'],
  },
  { id:'silver', label:'Silver', name:'Pramanik Advanced',   minScore:3.4,
    color:'#059669', bg:'#d1fae5', border:'#6ee7b7', badge:'#059669',
    tagline:'Robust programme, above benchmark for your sector and company size.',
    perks:['Silver Certificate PDF','Pramanik Advanced digital badge','12-month validity with annual Progress Report','Eligible to upgrade to Gold via Verified Assessment'],
  },
  { id:'bronze', label:'Bronze', name:'Pramanik Developing',  minScore:2.5,
    color:'#10b981', bg:'#a7f3d0', border:'#34d399', badge:'#10b981',
    tagline:'Baseline practices in place. A documented starting point for improvement.',
    perks:['Bronze Certificate PDF','12-month validity — renewal shows progress trajectory','Benchmark gap report included','Roadmap to Silver with prioritised actions'],
  },
];
function getCertTier(score) { return CERT_TIERS.find(t=>score>=t.minScore)||null; }

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ onLogoClick, label, T, showLogin, onLoginClick }) => {
  const dark = !!T;
  return (
    <nav style={{ background:dark?T.bg:'#fff', borderBottom:dark?`1px solid rgba(255,255,255,0.1)`:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:60 }}>
      <button onClick={onLogoClick} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:6, background:dark?T.mid:'#047857', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'white', fontSize:13, fontWeight:700, fontFamily:'Libre Baskerville,serif' }}>P</span>
        </div>
        <span className="fd" style={{ color:dark?T.text:'#022c22', fontSize:'1.0rem' }}>
          Pramanik <span style={{ color:dark?'rgba(255,255,255,0.35)':'#9ca3af', fontFamily:'Inter,sans-serif', fontWeight:400, fontSize:'0.8rem', letterSpacing:'0.03em' }}>· Enterprise Maturity Platform</span>
        </span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {label && <span style={{ fontSize:11, color:dark?'rgba(255,255,255,0.4)':'#9ca3af', letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>}
        {showLogin && (
          <button onClick={onLoginClick} style={{ background:'#047857', color:'white', border:'none', borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>Log In</button>
        )}
      </div>
    </nav>
  );
};

// ─── HOME ─────────────────────────────────────────────────────────────────────
const ASSESSMENTS = [
  { id:'analytics', n:'01', name:'Analytics Maturity Index',     shortName:'Analytics', theme:THEMES.analytics,
    tagline:'How analytically competitive is your organisation?',
    desc:'Benchmark analytics capability across six dimensions — leadership, data systems, human capital, culture, and catalysts — against Indian industry peers. Built on a patented methodology.',
    dims:['Leadership & Strategy','IT & Data Systems','Human Capital','Org & Culture','Maturity Catalysts','Value & Benefits'],
    questions:50, time:'~10 min', icon:'◈', patented:true,
    lightBg:'#f0fdf4', lightAccent:'#022c22', lightMid:'#047857', lightBorder:'#bbf7d0' },
  { id:'esg', n:'02', name:'ESG Readiness Assessment',           shortName:'ESG', theme:THEMES.esg,
    tagline:'Are you truly BRSR-ready — and investor-grade?',
    desc:'Evaluate ESG maturity against SEBI BRSR and GRI standards — governance, environment, social, and supply chain. Calibrated for Indian enterprises by industry and company size.',
    dims:['Governance & Ethics','Environmental Mgmt','Social & Human Capital','ESG Strategy','Supply Chain','Reporting & Disclosure'],
    questions:50, time:'~12 min', icon:'◉', patented:false,
    lightBg:'#f0fdf4', lightAccent:'#022c22', lightMid:'#047857', lightBorder:'#bbf7d0' },
  { id:'dei', n:'03', name:'DEI Maturity Index',                  shortName:'DEI', theme:THEMES.dei,
    tagline:'How inclusive is your organisation — really?',
    desc:'Assess DEI maturity through an India-first lens — gender equity, RPWD Act compliance, social equity, and the cultural practices that make inclusion real.',
    dims:['Gender Equity','Inclusion Culture','DEI Leadership','Social Equity','Disability & Access','Measurement'],
    questions:50, time:'~12 min', icon:'◎', patented:false,
    lightBg:'#f0fdf4', lightAccent:'#022c22', lightMid:'#047857', lightBorder:'#bbf7d0' },
  { id:'dpdp', n:'04', name:'Data Privacy & DPDP Readiness',     shortName:'DPDP', theme:THEMES.dpdp,
    tagline:'Are you ready for the DPDP Act before the deadline?',
    desc:"Assess readiness against India's DPDP Act 2023 and Rules 2025 — consent, data governance, security safeguards, individual rights, and vendor compliance. Deadline: May 2027.",
    dims:['Consent & Notice','Data Governance','Security & Breach','Individual Rights','Vendor Management','Compliance Gov'],
    questions:48, time:'~12 min', icon:'◫', patented:false,
    lightBg:'#f0fdf4', lightAccent:'#022c22', lightMid:'#047857', lightBorder:'#bbf7d0' },
  { id:'aiGov', n:'05', name:'AI Governance Readiness',           shortName:'AI Gov', theme:THEMES.aiGov,
    tagline:'Is your AI deployment responsible and regulator-ready?',
    desc:'Evaluate AI governance against MeitY India AI Governance Guidelines, RBI FREE-AI Framework, and SEBI algorithmic accountability requirements.',
    dims:['AI Strategy','Data & Ethics','Transparency','Risk Management','Human Oversight','AI Outcomes'],
    questions:48, time:'~12 min', icon:'◬', patented:false,
    lightBg:'#f0fdf4', lightAccent:'#022c22', lightMid:'#047857', lightBorder:'#bbf7d0' },
];

const Home = ({ onSelect }) => {
  const [hovered, setHovered] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    supabase.from('global_assessment_totals').select('*').then(({ data }) => {
      if (data) {
        const sm = {};
        data.forEach(d => sm[d.assessment_type] = d);
        setStats(sm);
      }
    });
  }, []);

  return (
    <div style={{ background:'#fff' }}>

      {/* HERO */}
      <section style={{ background:'linear-gradient(-45deg, #f0fdf4, #ffffff, #ecfdf5)', backgroundSize:'400% 400%', animation:'subtleBg 15s ease infinite', borderBottom:'1px solid #d1fae5', padding:'100px 64px 80px' }}>
        <div className="animate-up" style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:'#047857', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(4,120,87,0.3)' }}>
              <span style={{ color:'white', fontSize:13, fontWeight:700, fontFamily:'Libre Baskerville,serif' }}>P</span>
            </div>
            <span style={{ fontSize:11, color:'#047857', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:600 }}>Pramanik · Enterprise Maturity Platform · India</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:64, alignItems:'center' }}>
            <div>
              <h1 className="fd" style={{ fontSize:'clamp(2.8rem,5vw,4.4rem)', color:'#022c22', lineHeight:1.05, marginBottom:20 }}>
                Know where your enterprise truly stands.
              </h1>
              <p style={{ fontSize:16, color:'#374151', lineHeight:1.8, maxWidth:480, marginBottom:32 }}>
                Five rigorous diagnostic tools built for Indian enterprises — each grounded in published research, benchmarked by industry and company size, and producing an instant prioritised action plan.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
                {ASSESSMENTS.slice(0,3).map(a=>(
                  <button key={a.id} onClick={()=>onSelect(a.id)} style={{ background:a.lightAccent, color:'white', border:'none', borderRadius:7, padding:'11px 20px', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 4px 12px rgba(2,44,34,0.15)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>{a.shortName} →</button>
                ))}
                {ASSESSMENTS.slice(3).map(a=>(
                  <button key={a.id} onClick={()=>onSelect(a.id)} style={{ background:'white', color:a.lightAccent, border:`1px solid ${a.lightBorder}`, borderRadius:7, padding:'11px 20px', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.background='#f0fdf4'; e.currentTarget.style.transform='translateY(-2px)';}} onMouseOut={e=>{e.currentTarget.style.background='white'; e.currentTarget.style.transform='translateY(0)';}}>{a.shortName} →</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
                {['Free & confidential','Instant benchmarked report','Pramanik Certificate on completion'].map(t=>(
                  <span key={t} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#4b5563' }}>
                    <span style={{ color:'#047857', fontWeight:700 }}>✓</span>{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="animate-up delay-1">
              {[['250+','diagnostic questions across five frameworks'],['14','Indian industry benchmarks per assessment'],['3','certificate tiers — Bronze, Silver, Gold']].map(([n,l],i)=>(
                <div key={n} style={{ display:'flex', alignItems:'baseline', gap:14, padding:'18px 0', borderBottom:i<2?'1px solid #d1fae5':'' }}>
                  <span className="fd" style={{ fontSize:'2.8rem', color:'#022c22', flexShrink:0, lineHeight:1 }}>{n}</span>
                  <span style={{ fontSize:13, color:'#6b7280', lineHeight:1.5 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ASSESSMENT CARDS */}
      <section className="animate-up delay-2" style={{ padding:'80px 64px', maxWidth:1160, margin:'0 auto', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23047857\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")' }}>
        <div style={{ marginBottom:48, textAlign: 'center' }}>
          <p style={{ fontSize:11, color:'#047857', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, marginBottom:10 }}>The five assessments</p>
          <h2 className="fd" style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', color:'#022c22' }}>Choose your diagnostic</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
          {ASSESSMENTS.map((a, idx)=>{
            const h=hovered===a.id;
            return (
              <div key={a.id} onMouseEnter={()=>setHovered(a.id)} onMouseLeave={()=>setHovered(null)}
                className="glass-card animate-zoom"
                style={{ borderRadius:16, padding:'32px 24px', display:'flex', flexDirection:'column', animationDelay: `${idx * 0.1}s` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:a.lightMid, letterSpacing:'0.12em' }}>{a.n}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {a.patented && <span style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'#065f46', background:'#d1fae5', border:'1px solid #6ee7b7', padding:'2px 7px', borderRadius:20 }}>Patented</span>}
                    <span style={{ fontSize:20, color:a.lightMid, opacity:0.8, transform: h ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s' }}>{a.icon}</span>
                  </div>
                </div>
                <h3 className="fd" style={{ fontSize:'1.35rem', color:'#0d1117', marginBottom:7, lineHeight:1.2 }}>{a.name}</h3>
                <p style={{ fontSize:12, color:a.lightMid, marginBottom:16, fontStyle:'italic' }}>{a.tagline}</p>
                <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.65, marginBottom:24, flex:1 }}>{a.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:24 }}>
                  {a.dims.map(d=>(
                    <div key={d} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:4, height:4, borderRadius:'50%', background:a.lightMid, display:'block', flexShrink:0, opacity:0.7 }} />
                      <span style={{ fontSize:11, color:'#6b7280' }}>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ paddingTop:16, borderTop:`1px solid ${a.lightBorder}`, marginBottom:20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize:11, color:'#9ca3af' }}>{a.questions} questions · {a.time} · Certificate eligible</span>
                  {stats[a.id] && (
                    <span style={{ fontSize:11, fontWeight: 600, color: a.lightMid }}>Global Average: {stats[a.id].average_score}/5.0 ({stats[a.id].total_completions} taken)</span>
                  )}
                </div>
                <button onClick={()=>onSelect(a.id)} style={{ background:h?a.lightAccent:'transparent', color:h?'white':a.lightMid, border:`1px solid ${h?a.lightAccent:a.lightBorder}`, borderRadius:8, padding:'11px 18px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.3s' }}>
                  <span>Begin Assessment</span><span style={{ transform: h ? 'translateX(4px)' : 'translateX(0)', transition:'transform 0.3s' }}>→</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', padding:'14px 0', overflow:'hidden', background:'#f0fdf4' }}>
        <div style={{ display:'flex', animation:'marquee 32s linear infinite', width:'max-content' }}>
          {[...IND_SCROLL,...IND_SCROLL].map((ind,i)=>(
            <span key={i} style={{ fontSize:11, color:'#10b981', letterSpacing:'0.06em', padding:'0 28px', whiteSpace:'nowrap', borderRight:'1px solid #d1fae5', textTransform:'uppercase', fontWeight:500 }}>{ind}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="animate-up delay-3" style={{ padding:'100px 64px', maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
        <div>
          <p style={{ fontSize:11, color:'#047857', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, marginBottom:16 }}>How it works</p>
          <h2 className="fd" style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', color:'#022c22', marginBottom:20, lineHeight:1.1 }}>
            From first question<br /><span className="fdi" style={{ color:'#10b981' }}>to Pramanik Certificate,</span><br />in under 15 minutes.
          </h2>
          <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.8 }}>No sign-up, no waiting. Complete an assessment and receive your full benchmarked report and certificate instantly.</p>
        </div>
        <div>
          {[['Select your assessment','Choose from five frameworks. Each is fully independent and self-contained.'],['Profile your organisation','Select industry and annual turnover to calibrate your benchmark against Indian peers.'],['Answer the diagnostic','Rate each statement 1–5. Takes under 15 minutes.'],['Receive your report and certificate','Instant score, benchmark comparison, action plan, and Pramanik Certificate if eligible.']].map(([t,d],i)=>(
            <div key={t} style={{ display:'flex', gap:18, padding:'20px 0', borderBottom:i<3?'1px solid #e5e7eb':'' }}>
              <span style={{ width:32, height:32, borderRadius:'50%', background:'#022c22', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#a7f3d0', fontFamily:'Inter,sans-serif' }}>0{i+1}</span>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:'#0d1117', marginBottom:4 }}>{t}</p>
                <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATE SECTION */}
      <section className="animate-up delay-4" style={{ background:'linear-gradient(to bottom, #ffffff, #f0fdf4)', borderTop:'1px solid #d1fae5', padding:'100px 64px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
            <div>
              <p style={{ fontSize:11, color:'#047857', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, marginBottom:16 }}>Pramanik Certificate</p>
              <h2 className="fd" style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', color:'#022c22', marginBottom:20, lineHeight:1.1 }}>A credential worth displaying.</h2>
              <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.8, marginBottom:32 }}>Every assessment produces a scored, benchmarked certificate valid for 12 months. Use it in RFPs, investor decks, and recruitment to demonstrate verified maturity.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[['Bronze — EMS Developing','2.5+ score','Baseline practices documented'],['Silver — Pramanik Advanced','3.4+ score','Above benchmark for sector & size'],['Gold — Pramanik Leading','4.2+ score','Sector-leading, India Leaders Registry']].map(([name,score,desc],i)=>{
                  const colors=[['#10b981','#ecfdf5','#a7f3d0'],['#059669','#d1fae5','#6ee7b7'],['#047857','#a7f3d0','#34d399']];
                  const [c,bg,bd]=colors[i];
                  return (
                    <div key={name} style={{ background:bg, border:`1px solid ${bd}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, transition:'transform 0.2s', cursor:'default' }} onMouseOver={e=>e.currentTarget.style.transform='translateX(8px)'} onMouseOut={e=>e.currentTarget.style.transform='translateX(0)'}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${bd}` }}>
                        <span style={{ color:'white', fontSize:13, fontWeight:700 }}>{['B','S','G'][i]}</span>
                      </div>
                      <div>
                        <p style={{ fontSize:14, fontWeight:600, color:'#022c22' }}>{name}</p>
                        <p style={{ fontSize:13, color:'#065f46' }}>{score} · {desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background:'#fffbeb', border:'2px solid #f59e0b', borderRadius:16, padding:32, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-30, right:-30, fontSize:140, opacity:0.05, color:'#d97706' }}>◆</div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#d97706', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontSize:14, fontWeight:700 }}>G</span>
                </div>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#d97706' }}>Gold Certificate · Sample</p>
                  <p style={{ fontSize:12, color:'#78350f', fontWeight:500 }}>Pramanik Leading</p>
                </div>
                <span style={{ marginLeft:'auto', fontSize:10, color:'#78350f', background:'white', border:'1px solid #fcd34d', padding:'3px 10px', borderRadius:20 }}>Valid 12 months</span>
              </div>
              <div style={{ borderTop:'1px solid #fcd34d', borderBottom:'1px solid #fcd34d', padding:'14px 0', marginBottom:18 }}>
                <p style={{ fontSize:11, color:'#78350f', marginBottom:4 }}>This certifies that</p>
                <p className="fd" style={{ fontSize:'1.3rem', color:'#0d1117' }}>Your Organisation</p>
                <p style={{ fontSize:12, color:'#6b7280' }}>Analytics Maturity Index · Very Large · BFSI</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:16 }}>
                <div>
                  <p style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Overall Score</p>
                  <p className="fd" style={{ fontSize:'2.2rem', color:'#d97706', lineHeight:1 }}>4.4<span style={{ fontSize:13, color:'#9ca3af' }}>/5.0</span></p>
                </div>
                <div style={{ width:1, height:40, background:'#fcd34d' }} />
                <div>
                  <p style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Issued</p>
                  <p style={{ fontSize:13, color:'#0d1117', fontWeight:500 }}>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
              </div>
              <p style={{ fontSize:11, color:'#92400e', fontStyle:'italic', lineHeight:1.6 }}>Sector-leading analytics maturity — validated against Indian industry benchmarks by Pramanik, India's Enterprise Maturity Platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ background:'#022c22', padding:'44px 64px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', gap:48, flexWrap:'wrap', justifyContent:'space-between', alignItems:'center' }}>
          {[['Patented methodology','Analytics framework protected under Indian patent law — the only validated maturity model built for Indian enterprises.'],['India-specific benchmarks','Calibrated by industry and company size for 14 Indian sectors — not adapted from Western data.'],['Pramanik Certificate','A 12-month credential accepted in RFPs, investor decks, and regulatory conversations.']].map(([t,d])=>(
            <div key={t} style={{ display:'flex', gap:14, alignItems:'flex-start', maxWidth:300 }}>
              <span style={{ color:'#10b981', flexShrink:0, marginTop:1, fontSize:16 }}>✓</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'white', marginBottom:3 }}>{t}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 64px', maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:32 }}>
        <div>
          <h2 className="fd" style={{ fontSize:'clamp(1.8rem,3vw,2.4rem)', color:'#022c22', marginBottom:10 }}>Ready to find out where you stand?</h2>
          <p style={{ fontSize:15, color:'#6b7280', maxWidth:400, lineHeight:1.7 }}>Free, confidential, no sign-up. Get your benchmarked report and Pramanik Certificate in minutes.</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {ASSESSMENTS.map(a=>(
            <button key={a.id} onClick={()=>onSelect(a.id)} style={{ background:a.lightBg, color:a.lightAccent, border:`1px solid ${a.lightBorder}`, borderRadius:7, padding:'12px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>{a.shortName} →</button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid #e5e7eb', padding:'24px 64px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:22, height:22, borderRadius:5, background:'#047857', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'white', fontSize:11, fontWeight:700, fontFamily:'Libre Baskerville,serif' }}>P</span>
          </div>
          <span className="fd" style={{ color:'#022c22', fontSize:13 }}>Pramanik</span>
          <span style={{ fontSize:11, color:'#9ca3af' }}>· Enterprise Maturity Platform · India</span>
        </div>
        <span style={{ fontSize:11, color:'#9ca3af' }}>© 2025 · Patented methodology · For Indian enterprises</span>
      </footer>
    </div>
  );
};

// ─── PROFILE STEP ─────────────────────────────────────────────────────────────
const ProfileStep = ({ config, profile, onComplete, onBack }) => {
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [size, setSize]         = useState(profile?.companySize || null);
  const T     = THEMES[config.id] || THEMES.analytics;
  const sel   = INDUSTRIES.find(i=>i.value===industry);
  const bench = (industry&&size) ? getBenchmark(config,industry,size) : null;
  const ready = !!(industry&&size);
  const proceed = () => {
    if(!ready) return;
    const sz=SIZES.find(s=>s.value===size);
    onComplete({ industry, industryName:sel.label, companySize:size, companySizeName:sz.name });
  };
  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:T.bg, display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      <div style={{ padding:'48px 56px', display:'flex', flexDirection:'column', justifyContent:'center', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onBack} style={{ color:'rgba(255,255,255,0.55)', fontSize:13, background:'none', border:'none', cursor:'pointer', marginBottom:36, textAlign:'left' }}>← Back</button>
        <p style={{ fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:T.text, marginBottom:14 }}>Step 1 of 2 — Your organisation</p>
        <h2 className="fd" style={{ color:'#fff', fontSize:'1.9rem', marginBottom:12 }}>Tell us about your organisation</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.75, marginBottom:40 }}>Your industry and company size calibrate your benchmark against comparable Indian enterprises.</p>
        <label style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.55)', marginBottom:8, display:'block' }}>Industry</label>
        <div style={{ position:'relative', marginBottom:24 }}>
          <select value={industry} onChange={e=>setIndustry(e.target.value)} style={{ width:'100%', padding:'12px 40px 12px 16px', background:'#ffffff', border:'1px solid #d1d5db', borderRadius:7, color:industry?'#111827':'#9ca3af', fontSize:14, outline:'none', cursor:'pointer', appearance:'none', WebkitAppearance:'none', fontFamily:'Inter,sans-serif' }}>
            <option value="" style={{ color:'#9ca3af' }}>— Select your industry —</option>
            {INDUSTRIES.map(i=><option key={i.value} value={i.value} style={{ color:'#111827', background:'#ffffff' }}>{i.label}</option>)}
          </select>
          <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#6b7280', fontSize:10 }}>▼</span>
        </div>
        <label style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.55)', marginBottom:8, display:'block' }}>Annual Turnover</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:36 }}>
          {SIZES.map(s=>{ const sel2=size===s.value; return (
            <button key={s.value} onClick={()=>setSize(s.value)} style={{ padding:'12px 16px', borderRadius:7, textAlign:'left', cursor:'pointer', background:sel2?T.btn:'rgba(255,255,255,0.08)', border:sel2?`2px solid ${T.mid}`:'1px solid rgba(255,255,255,0.2)', transition:'all 0.15s' }}>
              <span style={{ fontSize:14, fontWeight:600, color:'#fff', display:'block' }}>{s.name}</span>
              <span style={{ fontSize:12, color:sel2?T.text:'rgba(255,255,255,0.45)', marginTop:2, display:'block' }}>{s.range}</span>
            </button>
          );})}
        </div>
        <button onClick={proceed} disabled={!ready} style={{ background:ready?T.btn:'rgba(255,255,255,0.1)', color:ready?'#fff':'rgba(255,255,255,0.35)', border:ready?'none':'1px solid rgba(255,255,255,0.15)', borderRadius:7, padding:'14px 28px', fontSize:14, fontWeight:600, cursor:ready?'pointer':'not-allowed', display:'inline-flex', alignItems:'center', gap:10, transition:'all 0.2s', fontFamily:'Inter,sans-serif' }}>
          Begin Assessment →
        </button>
      </div>
      <div style={{ background:T.bg2, padding:'48px 56px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:28 }}>
          <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.14em', color:T.text, marginBottom:22, fontWeight:600 }}>Benchmark preview</p>
          {bench ? (
            <>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:22, fontWeight:500 }}>{sel?.label.split('(')[0].trim()} · {SIZES.find(s=>s.value===size)?.name}</p>
              {config.dimensions.filter(d=>!d.isOutcome).map(d=>(
                <div key={d.key} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', width:90, flexShrink:0 }}>{d.shortName}</span>
                  <div style={{ flex:1, height:5, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:T.mid, borderRadius:3, width:`${(bench[d.key]/5)*100}%`, transition:'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize:13, color:T.text, fontWeight:600, width:28, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{bench[d.key]}</span>
                </div>
              ))}
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:22, lineHeight:1.65 }}>Calibrated by industry and company size against Indian peer data.</p>
            </>
          ) : (
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', lineHeight:1.7 }}>Select your industry and annual turnover above to preview your benchmark.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ASSESSMENT VIEW ──────────────────────────────────────────────────────────
const AssessmentView = ({ config, answers, dimIdx, onAnswer, onChangeDim, onComplete, onBack, isComplete, industryName, companySizeName }) => {
  const T     = THEMES[config.id] || THEMES.analytics;
  const dim   = config.dimensions[dimIdx];
  const dimQs = config.questions.filter(q=>q.dim===dim.key);
  const total = config.questions.length;
  const done  = Object.keys(answers).length;
  const pct   = total>0?(done/total)*100:0;
  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:'#f8f7f5', display:'grid', gridTemplateColumns:'220px 1fr' }}>
      <aside style={{ background:T.bg, padding:24, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width:20, height:20, borderRadius:4, background:T.mid, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'white', fontSize:10, fontWeight:700, fontFamily:'Libre Baskerville,serif' }}>P</span>
          </div>
          <span className="fd" style={{ color:T.text, fontSize:11 }}>Pramanik</span>
        </div>
        {industryName && (
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', background:'rgba(255,255,255,0.07)', borderRadius:6, padding:'10px 12px', marginBottom:20, lineHeight:1.5 }}>
            <span style={{ color:T.mid, display:'block', marginBottom:2 }}>{industryName.split('(')[0].trim()}</span>{companySizeName}
          </div>
        )}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          {config.dimensions.map((d,i)=>{
            const active=i===dimIdx;
            const isDone=dimCompleteFn(config.questions,answers,d.key);
            const sc=dimScoreFn(config.questions,answers,d.key);
            return (
              <button key={d.key} onClick={()=>onChangeDim(i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:6, background:active?'rgba(255,255,255,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background:isDone?T.mid:active?T.text:'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize:12, flex:1, color:active?'white':isDone?T.text:'rgba(255,255,255,0.6)', fontWeight:active?600:400 }}>{d.shortName}</span>
                {isDone&&<span style={{ fontSize:11, color:T.text, fontWeight:600 }}>{sc}</span>}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.12)' }}>
          <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>Progress</p>
          <div style={{ height:2, background:'rgba(255,255,255,0.15)', borderRadius:1 }}>
            <div style={{ height:'100%', background:T.mid, borderRadius:1, width:`${pct}%`, transition:'width 0.4s' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:10, color:'rgba(255,255,255,0.45)' }}>
            <span>{done} answered</span><span>{total} total</span>
          </div>
        </div>
      </aside>
      <main style={{ padding:'40px 64px', maxWidth:760 }}>
        <p style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:T.accent, marginBottom:8 }}>Dimension {dimIdx+1} of {config.dimensions.length}</p>
        <h2 className="fd" style={{ fontSize:'2rem', color:'#0d1117', marginBottom:12 }}>{dim.name}</h2>
        <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.7, marginBottom:32 }}>{dim.description}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {dimQs.map((q,qi)=>{
            const answered=answers[q.id]!=null;
            return (
              <div key={q.id} style={{ background:'white', border:answered?`1px solid ${T.accent}`:'1px solid #e5e7eb', borderRadius:12, padding:20, boxShadow:answered?`0 0 0 3px ${T.accent}14`:'0 2px 6px rgba(0,0,0,0.04)', transition:'all 0.15s' }}>
                <p style={{ fontSize:10, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Q{qi+1}</p>
                <p style={{ fontSize:14, color:'#0d1117', lineHeight:1.65, marginBottom:16 }}>{q.text}</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                  {[1,2,3,4,5].map(v=>(
                    <button key={v} onClick={()=>onAnswer(q.id,v)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 4px', borderRadius:8, border:answers[q.id]===v?`1px solid ${T.accent}`:'1px solid transparent', background:answers[q.id]===v?T.highlight:'#f8f7f5', cursor:'pointer', transition:'all 0.1s' }}>
                      <span style={{ fontSize:16, fontWeight:700, color:answers[q.id]===v?T.bg:'#9ca3af' }}>{v}</span>
                      <span style={{ fontSize:9, color:answers[q.id]===v?T.accent:'#9ca3af', lineHeight:1.2, textAlign:'center' }}>{SCALE[v-1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:32, paddingTop:24, borderTop:'1px solid #e5e7eb' }}>
          <button onClick={()=>dimIdx===0?onBack():onChangeDim(dimIdx-1)} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:6, border:'1px solid #e5e7eb', background:'white', color:'#0d1117', fontSize:14, cursor:'pointer' }}>
            ← {dimIdx===0?'Profile':'Previous'}
          </button>
          <span style={{ fontSize:12, color:'#9ca3af' }}>{dimIdx+1} / {config.dimensions.length}</span>
          {dimIdx===config.dimensions.length-1 ? (
            <button onClick={onComplete} disabled={!isComplete} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:6, border:'none', background:isComplete?T.btn:`${T.btn}40`, color:isComplete?'white':'rgba(255,255,255,0.4)', fontSize:14, fontWeight:600, cursor:isComplete?'pointer':'not-allowed' }}>
              View Results →
            </button>
          ) : (
            <button onClick={()=>onChangeDim(dimIdx+1)} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:6, border:'none', background:T.btn, color:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>Next →</button>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── SIMULATOR ────────────────────────────────────────────────────────────────
const Simulator = ({ config, dimScores, originalOverall, benchOver }) => {
  const T = THEMES[config.id] || THEMES.analytics;
  const init = {};
  dimScores.forEach(d=>{ init[d.key]=d.score; });
  const [vals, setVals] = useState(init);
  const [open, setOpen] = useState(true);
  const sim = useMemo(()=>{
    const caps=config.dimensions.filter(d=>!d.isOutcome);
    const tw=caps.reduce((a,d)=>a+d.weight,0);
    const ws=caps.reduce((a,d)=>a+(vals[d.key]||0)*d.weight,0);
    const simO=Number((ws/tw).toFixed(1));
    return { simO, delta:Number((simO-originalOverall).toFixed(1)), level:getLevel(simO,config.levelDescs) };
  },[vals,originalOverall]);
  const hasChanges=dimScores.some(d=>Math.abs(vals[d.key]-d.score)>0.05);
  const resetVals=()=>{ const r={}; dimScores.forEach(d=>{r[d.key]=d.score;}); setVals(r); };
  return (
    <div style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', textAlign:'left', background:'none', border:'none', cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:8, background:T.highlight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎛️</div>
          <div><h3 className="fd" style={{ fontSize:'1.05rem', color:'#0d1117' }}>What-If Simulator</h3><p style={{ fontSize:12, color:'#9ca3af' }}>Adjust scores to see how your overall maturity would change</p></div>
        </div>
        <span style={{ color:'#9ca3af', transform:open?'rotate(180deg)':'none', transition:'transform 0.2s', fontSize:12 }}>▼</span>
      </button>
      {open && (
        <div style={{ padding:'0 24px 24px', borderTop:'1px solid #e5e7eb' }}>
          <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap', padding:'18px 0', borderBottom:'1px solid #e5e7eb', marginBottom:20 }}>
            <div style={{ flex:1, minWidth:140 }}>
              <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9ca3af', display:'block', marginBottom:4 }}>Simulated Score</span>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span className="fd" style={{ fontSize:'3rem', color:T.bg }}>{sim.simO.toFixed(1)}</span>
                <span style={{ fontSize:13, color:'#9ca3af' }}>/5.0</span>
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9ca3af', display:'block', marginBottom:4 }}>Change</span>
              <span className="fd" style={{ fontSize:'1.8rem', color:sim.delta>0?T.accent:sim.delta<0?'#b91c1c':'#9ca3af' }}>{sim.delta>0?'+':''}{sim.delta.toFixed(1)}</span>
            </div>
            <div style={{ width:1, height:44, background:'#e5e7eb' }} />
            <div style={{ textAlign:'center' }}>
              <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9ca3af', display:'block', marginBottom:4 }}>Level</span>
              <span style={{ fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:20, background:sim.level.color, color:'white' }}>{sim.level.name}</span>
            </div>
            <div style={{ width:1, height:44, background:'#e5e7eb' }} />
            <div style={{ textAlign:'center' }}>
              <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9ca3af', display:'block', marginBottom:4 }}>Benchmark</span>
              <span className="fd" style={{ fontSize:'1.8rem', color:'#9ca3af' }}>{benchOver.toFixed(1)}</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {config.dimensions.filter(d=>!d.isOutcome).map(dim=>{
              const orig=dimScores.find(d=>d.key===dim.key);
              const curr=vals[dim.key]||0;
              const os=orig?.score||0;
              const diff=Number((curr-os).toFixed(1));
              return (
                <div key={dim.key}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:config.dimColors[dim.key]||T.accent }} />
                      <span style={{ fontSize:13, fontWeight:500, color:'#0d1117' }}>{dim.name}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:14, fontWeight:600 }}>{curr.toFixed(1)}</span>
                      {Math.abs(diff)>0.05&&<span style={{ fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:4, background:diff>0?T.highlight:'#fef2f2', color:diff>0?T.accent:'#dc2626' }}>{diff>0?'+':''}{diff.toFixed(1)}</span>}
                    </div>
                  </div>
                  <div style={{ position:'relative' }}>
                    <input type="range" min={1} max={5} step={0.1} value={curr} onChange={e=>setVals(p=>({...p,[dim.key]:Number(Number(e.target.value).toFixed(1))}))} />
                    <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', width:2, height:14, background:'rgba(0,0,0,0.2)', borderRadius:1, pointerEvents:'none', left:`${((os-1)/4)*100}%` }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:3, fontSize:10, color:'#9ca3af' }}><span>1.0</span><span>5.0</span></div>
                </div>
              );
            })}
          </div>
          {hasChanges&&<div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'flex-end' }}><button onClick={resetVals} style={{ padding:'8px 14px', borderRadius:6, border:'1px solid #e5e7eb', background:'white', color:'#0d1117', fontSize:12, cursor:'pointer' }}>↺ Reset to Actual Scores</button></div>}
        </div>
      )}
    </div>
  );
};

// ─── CERTIFICATE PANEL ────────────────────────────────────────────────────────
const CertificatePanel = ({ config, overall, profile, onRetake }) => {
  const T    = THEMES[config.id] || THEMES.analytics;
  const tier = getCertTier(overall);
  const [showVerified, setShowVerified] = useState(false);
  const expiryStr = (() => { const d=new Date(); d.setFullYear(d.getFullYear()+1); return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); })();
  const tierIdx  = tier ? CERT_TIERS.indexOf(tier) : -1;
  const nextTier = tierIdx > 0 ? CERT_TIERS[tierIdx-1] : null;
  const gapToNext = nextTier ? Number((nextTier.minScore-overall).toFixed(1)) : null;
  return (
    <div style={{ marginBottom:40 }}>
      <h2 className="fd" style={{ fontSize:'1.6rem', color:'#0d1117', marginBottom:4 }}>Your Pramanik Certificate</h2>
      <p style={{ fontSize:13, color:'#9ca3af', marginBottom:28 }}>Based on your score, you qualify for the certificate tier below. Valid for 12 months from today.</p>
      {tier ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Certificate preview */}
          <div style={{ background:tier.bg, border:`2px solid ${tier.border}`, borderRadius:14, padding:28, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, fontSize:110, opacity:0.05, color:tier.badge }}>◆</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:tier.badge, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontSize:13, fontWeight:700 }}>{tier.label[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:tier.badge }}>{tier.label} Certificate</p>
                  <p style={{ fontSize:12, color:tier.color, fontWeight:500 }}>{tier.name}</p>
                </div>
              </div>
              <span style={{ fontSize:10, color:tier.color, background:'white', border:`1px solid ${tier.border}`, padding:'3px 10px', borderRadius:20, fontWeight:500 }}>Valid 12 months</span>
            </div>
            <div style={{ borderTop:`1px solid ${tier.border}`, borderBottom:`1px solid ${tier.border}`, padding:'14px 0', marginBottom:18 }}>
              <p style={{ fontSize:11, color:tier.color, marginBottom:5 }}>This certifies that</p>
              <p className="fd" style={{ fontSize:'1.3rem', color:'#0d1117', marginBottom:3 }}>{profile.industryName.split('(')[0].trim()}</p>
              <p style={{ fontSize:12, color:'#6b7280' }}>{profile.companySizeName} · {config.name}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:16 }}>
              <div>
                <p style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Overall Score</p>
                <p className="fd" style={{ fontSize:'2.2rem', color:tier.badge, lineHeight:1 }}>{overall.toFixed(1)}<span style={{ fontSize:13, color:'#9ca3af' }}>/5.0</span></p>
              </div>
              <div style={{ width:1, height:36, background:tier.border }} />
              <div>
                <p style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Expires</p>
                <p style={{ fontSize:12, color:'#0d1117', fontWeight:500 }}>{expiryStr}</p>
              </div>
            </div>
            <p style={{ fontSize:11, color:tier.color, lineHeight:1.6, fontStyle:'italic', marginBottom:18 }}>{tier.tagline}</p>
            <p style={{ fontSize:10, color:tier.color, marginBottom:16 }}>Issued by Pramanik · India's Enterprise Maturity Platform</p>
            <button onClick={()=>window.print()} style={{ background:tier.badge, color:'white', border:'none', borderRadius:7, padding:'11px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              ↓ Download Certificate (PDF)
            </button>
          </div>

          {/* Right panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, padding:22 }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9ca3af', marginBottom:14 }}>Included with your certificate</p>
              {tier.perks.map((p,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:9 }}>
                  <span style={{ color:tier.badge, fontSize:13, flexShrink:0, marginTop:1 }}>✓</span>
                  <span style={{ fontSize:13, color:'#0d1117', lineHeight:1.5 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop:18, paddingTop:14, borderTop:'1px solid #e5e7eb' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'#0d1117' }}>Full Report + Certificate</p>
                    <p style={{ fontSize:11, color:'#9ca3af' }}>Complete benchmarked report, action plan, and certificate PDF</p>
                  </div>
                  <span className="fd" style={{ fontSize:'1.2rem', color:T.btn }}>₹6,999</span>
                </div>
                <button style={{ width:'100%', background:T.btn, color:'white', border:'none', borderRadius:7, padding:'11px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Get Full Report + Certificate →
                </button>
              </div>
            </div>

            {nextTier && (
              <div style={{ background:nextTier.bg, border:`1px solid ${nextTier.border}`, borderRadius:12, padding:18 }}>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:nextTier.badge, marginBottom:8 }}>
                  {gapToNext<=0.5?'🎯 Almost there —':'📈 Path to'} {nextTier.label} Certificate
                </p>
                <p style={{ fontSize:13, color:nextTier.color, lineHeight:1.6, marginBottom:12 }}>
                  You need <strong>{gapToNext} more points</strong> to reach {nextTier.name}. Your action plan above shows exactly what to improve.
                </p>
                <button onClick={onRetake} style={{ background:'white', color:nextTier.badge, border:`1px solid ${nextTier.border}`, borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Improve & Retake →
                </button>
              </div>
            )}

            {/* Verified Assessment */}
            <div style={{ background:'#0d1117', borderRadius:12, padding:22, color:'white' }}>
              <p style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Pramanik Verified Assessment</p>
              <p style={{ fontSize:14, fontWeight:600, color:'white', marginBottom:6 }}>Need externally credible certification?</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.65, marginBottom:14 }}>A Pramanik consultant reviews and validates your responses against evidence, then co-signs the report. Accepted in investor due diligence, BRSR submissions, and regulatory conversations.</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                <div><p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>One-time fee</p><p className="fd" style={{ fontSize:'1.5rem', color:'white' }}>₹49,999</p></div>
                <div style={{ textAlign:'right' }}><p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>Turnaround</p><p style={{ fontSize:13, color:'white', fontWeight:500 }}>5–7 business days</p></div>
              </div>
              {['Consultant-validated responses against documentary evidence','Independent co-signed assessment report','Eligible for ISO 42001 / BRSR Core assurance pathway','Accepted in RFPs, investor decks, and regulatory filings'].map((f,i)=>(
                <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:7 }}>
                  <span style={{ color:T.mid, fontSize:12, flexShrink:0, marginTop:1 }}>✓</span>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
              <button onClick={()=>setShowVerified(!showVerified)} style={{ marginTop:14, width:'100%', background:T.btn, color:'white', border:'none', borderRadius:7, padding:'11px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Request Verified Assessment →
              </button>
              {showVerified&&(
                <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.65 }}>
                    Email your assessment details to <strong style={{ color:'white' }}>verify@pramanik.in</strong> — a consultant will contact you within one business day to begin the evidence review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background:'#f8f7f5', border:'1px solid #e5e7eb', borderRadius:14, padding:32 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:20 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>📋</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:15, fontWeight:600, color:'#0d1117', marginBottom:8 }}>Certificate not yet unlocked</p>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7, marginBottom:20 }}>
                A score of <strong>2.5 or above</strong> qualifies for the Bronze Pramanik Certificate. Your current score of <strong>{overall.toFixed(1)}</strong> is <strong>{(2.5-overall).toFixed(1)} points</strong> away. Work through the action plan below and retake the assessment.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
                {CERT_TIERS.slice().reverse().map(t=>(
                  <div key={t.id} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, padding:14, textAlign:'center' }}>
                    <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:t.badge, marginBottom:4 }}>{t.label}</p>
                    <p className="fd" style={{ fontSize:'1.4rem', color:t.color }}>{t.minScore}+</p>
                    <p style={{ fontSize:11, color:'#9ca3af' }}>{t.name}</p>
                  </div>
                ))}
              </div>
              <button onClick={onRetake} style={{ background:T.btn, color:'white', border:'none', borderRadius:7, padding:'11px 22px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Work on gaps and retake →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── RESULTS ──────────────────────────────────────────────────────────────────
const Results = ({ config, res, profile, onRetake, onLogoClick }) => {
  const T = THEMES[config.id] || THEMES.analytics;
  const { overall, benchOver, outScore, scores } = res;
  const mat   = getLevel(overall, config.levelDescs);
  const caps  = scores.filter(d=>d.key!==config.outcomeDimKey);
  const outSc = scores.find(d=>d.key===config.outcomeDimKey);
  const getRecs = (key,score) => config.recs[key]?.[score<2.5?'low':score<3.5?'mid':'high']||[];
  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar onLogoClick={onLogoClick} label={config.name} T={T} />
      {/* Hero */}
      <section style={{ background:T.bg, padding:'60px 48px', backgroundImage:'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize:'24px 24px' }}>
        <p style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:T.text, marginBottom:12 }}>Pramanik Assessment Results</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.18)', padding:'4px 12px', borderRadius:20, color:'rgba(255,255,255,0.9)', marginBottom:16 }}>
          {profile.industryName.split('(')[0].trim()} · {profile.companySizeName}
        </div>
        <h1 className="fd" style={{ color:'white', fontSize:'clamp(1.6rem,3.5vw,2.6rem)', marginBottom:8 }}>{config.name}</h1>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>Your organisation's capability assessment across six dimensions.</p>
        <div style={{ display:'flex', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:16 }}>
          <div><span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(255,255,255,0.55)', display:'block', marginBottom:4 }}>Overall Score</span><span className="fd" style={{ color:T.text, fontSize:'5rem', lineHeight:1 }}>{overall.toFixed(1)}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.45)', display:'block' }}>/5.0</span></div>
          <div style={{ width:1, height:72, background:'rgba(255,255,255,0.2)' }} />
          <div><span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(255,255,255,0.55)', display:'block', marginBottom:4 }}>Benchmark</span><span className="fd" style={{ color:T.text, fontSize:'3rem', lineHeight:1 }}>{benchOver.toFixed(1)}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.45)', display:'block' }}>/5.0</span></div>
          <div style={{ width:1, height:72, background:'rgba(255,255,255,0.2)' }} />
          <div><span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(255,255,255,0.55)', display:'block', marginBottom:4 }}>{config.outcomeDimLabel.split('&')[0].trim().split(' ').slice(0,2).join(' ')}</span><span className="fd" style={{ color:'rgba(255,255,255,0.85)', fontSize:'3rem', lineHeight:1 }}>{outScore.toFixed(1)}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.45)', display:'block' }}>/5.0</span></div>
        </div>
        <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:mat.color, color:'white' }}>Level {mat.level} — {mat.name}</span>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', maxWidth:520, lineHeight:1.7, marginTop:14 }}>{mat.description}</p>
      </section>

      <div style={{ padding:'48px', maxWidth:960, margin:'0 auto' }}>

        {/* Benchmark comparison */}
        <h2 className="fd" style={{ fontSize:'1.5rem', color:'#0d1117', marginBottom:4 }}>Benchmark Comparison</h2>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:24 }}>Your scores vs. the {profile.industryName.split('(')[0].trim()} benchmark for {profile.companySizeName} enterprises.</p>
        <div style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, padding:24, marginBottom:36 }}>
          <div style={{ display:'flex', gap:20, marginBottom:18 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#6b7280' }}><span style={{ width:12, height:12, borderRadius:2, background:T.btn, display:'inline-block' }} /> Your Score</span>
            <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#6b7280' }}><span style={{ width:12, height:12, borderRadius:2, background:'#d1d5db', display:'inline-block' }} /> Benchmark</span>
          </div>
          {caps.map(d=>(
            <div key={d.key} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <span style={{ fontSize:12, color:'#6b7280', width:120, flexShrink:0 }}>{d.name.split('&')[0].trim().split(' ').slice(0,2).join(' ')}</span>
              <div style={{ flex:1, position:'relative', height:20 }}>
                <div style={{ position:'absolute', top:0, left:0, height:7, borderRadius:4, background:T.btn, width:`${(d.score/5)*100}%` }} />
                <div style={{ position:'absolute', top:11, left:0, height:4, borderRadius:2, background:'#d1d5db', width:`${(d.bScore/5)*100}%` }} />
              </div>
              <span style={{ fontSize:12, color:'#6b7280', width:60, fontVariantNumeric:'tabular-nums' }}>{d.score} / {d.bScore}</span>
              <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:d.gap>=0?T.highlight:'#fef2f2', color:d.gap>=0?T.accent:'#b91c1c' }}>{d.gap>=0?'+':''}{d.gap}</span>
            </div>
          ))}
        </div>

        {/* Dimension cards */}
        <h2 className="fd" style={{ fontSize:'1.5rem', color:'#0d1117', marginBottom:4 }}>Dimension Scores</h2>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:24 }}>Performance across each capability dimension.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:36 }}>
          {scores.map(d=>{ const lv=getLevel(d.score,config.levelDescs); return (
            <div key={d.key} style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, padding:18 }}>
              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9ca3af', fontWeight:600, marginBottom:7 }}>{d.name}</p>
              <p className="fd" style={{ fontSize:'2rem', color:T.bg, marginBottom:7 }}>{d.score.toFixed(1)}</p>
              <div style={{ height:4, background:'#f3f4f6', borderRadius:2, overflow:'hidden', marginBottom:7 }}>
                <div style={{ height:'100%', borderRadius:2, background:config.dimColors[d.key]||T.btn, width:`${(d.score/5)*100}%` }} />
              </div>
              <p style={{ fontSize:11, fontWeight:600, color:lv.color }}>{lv.name}</p>
              <p style={{ fontSize:11, color:'#9ca3af', marginTop:3 }}>Benchmark: {d.bScore.toFixed(1)}</p>
            </div>
          );})}
        </div>

        {/* Simulator */}
        <h2 className="fd" style={{ fontSize:'1.5rem', color:'#0d1117', marginBottom:4 }}>What-If Simulator</h2>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:24 }}>Explore how improving specific dimensions would change your overall score.</p>
        <div style={{ marginBottom:36 }}>
          <Simulator config={config} dimScores={scores} originalOverall={overall} benchOver={benchOver} />
        </div>

        {/* Outcome box */}
        {outSc && (
          <div style={{ background:T.highlight, border:'1px solid #e5e7eb', borderRadius:12, padding:22, marginBottom:36 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:T.text }}>↗</div>
              <div><p style={{ fontWeight:600, color:'#0d1117' }}>{config.outcomeDimLabel}</p><p style={{ fontSize:12, color:'#6b7280' }}>{config.outcomeDesc}</p></div>
            </div>
            <p className="fd" style={{ fontSize:'2.6rem', color:T.bg }}>{outSc.score.toFixed(1)} <span style={{ fontSize:16, color:'#9ca3af' }}>/5.0</span></p>
          </div>
        )}

        {/* Certificate */}
        <CertificatePanel config={config} overall={overall} profile={profile} onRetake={onRetake} />

        {/* Action plan */}
        <h2 className="fd" style={{ fontSize:'1.5rem', color:'#0d1117', marginBottom:4 }}>Prioritised Action Plan</h2>
        <p style={{ fontSize:13, color:'#9ca3af', marginBottom:24 }}>Specific recommendations for each dimension based on your current scores.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:18, marginBottom:36 }}>
          {scores.filter(d=>d.key!==config.outcomeDimKey).map(d=>{
            const recs=getRecs(d.key,d.score);
            const lv=getLevel(d.score,config.levelDescs);
            return (
              <div key={d.key} style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #e5e7eb', flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:4, height:40, borderRadius:2, background:config.dimColors[d.key]||T.btn }} />
                    <div><p style={{ fontWeight:600, color:'#0d1117' }}>{d.name}</p><p style={{ fontSize:12, color:'#9ca3af' }}>Your score: {d.score.toFixed(1)} · Benchmark: {d.bScore.toFixed(1)}</p></div>
                  </div>
                  <div style={{ display:'flex', gap:7 }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 10px', borderRadius:20, background:d.gap>=0?T.highlight:'#fef2f2', color:d.gap>=0?T.accent:'#b91c1c' }}>Gap: {d.gap>=0?'+':''}{d.gap}</span>
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 10px', borderRadius:20, background:'#f3f4f6', color:'#6b7280' }}>{lv.name}</span>
                  </div>
                </div>
                <div style={{ padding:18 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <div style={{ flex:1, height:5, background:'#f3f4f6', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:3, background:config.dimColors[d.key]||T.btn, width:`${(d.score/5)*100}%` }} />
                    </div>
                    <span style={{ fontSize:14, fontWeight:600 }}>{d.score.toFixed(1)}</span>
                  </div>
                  <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9ca3af', fontWeight:600, marginBottom:10 }}>Recommended Actions</p>
                  <ul style={{ listStyle:'none' }}>
                    {recs.map((r,i)=>(
                      <li key={i} style={{ fontSize:13, color:'#374151', lineHeight:1.6, padding:'9px 0', borderBottom:i<recs.length-1?'1px solid #f3f4f6':'none', display:'flex', gap:10, alignItems:'flex-start' }}>
                        <span style={{ color:T.accent, fontSize:11, flexShrink:0, marginTop:3 }}>→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:'flex', gap:12, paddingTop:24, borderTop:'1px solid #e5e7eb' }}>
          <button onClick={onRetake} style={{ padding:'12px 20px', borderRadius:6, border:'1px solid #e5e7eb', background:'white', color:'#0d1117', fontSize:14, cursor:'pointer' }}>← Take Again</button>
          <button onClick={()=>window.print()} style={{ padding:'12px 20px', borderRadius:6, border:'none', background:T.bg, color:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>↓ Save / Print Report</button>
        </div>
      </div>
    </div>
  );
};

// ─── ENTERPRISE MATURITY APP ──────────────────────────────────────────────────
function EnterpriseMaturityApp({ session, onSignOut }) {
  const [assessType, setAssessType] = useState(null);
  const [view,    setView]    = useState('home');
  const [profile, setProfile] = useState(null);
  const [answers, setAnswers] = useState({});
  const [dimIdx,  setDimIdx]  = useState(0);
  const [loadingDb, setLoadingDb] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data && data.industry && data.company_size) {
        setProfile({ industry: data.industry, companySize: data.company_size });
      }
      setLoadingDb(false);
    };
    loadProfile();
  }, [session]);

  const config     = assessType ? CONFIGS[assessType] : null;
  const isComplete = config ? Object.keys(answers).length===config.questions.length : false;

  const handleSelect  = useCallback(async type => { 
    setAssessType(type); setAnswers({}); setDimIdx(0); setView('profile'); 
    // Try to load existing assessment
    const { data } = await supabase.from('assessments').select('answers').eq('user_id', session.user.id).eq('type', type).single();
    if (data && data.answers) setAnswers(data.answers);
  }, [session]);

  const handleAnswer  = useCallback(async (id,v) => {
    const newAnswers = { ...answers, [id]: v };
    setAnswers(newAnswers);
    if (assessType) {
      const isDone = Object.keys(newAnswers).length === CONFIGS[assessType].questions.length;
      let overallScore = null;
      if (isDone && profile) {
        const res = calcResults(CONFIGS[assessType], newAnswers, profile);
        overallScore = res.overall;
      }
      await supabase.from('assessments').upsert({
        user_id: session.user.id,
        type: assessType,
        answers: newAnswers,
        status: isDone ? 'completed' : 'in_progress',
        overall_score: overallScore,
        updated_at: new Date().toISOString()
      });
    }
  }, [answers, assessType, session, profile]);

  const handleProfile = useCallback(async p => { 
    setProfile(p); setView('assessment'); setDimIdx(0); 
    // Save profile to DB
    await supabase.from('profiles').upsert({
      id: session.user.id,
      industry: p.industry,
      company_size: p.companySize,
      updated_at: new Date().toISOString()
    });
  }, [session]);

  const handleResults = useCallback(()=>{ if(isComplete)setView('results'); },[isComplete]);
  const handleReset   = useCallback(()=>{ setView('home'); setAssessType(null); setAnswers({}); setDimIdx(0); },[]);
  const handleRetake  = useCallback(()=>{ setView('assessment'); },[]);

  const T = config ? THEMES[config.id] : null;

  const results = useMemo(()=>{
    if(view==='results'&&config&&profile) return calcResults(config,answers,profile);
    return null;
  },[view,config,answers,profile]);

  if (loadingDb) return <div style={{ padding: 40, textAlign: 'center' }}>Loading your data...</div>;

  return (
    <div style={{ minHeight:'100vh' }}>
      <FontLoader />
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <button onClick={onSignOut} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
      </div>
      {view==='home'    && <><Navbar onLogoClick={handleReset} /><Home onSelect={handleSelect} /></>}
      {view==='profile' && config && <><Navbar onLogoClick={handleReset} label={config.name} T={T} /><ProfileStep config={config} profile={profile} onComplete={handleProfile} onBack={()=>setView('home')} /></>}
      {view==='assessment' && config && <><Navbar onLogoClick={handleReset} label={config.name} T={T} /><AssessmentView config={config} answers={answers} dimIdx={dimIdx} onAnswer={handleAnswer} onChangeDim={setDimIdx} onComplete={handleResults} onBack={()=>setView('profile')} isComplete={isComplete} industryName={profile?.industryName} companySizeName={profile?.companySizeName} /></>}
      {view==='results' && results && config && profile && <Results config={config} res={results} profile={profile} onRetake={handleRetake} onLogoClick={handleReset} />}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (session) {
    return <EnterpriseMaturityApp session={session} onSignOut={() => supabase.auth.signOut()} />;
  }

  if (selectedAction) {
    return (
      <div style={{ position: 'relative' }}>
        <AuthUI session={session} onBack={() => setSelectedAction(null)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh' }}>
      <FontLoader />
      <Navbar onLogoClick={() => {}} showLogin={true} onLoginClick={() => setSelectedAction('login')} />
      <Home onSelect={(id) => setSelectedAction(id)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
