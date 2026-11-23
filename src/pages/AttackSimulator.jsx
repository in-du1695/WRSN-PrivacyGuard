
import { useMemo, useState } from "react";
import {
  Target,
  Search,
  Crosshair,
  Activity,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import "./AttackSimulator.css";

const MAX_POWER = 2.5;
const CHARGING_RANGE = 220;

function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

// Solve a 2-variable least-squares problem using
// the normal equations for the linearized distance model.
function estimateLSM(observations) {
  if (observations.length < 3) return null;

  const reference = observations[0];
  const x1 = reference.chargerX;
  const y1 = reference.chargerY;
  const d1 = CHARGING_RANGE *
    (1 - reference.power / MAX_POWER);

  let a = 0, b = 0, c = 0;
  let u = 0, v = 0;

  observations.slice(1).forEach((observation) => {
    const xi = observation.chargerX;
    const yi = observation.chargerY;
    const di = CHARGING_RANGE *
      (1 - observation.power / MAX_POWER);

    const rowX = 2 * (xi - x1);
    const rowY = 2 * (yi - y1);

    const rhs =
      x1 * x1 - xi * xi +
      y1 * y1 - yi * yi +
      di * di - d1 * d1;

    a += rowX * rowX;
    b += rowX * rowY;
    c += rowY * rowY;
    u += rowX * rhs;
    v += rowY * rhs;
  });

  const determinant = a * c - b * b;

  if (Math.abs(determinant) < 1e-8) return null;

  return {
    x: (u * c - b * v) / determinant,
    y: (a * v - b * u) / determinant,
  };
}

// A power-weighted centroid baseline.
// This is a heuristic, not a claim that it reproduces
// the exact Centroid Method in the reference paper.
function estimateCentroid(observations) {
  if (!observations.length) return null;

  let totalWeight = 0;
  let x = 0;
  let y = 0;

  observations.forEach((observation) => {
    const weight = observation.power;

    x += observation.chargerX * weight;
    y += observation.chargerY * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return null;

  return {
    x: x / totalWeight,
    y: y / totalWeight,
  };
}

function calculateError(actual, estimated) {
  if (!actual || !estimated) return null;

  return Math.sqrt(
    (actual.x - estimated.x) ** 2 +
    (actual.y - estimated.y) ** 2
  );
}

export default function AttackSimulator() {
  const [nodes] = useState(() => loadData("wrsn-nodes"));
  const [observations] = useState(() =>
    loadData("wrsn-observations")
  );
  const [selectedId, setSelectedId] = useState("");
  const [attack, setAttack] = useState("lsm");

  const selectedNode = nodes.find(
    (node) => String(node.id) === selectedId
  );

  const sensorObservations = useMemo(
    () => observations.filter(
      (item) =>
        String(item.sensorId) === selectedId &&
        item.power > 0
    ),
    [observations, selectedId]
  );

  const lsm = selectedNode
    ? estimateLSM(sensorObservations)
    : null;

  const centroid = selectedNode
    ? estimateCentroid(sensorObservations)
    : null;

  const lsmError = calculateError(selectedNode, lsm);
  const centroidError = calculateError(selectedNode, centroid);

  const estimated = attack === "lsm" ? lsm : centroid;
  const error = attack === "lsm" ? lsmError : centroidError;

  const canRun = Boolean(selectedNode);

  return (
    <div className="attack-page">
      <div className="attack-heading">
        <div>
          <span className="attack-eyebrow">
            <ShieldAlert size={15} /> PRIVACY ATTACK ANALYSIS
          </span>
          <h1>Location Attack Simulator</h1>
          <p>
            Analyze how charging-power observations can reveal
            hidden sensor locations.
          </p>
        </div>
      </div>

      <div className="attack-controls">
        <div>
          <label htmlFor="sensor-select">Select target sensor</label>
          <select
            id="sensor-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Choose a sensor</option>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Sensor {node.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="attack-select">Attack algorithm</label>
          <select
            id="attack-select"
            value={attack}
            onChange={(e) => setAttack(e.target.value)}
          >
            <option value="lsm">Least Squares Method</option>
            <option value="centroid">Centroid baseline</option>
          </select>
        </div>
      </div>

      {!nodes.length ? (
        <div className="attack-empty">
          <RefreshCw size={35} />
          <h2>No network data found</h2>
          <p>
            Open Network Simulator, generate sensors, and run the
            simulation to collect charging observations.
          </p>
        </div>
      ) : (
        <>
          <div className="attack-metrics">
            <div className="attack-metric">
              <Search />
              <span>Available observations</span>
              <strong>{sensorObservations.length}</strong>
            </div>

            <div className="attack-metric">
              <Target />
              <span>Selected sensor</span>
              <strong>{selectedId || "—"}</strong>
            </div>

            <div className="attack-metric">
              <Crosshair />
              <span>Location error</span>
              <strong>
                {error === null ? "—" : `${error.toFixed(2)} units`}
              </strong>
            </div>

            <div className="attack-metric">
              <Activity />
              <span>Attack status</span>
              <strong>
                {!selectedNode
                  ? "Waiting"
                  : !estimated
                  ? "Insufficient data"
                  : "Estimated"}
              </strong>
            </div>
          </div>

          <div className="attack-panel">
            <h2>Location estimation results</h2>
            <p>
              Compare the original sensor coordinates with the
              estimated coordinates.
            </p>

            {!canRun ? (
              <div className="attack-message">
                Select a sensor to analyze its location.
              </div>
            ) : !estimated ? (
              <div className="attack-message">
                Not enough useful observations or charger positions
                are geometrically unsuitable. Run the Network
                Simulator for more observations.
              </div>
            ) : (
              <div className="coordinate-grid">
                <div>
                  <span>Actual X</span>
                  <strong>{selectedNode.x.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Actual Y</span>
                  <strong>{selectedNode.y.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Estimated X</span>
                  <strong>{estimated.x.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Estimated Y</span>
                  <strong>{estimated.y.toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="attack-panel">
            <h2>Algorithm comparison</h2>
            <p>
              Location estimation error for the selected sensor.
            </p>

            <div className="comparison-row">
              <span>Least Squares Method</span>
              <strong>
                {lsmError === null
                  ? "Unavailable"
                  : `${lsmError.toFixed(2)} units`}
              </strong>
            </div>

            <div className="comparison-row">
              <span>Centroid baseline</span>
              <strong>
                {centroidError === null
                  ? "Unavailable"
                  : `${centroidError.toFixed(2)} units`}
              </strong>
            </div>
          </div>
        </>
      )}

      <p className="attack-note">
        Research prototype: charging observations use the idealized
        distance-power relationship defined in the Network Simulator.
        The Centroid implementation is a power-weighted baseline.
        Results are software simulation outputs, not real-world
        measurements or verified reproduction of the reference paper.
      </p>
    </div>
  );
}
