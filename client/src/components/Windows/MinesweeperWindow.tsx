// client/src/components/Windows/MinesweeperWindow.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MinesweeperIcon } from '../Icons/XpIcons';

interface MinesweeperWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
}

type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTIES: Record<'beginner' | 'intermediate' | 'expert', DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  isExploded: boolean;
  isWrongFlag: boolean;
}

interface BestScore {
  time: number;
  name: string;
}

interface BestScores {
  beginner: BestScore;
  intermediate: BestScore;
  expert: BestScore;
}

const DEFAULT_SCORES: BestScores = {
  beginner: { time: 999, name: 'Anonymous' },
  intermediate: { time: 999, name: 'Anonymous' },
  expert: { time: 999, name: 'Anonymous' }
};

// Web Audio sound synthesizer for authentic retro sound effects
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted yet
    }
  }

  playFlag() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio error
    }
  }

  playExplode() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // White noise explosion
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.4);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Audio error
    }
  }

  playWin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.15);
      });
    } catch {
      // Audio error
    }
  }
}

const sfx = new SoundEffects();

/* Styled Components for Luna XP Window & Retro Minesweeper */

const WindowContainer = styled.div<{ $isMinimized: boolean; $zIndex: number }>`
  position: absolute;
  background-color: #c0c0c0;
  border: 3px solid #0055ea;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.45);
  display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
  flex-direction: column;
  min-width: 204px;
  z-index: ${({ $zIndex }) => $zIndex};
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
  box-sizing: border-box;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const TitleBar = styled.div`
  height: 25px;
  background: linear-gradient(
    to bottom,
    #0058e6 0%,
    #3a8bfb 15%,
    #0055ea 50%,
    #0045be 100%
  );
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 0 6px;
  color: #ffffff;
  cursor: move;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 11px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.2px;
