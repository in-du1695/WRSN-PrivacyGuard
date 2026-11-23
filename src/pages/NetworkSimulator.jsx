
import { useEffect, useMemo, useState } from "react";
import {
  Play, Pause, RotateCcw, Radio, Battery,
  Zap, Activity, Cpu
} from "lucide-react";
import "./NetworkSimulator.css";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 460;

function generateNodes(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    x: 35 + Math.random() * 730,
    y: 35 + Math.random() * 390,
    battery: 35 + Math.random() * 55,
    initialBattery: 0,
    power: 0,
  })).map((node) => ({
    ...node,
    initialBattery: node.battery,
  }));
}

function getChargerPosition(tick) {
  const progress = (tick % 240) / 240;

  return {
    x: 70 + progress * 660,
    y: 230 + Math.sin(progress * Math.PI * 4) * 125,
  };
}

export default function NetworkSimulator() {
  const [nodeCount, setNodeCount] = useState(30);
  const [nodes, setNodes] = useState(() => generateNodes(30));
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [energyDelivered, setEnergyDelivered] = useState(0);

  const [observations, setObservations] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("wrsn-observations") || "[]"
    );
  } catch {
    return [];
  }
});

  const charger = useMemo(
    () => getChargerPosition(tick),
    [tick]
  );

  
  // Save network data for other modules
  useEffect(() => {
    localStorage.setItem(
      "wrsn-observations",
      JSON.stringify(observations)
    );

    localStorage.setItem(
      "wrsn-nodes",
      JSON.stringify(nodes)
    );
  }, [observations, nodes]);

  // Network simulation and charging observations
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      const nextTick = tick + 1;
      const nextCharger = getChargerPosition(nextTick);

      // Record charging observations
      const currentObservations = nodes.map((node) => {
        const dx = node.x - nextCharger.x;
        const dy = node.y - nextCharger.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const power =
          distance < 220
            ? 2.5 * (1 - distance / 220)
            : 0;

        return {
          sensorId: node.id,
          chargerX: nextCharger.x,
          chargerY: nextCharger.y,
          power,
          step: nextTick,
        };
      });

      setObservations((previous) =>
        [...previous, ...currentObservations].slice(-10000)
      );

      // Update sensor battery levels
      setNodes((previousNodes) =>
        previousNodes.map((node) => {
          const dx = node.x - nextCharger.x;
          const dy = node.y - nextCharger.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const chargingPower =
            distance < 220
              ? 2.5 * (1 - distance / 220)
              : 0;

          const consumption = 0.025;
          const chargingGain = chargingPower * 0.12;

          const newBattery = Math.min(
            100,
            Math.max(
              0,
              node.battery - consumption + chargingGain
            )
          );

          return {
            ...node,
            battery: newBattery,
            power: chargingPower,
          };
        })
      );

      // Calculate energy delivered
      const nearbyNodes = nodes.filter((node) => {
        const dx = node.x - nextCharger.x;
        const dy = node.y - nextCharger.y;

        return Math.sqrt(dx * dx + dy * dy) < 220;
      });

      setEnergyDelivered((previous) =>
        previous + nearbyNodes.length * 0.025
      );

      setTick(nextTick);
    }, 500);

    return () => clearInterval(timer);
  }, [running, tick, nodes]);


  const averageBattery =
    nodes.reduce((sum, node) => sum + node.battery, 0) /
    nodes.length;

  const lowBatteryNodes = nodes.filter(
    (node) => node.battery < 20
  ).length;

  const chargingNodes = nodes.filter(
    (node) => node.power > 0
  ).length;

  function resetSimulation() {
    setRunning(false);
    setTick(0);
    setEnergyDelivered(0);
    setObservations([]);
    setNodes(generateNodes(nodeCount));
  }

  function changeNodeCount(value) {
    const count = Number(value);
    setNodeCount(count);
    setRunning(false);
    setTick(0);
    setEnergyDelivered(0);
    setObservations([]);
    setNodes(generateNodes(count));
  }

  return (
    <div className="simulator-page">
      <div className="simulator-heading">
        <div>
          <div className="simulator-eyebrow">
            <Radio size={15} /> WRSN ENVIRONMENT
          </div>
          <h1>Network Simulator</h1>
          <p>
            Simulate wireless sensor nodes and mobile wireless
            charging in a virtual network.
          </p>
        </div>

        <div className="simulation-status">
          <span className={running ? "status-dot active" : "status-dot"} />
          {running ? "Simulation Running" : "Simulation Paused"}
        </div>
      </div>

      <div className="simulator-controls">
        <div className="node-selector">
          <label htmlFor="node-count">Number of sensors</label>
          <select
            id="node-count"
            value={nodeCount}
            onChange={(event) =>
              changeNodeCount(event.target.value)
            }
          >
            <option value="20">20 Nodes</option>
            <option value="30">30 Nodes</option>
            <option value="50">50 Nodes</option>
            <option value="100">100 Nodes</option>
          </select>
        </div>

        <div className="simulator-buttons">
          <button
            className="sim-button start-button"
            onClick={() => setRunning(true)}
            disabled={running}
          >
            <Play size={16} /> Start
          </button>

          <button
            className="sim-button pause-button"
            onClick={() => setRunning(false)}
            disabled={!running}
          >
            <Pause size={16} /> Pause
          </button>

          <button
            className="sim-button reset-button"
            onClick={resetSimulation}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="simulator-metrics">
        <div className="sim-metric">
          <div className="sim-metric-icon"><Cpu /></div>
          <div>
            <span>Total Sensors</span>
            <strong>{nodes.length}</strong>
          </div>
        </div>

        <div className="sim-metric">
          <div className="sim-metric-icon"><Battery /></div>
          <div>
            <span>Average Battery</span>
            <strong>{averageBattery.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="sim-metric">
          <div className="sim-metric-icon"><Zap /></div>
          <div>
            <span>Charging Nodes</span>
            <strong>{chargingNodes}</strong>
          </div>
        </div>

        <div className="sim-metric">
          <div className="sim-metric-icon"><Activity /></div>
          <div>
            <span>Low Battery Nodes</span>
            <strong>{lowBatteryNodes}</strong>
          </div>
        </div>
      </div>

      <div className="network-panel">
        <div className="network-panel-heading">
          <div>
            <h2>Live Network Topology</h2>
            <p>Virtual sensor distribution and charger movement</p>
          </div>
          <span className="simulation-time">
            Simulation steps: {tick}
          </span>
        </div>

        <div className="network-map">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="Wireless sensor network simulation map"
          >
            <defs>
              <pattern
                id="network-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#203047"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="charger-glow">
                <stop offset="0%" stopColor="#22d3c5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22d3c5" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              fill="url(#network-grid)"
            />

            <circle
              cx={charger.x}
              cy={charger.y}
              r="220"
              fill="url(#charger-glow)"
            />

            {nodes.map((node) => {
              const dx = node.x - charger.x;
              const dy = node.y - charger.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const inRange = distance < 220;

              return (
                <g key={node.id}>
                  {inRange && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={charger.x}
                      y2={charger.y}
                      stroke="#22d3c5"
                      strokeOpacity="0.17"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    fill={
                      node.battery < 20
                        ? "#f87171"
                        : inRange
                        ? "#22d3c5"
                        : "#4c8bd8"
                    }
                    fillOpacity="0.14"
                  />

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="5"
                    fill={
                      node.battery < 20
                        ? "#f87171"
                        : inRange
                        ? "#22d3c5"
                        : "#60a5fa"
                    }
                    stroke="#dceeff"
                    strokeWidth="0.8"
                  />

                  <title>
                    Sensor {node.id} | Battery: {node.battery.toFixed(1)}%
                  </title>
                </g>
              );
            })}

            <circle
              cx={charger.x}
              cy={charger.y}
              r="17"
              fill="#22d3c5"
              fillOpacity="0.15"
              stroke="#22d3c5"
              strokeWidth="1.5"
            />

            <circle
              cx={charger.x}
              cy={charger.y}
              r="7"
              fill="#22d3c5"
            />

            <text
              x={charger.x + 15}
              y={charger.y - 15}
              fill="#7ef4e8"
              fontSize="12"
              fontWeight="bold"
            >
              MOBILE CHARGER
            </text>
          </svg>
        </div>

        <div className="network-legend">
          <span><i className="legend-blue" /> Sensor node</span>
          <span><i className="legend-green" /> Charging range</span>
          <span><i className="legend-red" /> Low battery</span>
          <span><i className="legend-charger" /> Mobile charger</span>
        </div>
      </div>

      <div className="simulator-bottom-grid">
        <div className="sim-info-card">
          <h3><Zap size={17} /> Energy Information</h3>
          <div className="info-row">
            <span>Energy delivered (simulated)</span>
            <strong>{energyDelivered.toFixed(2)} units</strong>
          </div>
          <div className="info-row">
            <span>Charger X position</span>
            <strong>{charger.x.toFixed(0)}</strong>
          </div>
          <div className="info-row">
            <span>Charger Y position</span>
            <strong>{charger.y.toFixed(0)}</strong>
          </div>
        </div>

        <div className="sim-info-card">
          <h3><Battery size={17} /> Sensor Battery Overview</h3>
          {nodes.slice(0, 5).map((node) => (
            <div className="battery-row" key={node.id}>
              <span>Node {node.id}</span>
              <div className="battery-track">
                <div
                  className={
                    node.battery < 20
                      ? "battery-fill low"
                      : "battery-fill"
                  }
                  style={{ width: `${node.battery}%` }}
                />
              </div>
              <strong>{node.battery.toFixed(0)}%</strong>
            </div>
          ))}
          <small>Showing first 5 sensors</small>
        </div>
      </div>

      <p className="simulator-note">
        Note: This is an initial software simulation. Charging power,
        battery consumption, and energy values are illustrative model
        parameters, not measurements from physical WRSN hardware.
      </p>
    </div>
  );
}
