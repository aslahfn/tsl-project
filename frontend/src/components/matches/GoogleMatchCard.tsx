'use client';

import React from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamProps {
  name: string;
  flagUrl: string;
  rank?: string;
  score: number;
}

interface GoogleMatchCardProps {
  competition?: string;
  stage?: string;
  homeTeam: TeamProps;
  awayTeam: TeamProps;
  matchStatus: {
    isLive: boolean;
    time: string;
  };
  onFollow?: () => void;
  onOptions?: () => void;
}

export default function GoogleMatchCard({
  competition = 'FIFA World Cup 2026™',
  stage = 'Group Stage · Group K',
  homeTeam,
  awayTeam,
  matchStatus,
  onFollow,
  onOptions,
}: GoogleMatchCardProps) {
  return (
    <motion.div 
      className="google-match-card card-holographic"
      whileHover={{ y: -6, rotateX: 3, rotateY: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <style>{`
        .google-match-card {
          background-color: #1f2023; /* Darker grey to match image background closely */
          border-radius: 24px;
          padding: 16px 20px 24px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .gmc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .gmc-title-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gmc-title {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: #e8eaed;
          gap: 4px;
          cursor: pointer;
        }

        .gmc-subtitle {
          font-size: 13px;
          color: #9aa0a6;
        }

        .gmc-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gmc-follow-btn {
          background-color: #a8c7fa;
          color: #041e49;
          border: none;
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .gmc-follow-btn:hover {
          background-color: #b9d3fa;
        }

        .gmc-options-btn {
          background: none;
          border: none;
          color: #e8eaed;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gmc-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
        }

        .gmc-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }

        .gmc-flag-container {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: #303134;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px; /* Space inside the border for the image */
        }
        
        .gmc-flag-inner {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }

        .gmc-team-name {
          font-size: 16px;
          font-weight: 400;
          color: #e8eaed;
          margin-bottom: 6px;
          text-align: center;
          white-space: nowrap;
        }

        .gmc-team-rank {
          background-color: #3c4043;
          color: #e8eaed;
          font-size: 12px;
          padding: 2px 10px;
          border-radius: 10px;
          font-weight: 500;
        }

        .gmc-center {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .gmc-score {
          font-size: 52px;
          font-weight: 400;
          color: #e8eaed;
          line-height: 1;
        }

        .gmc-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .gmc-live-badge {
          background-color: #ea4335;
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 12px;
          letter-spacing: 0.3px;
        }

        .gmc-time {
          font-size: 15px;
          color: #e8eaed;
          font-weight: 400;
        }

        .gmc-stoppage-indicator {
          width: 10px;
          height: 2px;
          background-color: #ea4335;
          border-radius: 2px;
          margin-top: 2px;
        }
      `}</style>

      <div className="gmc-header">
        <div className="gmc-title-container">
          <div className="gmc-title">
            {competition} <ChevronRight size={18} color="#9aa0a6" strokeWidth={2} />
          </div>
          <div className="gmc-subtitle">{stage}</div>
        </div>
        <div className="gmc-header-actions">
          <button className="gmc-options-btn" onClick={onOptions} aria-label="Options">
            <MoreVertical size={20} />
          </button>
          <button className="gmc-follow-btn" onClick={onFollow}>
            Follow
          </button>
        </div>
      </div>

      <div className="gmc-main">
        {/* Home Team */}
        <div className="gmc-team">
          <div className="gmc-flag-container">
            <div className="gmc-flag-inner" style={{ backgroundImage: `url('${homeTeam.flagUrl}')` }} />
          </div>
          <div className="gmc-team-name">{homeTeam.name}</div>
          {homeTeam.rank && <div className="gmc-team-rank">{homeTeam.rank}</div>}
        </div>

        {/* Center Score & Status */}
        <div className="gmc-center">
          <div className="gmc-score">{homeTeam.score}</div>
          
          <div className="gmc-status">
            {matchStatus.isLive && <div className="gmc-live-badge">Live</div>}
            <div className="gmc-time">{matchStatus.time}</div>
            {matchStatus.isLive && <div className="gmc-stoppage-indicator"></div>}
          </div>

          <div className="gmc-score">{awayTeam.score}</div>
        </div>

        {/* Away Team */}
        <div className="gmc-team">
          <div className="gmc-flag-container">
            <div className="gmc-flag-inner" style={{ backgroundImage: `url('${awayTeam.flagUrl}')` }} />
          </div>
          <div className="gmc-team-name">{awayTeam.name}</div>
          {awayTeam.rank && <div className="gmc-team-rank">{awayTeam.rank}</div>}
        </div>
      </div>
    </motion.div>
  );
}
