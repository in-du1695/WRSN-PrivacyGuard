
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BatteryCharging,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  FileText,
  FlaskConical,
  Gauge,
  Home,
  Menu,
  Network,
  RadioTower,
  Settings,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Zap,
  LockKeyhole,
  ArrowUpRight,
  Play,
  X,
} from "lucide-react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import NetworkSimulator from "./pages/NetworkSimulator";
import AttackSimulator from "./pages/AttackSimulator";
import PrivacyDefense from "./pages/PrivacyDefense";


const navigation = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Home", path: "/", icon: Home },
      { label: "Dashboard", path: "/dashboard", icon: Gauge },
    ],
  },
  {
    title: "SIMULATION",
    items: [
      { label: "Network Simulator", path: "/network", icon: Network },
      { label: "Attack Simulator", path: "/attacks", icon: AlertTriangle },
      { label: "AI Security Center", path: "/ai-security", icon: BrainCircuit },
    ],
  },
  {
    title: "PROTECTION",
    items: [
      { label: "Privacy Defense", path: "/defense", icon: ShieldCheck },
      { label: "Attacker vs Defender", path: "/battle", icon: Shield },
      { label: "Optimization", path: "/optimization", icon: Activity },
    ],
  },
  {
    title: "RESEARCH",
    items: [
      { label: "Experiment Center", path: "/experiments", icon: FlaskConical },
      { label: "Reports", path: "/reports", icon: FileText },
    ],
  },
];

const moduleInfo = {
  "/dashboard": {
    title: "Dashboard",
    description: "Monitor your wireless sensor network and privacy experiments.",
    icon: Gauge,
  },
  "/network": {
    title: "Network Simulator",
    description: "Create virtual sensor nodes and simulate mobile wireless charging.",
    icon: Network,
  },
  "/attacks": {
    title: "Attack Simulator",
    description: "Investigate charging-based location inference using LSM and Centroid.",
    icon: AlertTriangle,
  },
  "/ai-security": {
    title: "AI Security Center",
    description: "Analyze charging patterns and detect suspicious network behavior.",
    icon: BrainCircuit,
  },
  "/defense": {
    title: "Privacy Defense",
    description: "Configure adaptive privacy protection strategies.",
    icon: ShieldCheck,
  },
  "/battle": {
    title: "Attacker vs Defender",
    description: "Compare the attacker's location inference with the defender's protection.",
    icon: Shield,
  },
  "/optimization": {
    title: "Optimization",
    description: "Explore the balance between privacy, charging energy, and network lifetime.",
    icon: Activity,
  },
  "/experiments": {
    title: "Experiment Center",
    description: "Configure and execute repeatable WRSN simulation experiments.",
    icon: FlaskConical,
  },
  "/reports": {
    title: "Reports",
    description: "Review experiment results and export research data.",
    icon: FileText,
  },
};

