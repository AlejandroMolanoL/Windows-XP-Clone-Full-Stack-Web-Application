// client/src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import Taskbar, { type WindowTabInfo } from './components/Taskbar/Taskbar';
import MyComputerWindow from './components/Windows/MyComputerWindow';
import CalculatorWindow from './components/Windows/CalculatorWindow';
import PaintWindow from './components/Windows/PaintWindow';
import MinesweeperWindow from './components/Windows/MinesweeperWindow';
import TurnOffModal from './components/Modals/TurnOffModal';
import RunDialog from './components/Modals/RunDialog';
import {
  MyComputerIcon,
  MyDocumentsIcon,
  InternetExplorerIcon,
  CalculatorIcon,
  PaintIcon,
  MinesweeperIcon
} from './components/Icons/XpIcons';

const Desktop = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
`;

/* Iconos clásicos del escritorio */
const DesktopIconsContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
`;

const DesktopIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  border: 1px solid transparent;

  &:hover {
    background-color: rgba(49, 106, 197, 0.3);
    border-color: rgba(49, 106, 197, 0.7);
  }

  &:active {
    background-color: rgba(49, 106, 197, 0.5);
  }
`;

const IconLabel = styled.span`
  color: #ffffff;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  text-align: center;
  margin-top: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
`;

/* Papelera de reciclaje en la esquina inferior derecha como en la captura */
const RecycleBinWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  right: 15px;
  z-index: 10;
`;

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isTurnOffModalOpen, setIsTurnOffModalOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);

  // Estado de la ventana "My Computer" (abierta por defecto)
  const [isMyComputerOpen, setIsMyComputerOpen] = useState(true);
  const [isMyComputerMinimized, setIsMyComputerMinimized] = useState(false);

  // Estado de la Calculadora de Windows XP
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
  const [isCalculatorMinimized, setIsCalculatorMinimized] = useState(false);

  // Estado de Paint de Windows XP
  const [isPaintOpen, setIsPaintOpen] = useState(true);
  const [isPaintMinimized, setIsPaintMinimized] = useState(false);

  // Estado de Buscaminas / Minesweeper de Windows XP
  const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(true);
  const [isMinesweeperMinimized, setIsMinesweeperMinimized] = useState(false);

  // Ventana activa al frente
  const [activeWindowId, setActiveWindowId] = useState<string>('minesweeper');

  const handleToggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  const handleCloseStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  const handleOpenApp = (appId: string) => {
    setIsStartMenuOpen(false);

    switch (appId) {
      case 'my_computer':
        setIsMyComputerOpen(true);
        setIsMyComputerMinimized(false);
        setActiveWindowId('my_computer');
        break;

      case 'calc':
      case 'calculator':
        setIsCalculatorOpen(true);
        setIsCalculatorMinimized(false);
        setActiveWindowId('calculator');
        break;

      case 'paint':
      case 'mspaint':
        setIsPaintOpen(true);
        setIsPaintMinimized(false);
        setActiveWindowId('paint');
        break;

      case 'minesweeper':
      case 'winmine':
      case 'buscaminas':
      case 'mine':
        setIsMinesweeperOpen(true);
        setIsMinesweeperMinimized(false);
        setActiveWindowId('minesweeper');
        break;

      case 'turn_off':
        setIsTurnOffModalOpen(true);
        break;

      case 'run':
        setIsRunDialogOpen(true);
        break;

      case 'log_off':
        if (window.confirm('Log off Windows XP?')) {
          setIsMyComputerOpen(false);
          setIsCalculatorOpen(false);
          setIsPaintOpen(false);
          setIsMinesweeperOpen(false);
        }
        break;

      case 'show_desktop':
        setIsMyComputerMinimized(true);
        setIsCalculatorMinimized(true);
        setIsPaintMinimized(true);
        setIsMinesweeperMinimized(true);
        break;

      default:
        // Mensaje amigable para aplicaciones en desarrollo
        alert(`Iniciando ${appId}...`);
        break;
    }
  };

  const handleWindowTabClick = (id: string) => {
    if (id === 'my_computer') {
      if (isMyComputerMinimized) {
        setIsMyComputerMinimized(false);
        setActiveWindowId('my_computer');
      } else if (activeWindowId === 'my_computer') {
        setIsMyComputerMinimized(true);
      } else {
        setActiveWindowId('my_computer');
      }
    } else if (id === 'calculator') {
      if (isCalculatorMinimized) {
        setIsCalculatorMinimized(false);
        setActiveWindowId('calculator');
      } else if (activeWindowId === 'calculator') {
        setIsCalculatorMinimized(true);
      } else {
        setActiveWindowId('calculator');
      }
    } else if (id === 'paint') {
      if (isPaintMinimized) {
        setIsPaintMinimized(false);
        setActiveWindowId('paint');
      } else if (activeWindowId === 'paint') {
        setIsPaintMinimized(true);
      } else {
        setActiveWindowId('paint');
      }
    } else if (id === 'minesweeper') {
      if (isMinesweeperMinimized) {
        setIsMinesweeperMinimized(false);
        setActiveWindowId('minesweeper');
      } else if (activeWindowId === 'minesweeper') {
        setIsMinesweeperMinimized(true);
      } else {
        setActiveWindowId('minesweeper');
      }
    }
  };

  // Lista de ventanas para la barra de tareas
  const openWindows: WindowTabInfo[] = [];
  if (isMyComputerOpen) {
    openWindows.push({
      id: 'my_computer',
      title: 'My Computer',
      icon: <MyComputerIcon size={16} />,
      isMinimized: isMyComputerMinimized,
      isActive: activeWindowId === 'my_computer'
    });
  }
  if (isCalculatorOpen) {
    openWindows.push({
      id: 'calculator',
      title: 'Calculator',
      icon: <CalculatorIcon size={16} />,
      isMinimized: isCalculatorMinimized,
      isActive: activeWindowId === 'calculator'
    });
  }
  if (isPaintOpen) {
    openWindows.push({
      id: 'paint',
      title: 'untitled - Paint',
      icon: <PaintIcon size={16} />,
      isMinimized: isPaintMinimized,
      isActive: activeWindowId === 'paint'
    });
  }
  if (isMinesweeperOpen) {
    openWindows.push({
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: <MinesweeperIcon size={16} />,
      isMinimized: isMinesweeperMinimized,
      isActive: activeWindowId === 'minesweeper'
    });
  }

  return (
    <React.Fragment>
      <GlobalStyle />

      {/* Escritorio interactivo */}
      <Desktop onClick={handleCloseStartMenu}>
        {/* Iconos del Escritorio */}
        <DesktopIconsContainer>
          <DesktopIcon
            onDoubleClick={() => handleOpenApp('my_computer')}
            onClick={(e) => e.stopPropagation()}
            title="My Computer"
          >
            <MyComputerIcon size={36} />
            <IconLabel>My Computer</IconLabel>
          </DesktopIcon>

          <DesktopIcon
            onDoubleClick={() => handleOpenApp('paint')}
            onClick={(e) => e.stopPropagation()}
            title="Paint"
          >
            <PaintIcon size={36} />
            <IconLabel>Paint</IconLabel>
          </DesktopIcon>

          <DesktopIcon
            onDoubleClick={() => handleOpenApp('calc')}
            onClick={(e) => e.stopPropagation()}
            title="Calculator"
          >
            <CalculatorIcon size={36} />
            <IconLabel>Calculator</IconLabel>
          </DesktopIcon>

          <DesktopIcon
            onDoubleClick={() => handleOpenApp('minesweeper')}
            onClick={(e) => e.stopPropagation()}
            title="Minesweeper"
          >
            <MinesweeperIcon size={36} />
            <IconLabel>Minesweeper</IconLabel>
          </DesktopIcon>

          <DesktopIcon
            onDoubleClick={() => handleOpenApp('my_documents')}
            onClick={(e) => e.stopPropagation()}
            title="My Documents"
          >
            <MyDocumentsIcon size={36} />
            <IconLabel>My Documents</IconLabel>
          </DesktopIcon>

          <DesktopIcon
            onDoubleClick={() => handleOpenApp('internet_explorer')}
            onClick={(e) => e.stopPropagation()}
            title="Internet Explorer"
          >
            <InternetExplorerIcon size={36} />
            <IconLabel>Internet Explorer</IconLabel>
          </DesktopIcon>
        </DesktopIconsContainer>

        {/* Papelera de reciclaje en la esquina inferior derecha */}
        <RecycleBinWrapper>
          <DesktopIcon
            onClick={(e) => e.stopPropagation()}
            title="Recycle Bin"
          >
            <div style={{ fontSize: '32px' }}>🗑️</div>
            <IconLabel>Recycle Bin</IconLabel>
          </DesktopIcon>
        </RecycleBinWrapper>

        {/* Ventana de My Computer */}
        <MyComputerWindow
          isOpen={isMyComputerOpen}
          isMinimized={isMyComputerMinimized}
          onClose={() => setIsMyComputerOpen(false)}
          onMinimize={() => setIsMyComputerMinimized(true)}
          onFocus={() => setActiveWindowId('my_computer')}
          zIndex={activeWindowId === 'my_computer' ? 100 : 90}
        />

        {/* Ventana de la Calculadora de Windows XP */}
        <CalculatorWindow
          isOpen={isCalculatorOpen}
          isMinimized={isCalculatorMinimized}
          onClose={() => setIsCalculatorOpen(false)}
          onMinimize={() => setIsCalculatorMinimized(true)}
          onFocus={() => setActiveWindowId('calculator')}
          zIndex={activeWindowId === 'calculator' ? 100 : 90}
        />

        {/* Ventana de Paint de Windows XP */}
        <PaintWindow
          isOpen={isPaintOpen}
          isMinimized={isPaintMinimized}
          onClose={() => setIsPaintOpen(false)}
          onMinimize={() => setIsPaintMinimized(true)}
          onFocus={() => setActiveWindowId('paint')}
          zIndex={activeWindowId === 'paint' ? 100 : 90}
        />

        {/* Ventana de Buscaminas / Minesweeper de Windows XP */}
        <MinesweeperWindow
          isOpen={isMinesweeperOpen}
          isMinimized={isMinesweeperMinimized}
          onClose={() => setIsMinesweeperOpen(false)}
          onMinimize={() => setIsMinesweeperMinimized(true)}
          onFocus={() => setActiveWindowId('minesweeper')}
          zIndex={activeWindowId === 'minesweeper' ? 100 : 90}
        />

        {/* Diálogos modales clásicos */}
        <TurnOffModal
          isOpen={isTurnOffModalOpen}
          onClose={() => setIsTurnOffModalOpen(false)}
          onAction={(action) => {
            alert(`Acción seleccionada: ${action}`);
          }}
        />

        <RunDialog
          isOpen={isRunDialogOpen}
          onClose={() => setIsRunDialogOpen(false)}
          onRun={(cmd) => {
            const lower = cmd.trim().toLowerCase();
            if (lower === 'calc' || lower === 'calculator') {
              handleOpenApp('calc');
            } else if (lower === 'paint' || lower === 'mspaint') {
              handleOpenApp('paint');
            } else if (lower === 'winmine' || lower === 'minesweeper' || lower === 'buscaminas' || lower === 'mine') {
              handleOpenApp('minesweeper');
            } else {
              alert(`Ejecutando: ${cmd}`);
            }
          }}
        />
      </Desktop>

      {/* Barra de tareas interactiva */}
      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={handleToggleStartMenu}
        onCloseStartMenu={handleCloseStartMenu}
        onOpenApp={handleOpenApp}
        openWindows={openWindows}
        onWindowTabClick={handleWindowTabClick}
      />
    </React.Fragment>
  );
}

export default App;