`;

const WindowButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const WinBtn = styled.button<{ $type?: 'close' | 'disabled' }>`
  width: 19px;
  height: 19px;
  border-radius: 3px;
  border: 1px solid #ffffff;
  outline: none;
  cursor: ${({ $type }) => ($type === 'disabled' ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 10px;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  opacity: ${({ $type }) => ($type === 'disabled' ? '0.45' : '1')};

  background: ${({ $type }) => {
    if ($type === 'close') {
      return 'linear-gradient(to bottom, #f27254 0%, #e04322 45%, #c72c0b 100%)';
    }
    return 'linear-gradient(to bottom, #428eff 0%, #2062cc 50%, #0e4499 100%)';
  }};

  &:hover {
    filter: ${({ $type }) => ($type === 'disabled' ? 'none' : 'brightness(1.2)')};
  }

  &:active {
    filter: ${({ $type }) => ($type === 'disabled' ? 'none' : 'brightness(0.85)')};
  }
`;

const MenuBar = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  background-color: #ece9d8;
  border-bottom: 1px solid #aca899;
  padding: 0 4px;
  font-size: 11px;
  position: relative;
`;

const MenuItem = styled.div<{ $active?: boolean }>`
  padding: 2px 6px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;
  background-color: ${({ $active }) => ($active ? '#316ac5' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#000000')};

  &:hover {
    background-color: #316ac5;
    color: #ffffff;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 20px;
  left: 4px;
  background-color: #ffffff;
  border: 1px solid #7f9db9;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  padding: 2px 0;
  z-index: 100;
  min-width: 150px;
`;

const DropdownItem = styled.div<{ $disabled?: boolean }>`
  padding: 4px 16px 4px 22px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  color: ${({ $disabled }) => ($disabled ? '#888' : '#000')};
  position: relative;

  &:hover {
    ${({ $disabled }) =>
      !$disabled &&
      `
      background-color: #316ac5;
      color: #ffffff;
    `}
  }
`;

const CheckMark = styled.span`
  position: absolute;
  left: 6px;
  font-weight: bold;
`;

const MenuSeparator = styled.div`
  height: 1px;
  background-color: #aca899;
  margin: 3px 2px;
`;

/* Minesweeper Beveled Playfield Area */

const GameOuterFrame = styled.div`
  background-color: #c0c0c0;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: 3px solid #ffffff;
  border-top: 3px solid #ffffff;
  border-right: 3px solid #808080;
  border-bottom: 3px solid #808080;
`;

/* Header scoreboard with Digital Displays & Smiley */

const Scoreboard = styled.div`
  background-color: #c0c0c0;
  height: 38px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
`;

/* Smiley Button */

const SmileyButton = styled.button<{ $isPressed: boolean }>`
  width: 26px;
  height: 26px;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: ${({ $isPressed }) =>
    $isPressed ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff'};
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }
`;

/* Grid Area */

const GridContainer = styled.div<{ $rows: number; $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 20px);
  grid-template-rows: repeat(${({ $rows }) => $rows}, 20px);
  border: 3px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  background-color: #c0c0c0;
`;

/* Single Tile */

const CellButton = styled.div<{
  $isRevealed: boolean;
  $isPressed: boolean;
  $isExploded?: boolean;
}>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lucida Console', 'Tahoma', monospace;
  font-size: 14px;
  font-weight: 900;
  user-select: none;
  cursor: default;

  ${({ $isRevealed, $isPressed, $isExploded }) => {
    if ($isExploded) {
      return `
        background-color: #ff0000;
        border: 1px solid #7b7b7b;
      `;
    }
    if ($isRevealed || $isPressed) {
      return `
        background-color: #c0c0c0;
        border: 1px solid #7b7b7b;
      `;
    }
    return `
      background-color: #c0c0c0;
      border: 2px solid;
      border-color: #ffffff #7b7b7b #7b7b7b #ffffff;
    `;
  }}
`;

/* 7-Segment LED Digit Display Component */

const SEGMENTS_MAP: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
  '-': [0, 0, 0, 0, 0, 0, 1],
  ' ': [0, 0, 0, 0, 0, 0, 0]
};

const LedDigit: React.FC<{ char: string }> = ({ char }) => {
  const segs = SEGMENTS_MAP[char] || SEGMENTS_MAP[' '];
  const litColor = '#ff0000';
  const unlitColor = '#340000';

  return (
    <svg width="13" height="23" viewBox="0 0 13 23">
      {/* a: Top */}
      <polygon
        points="2,1 11,1 9.5,3 3.5,3"
        fill={segs[0] ? litColor : unlitColor}
      />
      {/* b: Top Right */}
      <polygon
        points="12,2 12,10.5 10,9.5 10,3.5"
        fill={segs[1] ? litColor : unlitColor}
      />
      {/* c: Bottom Right */}
      <polygon
        points="12,12.5 12,21 10,19.5 10,13.5"
        fill={segs[2] ? litColor : unlitColor}
      />
      {/* d: Bottom */}
      <polygon
        points="2,22 11,22 9.5,20 3.5,20"
        fill={segs[3] ? litColor : unlitColor}
      />
      {/* e: Bottom Left */}
      <polygon
        points="1,12.5 1,21 3,19.5 3,13.5"
        fill={segs[4] ? litColor : unlitColor}
      />
      {/* f: Top Left */}
      <polygon
        points="1,2 1,10.5 3,9.5 3,3.5"
        fill={segs[5] ? litColor : unlitColor}
      />
      {/* g: Center */}
      <polygon
        points="2,11.5 3.5,10.5 9.5,10.5 11,11.5 9.5,12.5 3.5,12.5"
        fill={segs[6] ? litColor : unlitColor}
      />
    </svg>
  );
};

const LedDisplayContainer = styled.div`
  background-color: #000000;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  display: flex;
  align-items: center;
  padding: 1px 2px;
  gap: 1px;
`;

const LedDisplay: React.FC<{ value: number }> = ({ value }) => {
  // Clamp between -99 and 999
  const clamped = Math.max(-99, Math.min(999, value));
  let str = '';
  if (clamped < 0) {
    const absVal = Math.abs(clamped);
    str = '-' + absVal.toString().padStart(2, '0');
  } else {
    str = clamped.toString().padStart(3, '0');
  }

  return (
    <LedDisplayContainer>
      <LedDigit char={str[0]} />
      <LedDigit char={str[1]} />
      <LedDigit char={str[2]} />
    </LedDisplayContainer>
  );
};

/* Smiley SVG Faces */
const SmileyGraphic: React.FC<{
  type: 'normal' | 'pressed' | 'scared' | 'won' | 'lost';
}> = ({ type }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      {/* Yellow Face */}
      <circle cx="10" cy="10" r="8.5" fill="#ffde00" stroke="#000000" strokeWidth="1" />

      {type === 'normal' && (
        <>
          {/* Eyes */}
          <circle cx="7" cy="7.5" r="1.1" fill="#000000" />
          <circle cx="13" cy="7.5" r="1.1" fill="#000000" />
          {/* Smile */}
          <path d="M6 11.5 C7.5 14.5, 12.5 14.5, 14 11.5" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {type === 'scared' && (
        <>
          {/* Eyes */}
          <circle cx="7" cy="7.5" r="1.1" fill="#000000" />
          <circle cx="13" cy="7.5" r="1.1" fill="#000000" />
          {/* Open mouth O */}
          <ellipse cx="10" cy="12.5" rx="2" ry="2.5" fill="#000000" />
        </>
      )}

      {type === 'won' && (
        <>
          {/* Sunglasses */}
          <path d="M4 6.5 L16 6.5 L15 10.5 C14 12, 11 12, 10.5 10 L9.5 10 C9 12, 6 12, 5 10.5 Z" fill="#000000" />
          {/* Smile */}
          <path d="M6 13.5 C8 15.5, 12 15.5, 14 13.5" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {type === 'lost' && (
        <>
          {/* Dead X Eyes */}
          <g stroke="#000000" strokeWidth="1.2" strokeLinecap="round">
            <line x1="5.5" y1="6" x2="8.5" y2="9" />
            <line x1="8.5" y1="6" x2="5.5" y2="9" />
            <line x1="11.5" y1="6" x2="14.5" y2="9" />
            <line x1="14.5" y1="6" x2="11.5" y2="9" />
          </g>
          {/* Frown */}
          <path d="M6.5 14 C8 12.5, 12 12.5, 13.5 14" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {type === 'pressed' && (
        <>
          <circle cx="7" cy="7.5" r="1.1" fill="#000000" />
          <circle cx="13" cy="7.5" r="1.1" fill="#000000" />
          <path d="M6 11.5 C7.5 14.5, 12.5 14.5, 14 11.5" stroke="#000000" strokeWidth="1.2" fill="none" />
        </>
      )}
    </svg>
  );
};

/* Retro Mine & Flag SVGs */

const MineGraphic: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="4.5" fill="#000000" />
    <g stroke="#000000" strokeWidth="1.5">
      <line x1="8" y1="1" x2="8" y2="15" />
      <line x1="1" y1="8" x2="15" y2="8" />
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="3" y1="13" x2="13" y2="3" />
    </g>
    {/* Specular dot */}
    <rect x="6" y="6" width="1.5" height="1.5" fill="#ffffff" />
  </svg>
);

const FlagGraphic: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    {/* Base */}
    <rect x="4" y="13" width="8" height="2" fill="#000000" />
    <rect x="6" y="11" width="4" height="2" fill="#000000" />
    {/* Pole */}
    <line x1="8" y1="2" x2="8" y2="12" stroke="#000000" strokeWidth="1.5" />
    {/* Red Flag */}
    <polygon points="8,2 3,5 8,8" fill="#e81123" stroke="#b00000" strokeWidth="0.5" />
  </svg>
);

const CrossedMineGraphic: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <MineGraphic size={size} />
    {/* Red Cross */}
    <line x1="2" y1="2" x2="14" y2="14" stroke="#ff0000" strokeWidth="2" />
    <line x1="2" y1="14" x2="14" y2="2" stroke="#ff0000" strokeWidth="2" />
  </svg>
);

/* Number Colors */
const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008100',
  3: '#ff0000',
  4: '#000083',
  5: '#810100',
  6: '#008081',
  7: '#000000',
  8: '#808080'
};

/* Dialog Modals */

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const DialogBox = styled.div`
  background-color: #ece9d8;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  min-width: 220px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DialogButton = styled.button`
  min-width: 60px;
  height: 23px;
  background-color: #ece9d8;
  border: 1px solid #003c74;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  padding: 0 8px;

  &:hover {
    background-color: #fff9e0;
    border-color: #e5a01a;
  }

  &:active {
    background-color: #dcd7c5;
    border-color: #003c74;
  }
`;

export const MinesweeperWindow: React.FC<MinesweeperWindowProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex
}) => {
  // Window dragging position
  const [position, setPosition] = useState({ x: 320, y: 140 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 320,
    posY: 140
  });

  // Settings & Options
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [customConfig, setCustomConfig] = useState<DifficultyConfig>({ rows: 9, cols: 9, mines: 10 });
  const [marksEnabled, setMarksEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active board size & mines
  const activeConfig = difficulty === 'custom' ? customConfig : DIFFICULTIES[difficulty];

  // Board state
  const [board, setBoard] = useState<CellData[][]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [minesLeft, setMinesLeft] = useState(activeConfig.mines);
  const [timer, setTimer] = useState(0);
  const [isMouseBoardDown, setIsMouseBoardDown] = useState(false);
  const [isSmileyPressed, setIsSmileyPressed] = useState(false);
  const [pressedCell, setPressedCell] = useState<{ row: number; col: number } | null>(null);

  // Menus & Modals
  const [activeMenu, setActiveMenu] = useState<'game' | 'help' | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => {
    try {
      const saved = localStorage.getItem('xp_minesweeper_scores');
      return saved ? JSON.parse(saved) : DEFAULT_SCORES;
    } catch {
      return DEFAULT_SCORES;
    }
  });

  // Custom Form fields
  const [customFormHeight, setCustomFormHeight] = useState(activeConfig.rows);
  const [customFormWidth, setCustomFormWidth] = useState(activeConfig.cols);
  const [customFormMines, setCustomFormMines] = useState(activeConfig.mines);

  // Timer Ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound class
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Window drag handlers
  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Global mouseup to release board pressed states
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseBoardDown(false);
      setPressedCell(null);
      setIsSmileyPressed(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Initialize empty board
  const initializeBoard = useCallback((config: DifficultyConfig) => {
    const newBoard: CellData[][] = [];
    for (let r = 0; r < config.rows; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < config.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          adjacentMines: 0,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          isExploded: false,
          isWrongFlag: false
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setGameStatus('idle');
    setMinesLeft(config.mines);
    setTimer(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Reset or change difficulty
  useEffect(() => {
    initializeBoard(activeConfig);
  }, [activeConfig, initializeBoard]);

  // Timer effect when playing
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [gameStatus]);

  // Place mines ensuring the first click (and surrounding) is safe
  const populateMines = (startRow: number, startCol: number, currentBoard: CellData[][]) => {
    const rows = currentBoard.length;
    const cols = currentBoard[0].length;
    const totalMines = activeConfig.mines;

    // Available positions excluding clicked cell and its immediate neighbors (if enough space)
    const candidates: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isNeighbor = Math.abs(r - startRow) <= 1 && Math.abs(c - startCol) <= 1;
        if (!isNeighbor) {
          candidates.push([r, c]);
        }
      }
    }

    // Fallback if board is very small: exclude only clicked cell
    if (candidates.length < totalMines) {
      candidates.length = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r !== startRow || c !== startCol) {
            candidates.push([r, c]);
          }
        }
      }
    }

    // Shuffle and pick mines
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const minePositions = candidates.slice(0, totalMines);
    const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

    minePositions.forEach(([r, c]) => {
      newBoard[r][c].isMine = true;
    });

    // Calculate adjacent mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].adjacentMines = count;
        }
      }
    }

    return newBoard;
  };

  // Check victory condition
  const checkWin = (currentBoard: CellData[][]): boolean => {
    for (let r = 0; r < currentBoard.length; r++) {
      for (let c = 0; c < currentBoard[0].length; c++) {
        const cell = currentBoard[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // Handle Win
  const handleWin = (finalBoard: CellData[][]) => {
    setGameStatus('won');
    sfx.playWin();

    // Auto flag remaining mines
    const completedBoard = finalBoard.map((row) =>
      row.map((cell) => (cell.isMine ? { ...cell, isFlagged: true, isQuestion: false } : cell))
    );
    setBoard(completedBoard);
    setMinesLeft(0);

    // Save high score if standard difficulty
    if (difficulty === 'beginner' || difficulty === 'intermediate' || difficulty === 'expert') {
      const currentBest = bestScores[difficulty];
      if (timer < currentBest.time) {
        setTimeout(() => {
          const playerName = window.prompt(
            `You have the fastest time for ${difficulty} level!\nPlease enter your name:`,
            'Anonymous'
          );
          const updated: BestScores = {
            ...bestScores,
            [difficulty]: {
              time: timer,
              name: playerName && playerName.trim() ? playerName.trim() : 'Anonymous'
            }
          };
          setBestScores(updated);
          try {
            localStorage.setItem('xp_minesweeper_scores', JSON.stringify(updated));
          } catch {
            // localStorage not available
          }
          setShowScoresModal(true);
        }, 150);
      }
    }
  };

  // Handle Loss
  const handleLoss = (explodedRow: number, explodedCol: number, currentBoard: CellData[][]) => {
    setGameStatus('lost');
    sfx.playExplode();

    const revealedBoard = currentBoard.map((row) =>
      row.map((cell) => {
        if (cell.row === explodedRow && cell.col === explodedCol) {
          return { ...cell, isRevealed: true, isExploded: true };
        }
        if (cell.isMine && !cell.isFlagged) {
          return { ...cell, isRevealed: true };
        }
        if (!cell.isMine && cell.isFlagged) {
          return { ...cell, isRevealed: true, isWrongFlag: true };
        }
        return cell;
      })
    );
    setBoard(revealedBoard);
  };

  // Flood fill reveal
  const revealCell = (startR: number, startC: number, boardToMutate: CellData[][]) => {
    const rows = boardToMutate.length;
    const cols = boardToMutate[0].length;
    const queue: [number, number][] = [[startR, startC]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const cell = boardToMutate[r][c];

      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;
      cell.isQuestion = false;

      // If cell has 0 neighbors, expand neighbors
      if (cell.adjacentMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const neighbor = boardToMutate[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  };

  // Click handler (Left Click)
  const handleCellClick = (r: number, c: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    let activeBoard = board;

    // First click: populate mines safely and start timer
    if (gameStatus === 'idle') {
      activeBoard = populateMines(r, c, board);
      setGameStatus('playing');
    }

    const target = activeBoard[r][c];
    if (target.isRevealed || target.isFlagged) return;

    // Check mine hit
    if (target.isMine) {
      handleLoss(r, c, activeBoard);
      return;
    }

    // Safe reveal
    sfx.playClick();
    const newBoard = activeBoard.map((row) => row.map((cell) => ({ ...cell })));
    revealCell(r, c, newBoard);

    if (checkWin(newBoard)) {
      handleWin(newBoard);
    } else {
      setBoard(newBoard);
    }
  };

  // Right Click (Flag / Question mark / None)
  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const cell = board[r][c];
    if (cell.isRevealed) return;

    sfx.playFlag();

    const newBoard = board.map((row) => row.map((cCell) => ({ ...cCell })));
    const target = newBoard[r][c];

    if (!target.isFlagged && !target.isQuestion) {
      target.isFlagged = true;
      setMinesLeft((prev) => prev - 1);
    } else if (target.isFlagged) {
      target.isFlagged = false;
      setMinesLeft((prev) => prev + 1);
      if (marksEnabled) {
        target.isQuestion = true;
      }
    } else if (target.isQuestion) {
      target.isQuestion = false;
    }

    setBoard(newBoard);
  };

  // Chord action: Double click or Middle click on revealed numbered cell
  const handleChord = (r: number, c: number) => {
    if (gameStatus !== 'playing') return;
    const cell = board[r][c];
    if (!cell.isRevealed || cell.adjacentMines === 0) return;

    const rows = board.length;
    const cols = board[0].length;

    // Count flagged neighbors
    let flagCount = 0;
    const unflaggedNeighbors: [number, number][] = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = board[nr][nc];
          if (neighbor.isFlagged) {
            flagCount++;
          } else if (!neighbor.isRevealed) {
            unflaggedNeighbors.push([nr, nc]);
          }
        }
      }
    }

    // If flags match the required number of mines, reveal all other neighbors
    if (flagCount === cell.adjacentMines && unflaggedNeighbors.length > 0) {
      // Check if any neighbor is an unflagged mine -> BOOM
      for (const [nr, nc] of unflaggedNeighbors) {
        if (board[nr][nc].isMine) {
          handleLoss(nr, nc, board);
          return;
        }
      }

      sfx.playClick();
      const newBoard = board.map((row) => row.map((item) => ({ ...item })));
      for (const [nr, nc] of unflaggedNeighbors) {
        revealCell(nr, nc, newBoard);
      }

      if (checkWin(newBoard)) {
        handleWin(newBoard);
      } else {
        setBoard(newBoard);
      }
    }
  };

  // Reset Button
  const handleReset = () => {
    initializeBoard(activeConfig);
  };

  // Keyboard shortcut F2 = New Game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isMinimized) return;
      if (e.key === 'F2') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'Escape') {
        setActiveMenu(null);
        setShowCustomModal(false);
        setShowScoresModal(false);
        setShowAboutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, activeConfig]);

  // Determine smiley state
  let smileyType: 'normal' | 'pressed' | 'scared' | 'won' | 'lost' = 'normal';
  if (isSmileyPressed) {
    smileyType = 'pressed';
  } else if (gameStatus === 'lost') {
    smileyType = 'lost';
  } else if (gameStatus === 'won') {
    smileyType = 'won';
  } else if (isMouseBoardDown) {
    smileyType = 'scared';
  }

  // Handle Custom Dialog Submission
  const handleApplyCustom = () => {
    const rows = Math.max(9, Math.min(24, Number(customFormHeight) || 9));
    const cols = Math.max(9, Math.min(30, Number(customFormWidth) || 9));
    const maxMines = Math.floor((rows - 1) * (cols - 1));
    const mines = Math.max(10, Math.min(maxMines, Number(customFormMines) || 10));

    const newCfg: DifficultyConfig = { rows, cols, mines };
    setCustomConfig(newCfg);
    setDifficulty('custom');
    setShowCustomModal(false);
    initializeBoard(newCfg);
  };

  if (!isOpen) return null;

  return (
    <WindowContainer
      $isMinimized={isMinimized}
      $zIndex={zIndex}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={onFocus}
      onClick={() => setActiveMenu(null)}
    >
      {/* Title Bar */}
      <TitleBar onMouseDown={handleMouseDownTitle}>
        <TitleContent>
          <MinesweeperIcon size={16} />
          <span>Minesweeper</span>
        </TitleContent>
        <WindowButtons>
          <WinBtn
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            _
          </WinBtn>
          <WinBtn $type="disabled" title="Maximize">
            □
          </WinBtn>
          <WinBtn
            $type="close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ✕
          </WinBtn>
        </WindowButtons>
      </TitleBar>

      {/* Menu Bar */}
      <MenuBar onClick={(e) => e.stopPropagation()}>
        <MenuItem
          $active={activeMenu === 'game'}
          onClick={() => setActiveMenu(activeMenu === 'game' ? null : 'game')}
        >
          <u>G</u>ame
        </MenuItem>
        <MenuItem
          $active={activeMenu === 'help'}
          onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
        >
          <u>H</u>elp
        </MenuItem>

        {/* Dropdown Menu: Game */}
        {activeMenu === 'game' && (
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                handleReset();
                setActiveMenu(null);
              }}
            >
              <span>New</span>
              <span style={{ color: '#888', marginLeft: 16 }}>F2</span>
            </DropdownItem>
            <MenuSeparator />
            <DropdownItem
              onClick={() => {
                setDifficulty('beginner');
                setActiveMenu(null);
              }}
            >
              {difficulty === 'beginner' && <CheckMark>✓</CheckMark>}
              <span>Beginner</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDifficulty('intermediate');
                setActiveMenu(null);
              }}
            >
              {difficulty === 'intermediate' && <CheckMark>✓</CheckMark>}
              <span>Intermediate</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDifficulty('expert');
                setActiveMenu(null);
              }}
            >
              {difficulty === 'expert' && <CheckMark>✓</CheckMark>}
              <span>Expert</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setCustomFormHeight(activeConfig.rows);
                setCustomFormWidth(activeConfig.cols);
                setCustomFormMines(activeConfig.mines);
                setShowCustomModal(true);
                setActiveMenu(null);
              }}
            >
              {difficulty === 'custom' && <CheckMark>✓</CheckMark>}
              <span>Custom...</span>
            </DropdownItem>
            <MenuSeparator />
            <DropdownItem
              onClick={() => {
                setMarksEnabled(!marksEnabled);
                setActiveMenu(null);
              }}
            >
              {marksEnabled && <CheckMark>✓</CheckMark>}
              <span>Marks (?)</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                setActiveMenu(null);
              }}
            >
              {soundEnabled && <CheckMark>✓</CheckMark>}
              <span>Sound</span>
            </DropdownItem>
            <MenuSeparator />
            <DropdownItem
              onClick={() => {
                setShowScoresModal(true);
                setActiveMenu(null);
              }}
            >
              <span>Best Times...</span>
            </DropdownItem>
            <MenuSeparator />
            <DropdownItem
              onClick={() => {
                setActiveMenu(null);
                onClose();
              }}
            >
              <span>Exit</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Dropdown Menu: Help */}
        {activeMenu === 'help' && (
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                alert('Minesweeper objective: locate all the mines as quickly as possible without uncovering any of them!');
                setActiveMenu(null);
              }}
            >
              <span>Help Topics</span>
              <span style={{ color: '#888', marginLeft: 16 }}>F1</span>
            </DropdownItem>
            <MenuSeparator />
            <DropdownItem
              onClick={() => {
                setShowAboutModal(true);
                setActiveMenu(null);
              }}
            >
              <span>About Minesweeper</span>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuBar>

      {/* Main Game Playfield */}
      <GameOuterFrame>
        {/* Scoreboard: Mine Counter, Smiley, Timer */}
        <Scoreboard>
          <LedDisplay value={minesLeft} />
          <SmileyButton
            $isPressed={isSmileyPressed}
            onMouseDown={() => setIsSmileyPressed(true)}
            onMouseUp={() => setIsSmileyPressed(false)}
            onClick={handleReset}
            title="Reset Game"
          >
            <SmileyGraphic type={smileyType} />
          </SmileyButton>
          <LedDisplay value={timer} />
        </Scoreboard>

        {/* Tiles Board */}
        <GridContainer
          $rows={activeConfig.rows}
          $cols={activeConfig.cols}
          onMouseDown={() => setIsMouseBoardDown(true)}
        >
          {board.map((row) =>
            row.map((cell) => {
              const isCellPressed =
                isMouseBoardDown &&
                pressedCell?.row === cell.row &&
                pressedCell?.col === cell.col &&
                !cell.isRevealed &&
                !cell.isFlagged;

              let content: React.ReactNode = null;

              if (cell.isRevealed) {
                if (cell.isExploded) {
                  content = <MineGraphic />;
                } else if (cell.isWrongFlag) {
                  content = <CrossedMineGraphic />;
                } else if (cell.isMine) {
                  content = <MineGraphic />;
                } else if (cell.adjacentMines > 0) {
                  content = (
                    <span style={{ color: NUMBER_COLORS[cell.adjacentMines] }}>
                      {cell.adjacentMines}
                    </span>
                  );
                }
              } else if (cell.isFlagged) {
                content = <FlagGraphic />;
              } else if (cell.isQuestion) {
                content = <span style={{ color: '#000000', fontWeight: 'bold' }}>?</span>;
              }

              return (
                <CellButton
                  key={`${cell.row}-${cell.col}`}
                  $isRevealed={cell.isRevealed}
                  $isPressed={isCellPressed}
                  $isExploded={cell.isExploded}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      setPressedCell({ row: cell.row, col: cell.col });
                    }
                  }}
                  onMouseEnter={() => {
                    if (isMouseBoardDown) {
                      setPressedCell({ row: cell.row, col: cell.col });
                    }
                  }}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                  onContextMenu={(e) => handleCellRightClick(e, cell.row, cell.col)}
                  onDoubleClick={() => handleChord(cell.row, cell.col)}
                >
                  {content}
                </CellButton>
              );
            })
          )}
        </GridContainer>
      </GameOuterFrame>

      {/* Modal: Custom Field Settings */}
      {showCustomModal && (
        <ModalOverlay onClick={() => setShowCustomModal(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #aca899', paddingBottom: 4 }}>
              Custom Field
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 70px', gap: 6, alignItems: 'center' }}>
              <label>Height (9-24):</label>
              <input
                type="number"
                min={9}
                max={24}
                value={customFormHeight}
                onChange={(e) => setCustomFormHeight(Number(e.target.value))}
                style={{ width: '60px', padding: '2px 4px' }}
              />

              <label>Width (9-30):</label>
              <input
                type="number"
                min={9}
                max={30}
                value={customFormWidth}
                onChange={(e) => setCustomFormWidth(Number(e.target.value))}
                style={{ width: '60px', padding: '2px 4px' }}
              />

              <label>Mines (10-668):</label>
              <input
                type="number"
                min={10}
                max={668}
                value={customFormMines}
                onChange={(e) => setCustomFormMines(Number(e.target.value))}
                style={{ width: '60px', padding: '2px 4px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
              <DialogButton onClick={handleApplyCustom}>OK</DialogButton>
              <DialogButton onClick={() => setShowCustomModal(false)}>Cancel</DialogButton>
            </div>
          </DialogBox>
        </ModalOverlay>
      )}

      {/* Modal: Best Times */}
      {showScoresModal && (
        <ModalOverlay onClick={() => setShowScoresModal(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()} style={{ minWidth: 260 }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #aca899', paddingBottom: 4 }}>
              Fastest Mine Sweepers
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '4px 0' }}>
              <div>
                <b>Beginner:</b> {bestScores.beginner.time} seconds ({bestScores.beginner.name})
              </div>
              <div>
                <b>Intermediate:</b> {bestScores.intermediate.time} seconds ({bestScores.intermediate.name})
              </div>
              <div>
                <b>Expert:</b> {bestScores.expert.time} seconds ({bestScores.expert.name})
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <DialogButton
                onClick={() => {
                  setBestScores(DEFAULT_SCORES);
                  try {
                    localStorage.removeItem('xp_minesweeper_scores');
                  } catch {
                    // Ignore
                  }
                }}
              >
                Reset Scores
              </DialogButton>
              <DialogButton onClick={() => setShowScoresModal(false)}>OK</DialogButton>
            </div>
          </DialogBox>
        </ModalOverlay>
      )}

      {/* Modal: About Minesweeper */}
      {showAboutModal && (
        <ModalOverlay onClick={() => setShowAboutModal(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()} style={{ minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MinesweeperIcon size={36} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 13 }}>Minesweeper</div>
                <div style={{ fontSize: 11, color: '#555' }}>Windows XP Edition</div>
              </div>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.4, color: '#222' }}>
              Classic Minesweeper game recreation for Windows XP Clone. Left-click to reveal, right-click to flag, double-click or middle-click to chord!
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <DialogButton onClick={() => setShowAboutModal(false)}>OK</DialogButton>
            </div>
          </DialogBox>
        </ModalOverlay>
      )}
    </WindowContainer>
  );
};

export default MinesweeperWindow;
