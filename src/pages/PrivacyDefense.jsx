
import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Zap,
  Activity,
  RefreshCw,
  Eye,
} from "lucide-react";
import "./PrivacyDefense.css";

const LEVELS = {
  Low: {
    coordinateNoise: 5,
    powerNoise: 0.05,
    sampling: 1,
  },
  Medium: {
    coordinateNoise: 15,
    powerNoise: 0.15,
    sampling: 2,
  },
  High: {
    coordinateNoise: 30,
    powerNoise: 0.30,
    sampling: 3,
  },
};

function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function randomNoise(amount) {
  return (Math.random() * 2 - 1) * amount;
}

export default function PrivacyDefense() {
  const [level, setLevel] = useState("Medium");
  const [protectedData, setProtectedData] = useState(
    () => loadData("wrsn-protected-observations")
  );
  const [message, setMessage] = useState("");

  const originalData = loadData("wrsn-observations");
  const settings = LEVELS[level];

  function activateDefense() {
    if (!originalData.length) {
      setMessage("No charging observations found. Run Network Simulator first.");
      return;
    }

    const protectedObservations = originalData
      .filter((_, index) => index % settings.sampling === 0)
      .map((item) => ({
        ...item,
        chargerX: Math.max(
          0,
          Math.min(800, item.chargerX +
            randomNoise(settings.coordinateNoise))
        ),
        chargerY: Math.max(
          0,
          Math.min(460, item.chargerY +
            randomNoise(settings.coordinateNoise))
        ),
        power: Math.max(
          0,
          Math.min(2.5, item.power +
            randomNoise(settings.powerNoise))
        ),
        protected: true,
      }));

    localStorage.setItem(
      "wrsn-protected-observations",
      JSON.stringify(protectedObservations)
    );

    setProtectedData(protectedObservations);
    setMessage("Privacy protection applied successfully.");
  }

  function clearDefense() {
    localStorage.removeItem("wrsn-protected-observations");
    setProtectedData([]);
    setMessage("Protected observations cleared.");
  }

  return (
    <div className="defense-page">
      <div className="defense-header">
        <div>
          <span className="defense-eyebrow">
            <ShieldCheck size={15} /> PRIVACY PROTECTION CENTER
          </span>
          <h1>Privacy Defense</h1>
          <p>
            Configure protection against charging-based
            sensor-location inference.
          </p>
        </div>
        <div className="defense-status">
          <ShieldCheck size={19} />
          DEFENSE MODULE
        </div>
      </div>

      <div className="defense-overview">
        <div className="defense-card">
          <Eye />
          <span>Original observations</span>
          <strong>{originalData.length}</strong>
        </div>

        <div className="defense-card">
          <Lock />
          <span>Protected observations</span>
          <strong>{protectedData.length}</strong>
        </div>

        <div className="defense-card">
          <Activity />
          <span>Privacy level</span>
          <strong>{level}</strong>
        </div>
      </div>

      <section className="defense-panel">
        <h2>Select protection level</h2>
        <p>
          Higher protection applies stronger perturbation and
          more observation sampling reduction.
        </p>

        <div className="protection-options">
          {Object.keys(LEVELS).map((item) => (
            <button
              key={item}
              className={`protection-option ${
                level === item ? "selected" : ""
              }`}
              onClick={() => {
                setLevel(item);
                setMessage("");
              }}
            >
              <ShieldCheck size={22} />
              <strong>{item}</strong>
              <span>
                {item === "Low"
                  ? "Light protection"
                  : item === "Medium"
                  ? "Balanced protection"
                  : "Strong protection"}
              </span>
            </button>
          ))}
        </div>

        <div className="defense-settings">
          <div>
            <span>Coordinate perturbation</span>
            <strong>±{settings.coordinateNoise} units</strong>
          </div>
          <div>
            <span>Power noise amplitude</span>
            <strong>±{settings.powerNoise}</strong>
          </div>
          <div>
            <span>Sampling interval</span>
            <strong>Every {settings.sampling} observations</strong>
          </div>
        </div>

        <div className="defense-actions">
          <button
            className="activate-defense"
            onClick={activateDefense}
          >
            <ShieldCheck size={17} />
            Apply Privacy Protection
          </button>

          <button
            className="clear-defense"
            onClick={clearDefense}
          >
            <RefreshCw size={16} />
            Clear
          </button>
        </div>

        {message && (
          <div className="defense-message">
            {message}
          </div>
        )}
      </section>

      <section className="defense-panel">
        <h2>Protection mechanisms</h2>

        <div className="mechanism-row">
          <Lock />
          <div>
            <strong>Charging coordinate perturbation</strong>
            <p>
              Introduces controlled uncertainty into observable
              charger coordinates.
            </p>
          </div>
        </div>

        <div className="mechanism-row">
          <Zap />
          <div>
            <strong>Charging power perturbation</strong>
            <p>
              Adds bounded random variation to observed
              charging-power readings.
            </p>
          </div>
        </div>

        <div className="mechanism-row">
          <Activity />
          <div>
            <strong>Observation sampling</strong>
            <p>
              Reduces the frequency of observations available
              to a simulated attacker.
            </p>
          </div>
        </div>
      </section>

      <p className="defense-disclaimer">
        Research prototype: this software applies transformations
        to the attacker's observation dataset. It does not yet
        control a physical wireless charger or prove real-world
        privacy guarantees. Randomization is illustrative and
        should be evaluated through repeated experiments.
      </p>
    </div>
  );
}