function Sidebar({ mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && (
        <button
          className="mobile-overlay"
          onClick={closeMobile}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <RadioTower size={23} />
          </div>
          <div>
            <h2>PrivacyGuard</h2>
            <span>WRSN SECURITY PLATFORM</span>
          </div>
          <button className="mobile-close" onClick={closeMobile}>
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-status">
          <span className="status-dot" />
          SIMULATION ENVIRONMENT
          <span className="status-label">READY</span>
        </div>

        <nav className="navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <p className="nav-heading">{group.title}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    key={item.path}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-active" : ""}`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.label === "AI Security Center" && (
                      <span className="nav-new">AI</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-card-icon">
              <LockKeyhole size={18} />
            </div>
            <div>
              <strong>Privacy first</strong>
              <p>Protecting sensor locations</p>
            </div>
          </div>
          <div className="sidebar-footer">
            <span>WRSN PrivacyGuard</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open menu">
        <Menu size={21} />
      </button>
      <div className="breadcrumb">
        <span>PrivacyGuard</span>
        <ChevronRight size={15} />
        <strong>Research Workspace</strong>
      </div>
      <div className="topbar-right">
        <span className="environment">
          <span className="status-dot" />
          LOCAL ENVIRONMENT
        </span>
        <div className="user-avatar">PG</div>
      </div>
    </header>
  );
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="header-security">
        <ShieldCheck size={17} />
        <span>Privacy research workspace</span>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="pulse-dot" />
            WIRELESS NETWORK PRIVACY RESEARCH
          </div>
          <h1>
            Secure the network.
            <br />
            <span>Protect the unseen.</span>
          </h1>
          <p>
            Simulate charging-based location inference attacks, analyze
            privacy risks, and explore adaptive protection for Wireless
            Rechargeable Sensor Networks.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => navigate("/network")}
            >
              <Play size={17} fill="currentColor" />
              Open Network Simulator
              <ArrowUpRight size={16} />
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
            >
              Explore Dashboard
            </button>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={15} />
            Software-based research simulation · No physical hardware required
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" />
          <div className="visual-ring ring-one" />
          <div className="visual-ring ring-two" />
          <div className="visual-ring ring-three" />
          <div className="visual-center">
            <RadioTower size={42} />
            <span>WRSN</span>
          </div>
          <div className="visual-node node-one"><BatteryCharging size={17} /></div>
          <div className="visual-node node-two"><Zap size={17} /></div>
          <div className="visual-node node-three"><Shield size={17} /></div>
          <div className="visual-node node-four"><Activity size={17} /></div>
          <div className="visual-label label-top">SENSOR NETWORK</div>
          <div className="visual-label label-bottom">PRIVACY LAYER</div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">PLATFORM MODULES</p>
          <h2>Explore the research environment</h2>
        </div>
        <span className="module-count">08 MODULES</span>
      </div>

      <div className="module-grid">
        {[
          { title: "Network Simulator", desc: "Create virtual sensor nodes and charger movement.", icon: Network, path: "/network", number: "01" },
          { title: "Attack Simulator", desc: "Study location inference using LSM and Centroid.", icon: AlertTriangle, path: "/attacks", number: "02" },
          { title: "AI Security Center", desc: "Analyze charging patterns using machine learning.", icon: BrainCircuit, path: "/ai-security", number: "03" },
          { title: "Privacy Defense", desc: "Test adaptive privacy protection policies.", icon: ShieldCheck, path: "/defense", number: "04" },
          { title: "Attacker vs Defender", desc: "Compare attack and protection outcomes.", icon: Shield, path: "/battle", number: "05" },
          { title: "Optimization", desc: "Explore privacy and energy trade-offs.", icon: Activity, path: "/optimization", number: "06" },
        ].map((module) => {
          const Icon = module.icon;
          return (
            <button
              className="module-card"
              key={module.number}
              onClick={() => navigate(module.path)}
            >
              <div className="module-top">
                <div className="module-icon"><Icon size={21} /></div>
                <span>{module.number}</span>
              </div>
              <h3>{module.title}</h3>
              <p>{module.desc}</p>
              <div className="module-open">
                Open module <ArrowUpRight size={15} />
              </div>
            </button>
          );
        })}
      </div>

      <section className="research-note">
        <div className="note-icon"><CircleHelp size={20} /></div>
        <div>
          <h3>Research objective</h3>
          <p>
            Evaluate whether adaptive privacy protection can reduce
            charging-based location inference while maintaining acceptable
            energy consumption and network survival.
          </p>
        </div>
      </section>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="SYSTEM OVERVIEW"
        title="Research Dashboard"
        description="Your central workspace for monitoring WRSN simulation experiments."
      />

      <div className="metrics-grid">
        {[
          { label: "Sensor Nodes", value: "—", note: "Awaiting network setup", icon: Network },
          { label: "Privacy Risk", value: "—", note: "No attack analysis yet", icon: ShieldAlert },
          { label: "Energy Consumption", value: "—", note: "No simulation data", icon: BatteryCharging },
          { label: "Network Survival", value: "—", note: "Awaiting simulation", icon: Activity },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="metric-card" key={metric.label}>
              <div className="metric-top">
                <span>{metric.label}</span>
                <Icon size={19} />
              </div>
              <h2>{metric.value}</h2>
              <p>{metric.note}</p>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Network activity</h3>
              <p>Simulation activity overview</p>
            </div>
            <span className="neutral-tag">NO DATA YET</span>
          </div>
          <div className="empty-state">
            <div className="empty-icon"><RadioTower size={30} /></div>
            <h3>No simulation started</h3>
            <p>Run your first network simulation to populate this workspace.</p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Security status</h3>
              <p>Research module readiness</p>
            </div>
          </div>
          <div className="readiness-list">
            {["Network simulation", "LSM / Centroid attacks", "ML risk detection", "Adaptive protection"].map((name) => (
              <div className="readiness-item" key={name}>
                <span className="readiness-circle" />
                <span>{name}</span>
                <small>Not configured</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ path }) {
  const info = moduleInfo[path];
  const Icon = info.icon;

  return (
    <div className="page-content">
      <PageHeader
        eyebrow="RESEARCH MODULE"
        title={info.title}
        description={info.description}
      />
      <div className="module-placeholder">
        <div className="placeholder-icon"><Icon size={32} /></div>
        <span className="neutral-tag">FOUNDATION CREATED</span>
        <h2>{info.title} module</h2>
        <p>
          This section is connected to the website navigation. Its working
          research functionality will be implemented in the next development
          phases.
        </p>
        <div className="placeholder-list">
          <span><ShieldCheck size={15} /> Dedicated module route created</span>
          <span><Activity size={15} /> Ready for backend integration</span>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      <div className="main-area">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main>
          
<Routes>
  <Route path="/" element={<HomePage />} />

  <Route path="/dashboard" element={<DashboardPage />} />

  {/* Functional Network Simulator */}
  <Route
    path="/network"
    element={<NetworkSimulator />}
  />
  <Route
  path="/attacks"
  element={<AttackSimulator />}
/>
<Route
  path="/defense"
  element={<PrivacyDefense />}
/>

  {/* Other research module placeholders */}
  {Object.keys(moduleInfo)
    .filter(
  (path) =>
    path !== "/dashboard" &&
    path !== "/network" &&
     path !== "/attacks" &&
    path !== "/defense"
)
    .map((path) => (
      <Route
        key={path}
        path={path}
        element={<PlaceholderPage path={path} />}
      />
    ))}
</Routes>

        </main>
        <footer className="app-footer">
          <span>WRSN PrivacyGuard © 2026</span>
          <span>AI-Driven Adaptive Privacy Research</span>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
