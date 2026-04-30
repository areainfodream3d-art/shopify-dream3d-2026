import React from 'react';

/**
 * Animazione semplice di una stampante 3D con CSS.
 */
export default function Printer3DAnimation() {
  return (
    <div className="printer3d-container">
      <div className="printer3d-frame">
        <div className="printer3d-bed" />
        <div className="printer3d-head">
          <div className="printer3d-nozzle" />
        </div>
        <div className="printer3d-object" />
      </div>
      <style>{`
        .printer3d-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 220px;
        }
        .printer3d-frame {
          position: relative;
          width: 180px;
          height: 180px;
          border: 4px solid #ff9100;
          border-radius: 12px;
          background: #18181b;
        }
        .printer3d-bed {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 140px;
          height: 20px;
          background: #333;
          border-radius: 6px;
        }
        .printer3d-head {
          position: absolute;
          top: 30px;
          left: 50%;
          width: 40px;
          height: 40px;
          transform: translateX(-50%);
          background: #222;
          border-radius: 8px 8px 12px 12px;
          z-index: 2;
          animation: printer3d-head-move 2.5s infinite linear alternate;
        }
        .printer3d-nozzle {
          position: absolute;
          bottom: -10px;
          left: 50%;
          width: 10px;
          height: 18px;
          background: #ff9100;
          border-radius: 0 0 8px 8px;
          transform: translateX(-50%);
        }
        .printer3d-object {
          position: absolute;
          left: 50%;
          bottom: 40px;
          width: 40px;
          height: 0px;
          background: linear-gradient(180deg, #ff9100 60%, #fffbe6 100%);
          border-radius: 8px 8px 8px 8px;
          transform: translateX(-50%);
          animation: printer3d-object-grow 2.5s infinite linear alternate;
        }
        @keyframes printer3d-head-move {
          0% { left: 30px; }
          100% { left: 110px; }
        }
        @keyframes printer3d-object-grow {
          0% { height: 0px; }
          100% { height: 60px; }
        }
      `}</style>
    </div>
  );
}
