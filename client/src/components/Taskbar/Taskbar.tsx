// client/src/components/Taskbar/Taskbar.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StartButton from './StartButton';
import StartMenu from '../StartMenu/StartMenu';
import {
  InternetExplorerIcon,
  WindowsMediaPlayerIcon
} from '../Icons/XpIcons';

export interface WindowTabInfo {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isMinimized: boolean;
  isActive: boolean;
}

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onCloseStartMenu: () => void;
  onOpenApp: (appId: string) => void;
  openWindows: WindowTabInfo[];
  onWindowTabClick: (windowId: string) => void;
}

const TaskbarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(
    to bottom,
    #245edb 0%,
    #3f8cf3 9%,
    #245edb 18%,
    #245edb 92%,
    #1941a5 100%
  );
  border-top: 1px solid #11368a;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  user-select: none;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  overflow: hidden;
`;

/* Barra de inicio rápido (Quick Launch) */
const QuickLaunch = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 4px;
  height: 24px;
  position: relative;
`;

const QuickLaunchDivider = styled.div`
  width: 2px;
  height: 22px;
  border-left: 1px solid #144498;
  border-right: 1px solid #5a9df6;
  margin: 0 3px;
`;

const QuickLaunchIcon = styled.button`
  background: none;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 0, 0, 0.4);
  }
`;

/* Pestañas de ventanas abiertas en la barra de tareas */
const TaskbarTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
  flex: 1;
  overflow-x: auto;
  height: 100%;
  padding-right: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const WindowTab = styled.div<{ $isActive: boolean }>`
  height: 25px;
  width: 155px;
  max-width: 170px;
  border-radius: 2px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #ffffff;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  background: ${({ $isActive }) =>
    $isActive
      ? 'linear-gradient(to bottom, #1943a3 0%, #205ac9 10%, #1e52bc 85%, #163d96 100%)'
      : 'linear-gradient(to bottom, #3c82e6 0%, #3074dc 10%, #2365cb 85%, #1951ab 100%)'};

  border: 1px solid #0f3073;
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? 'inset 1px 1px 2px rgba(0, 0, 0, 0.7), inset -1px -1px 1px rgba(255, 255, 255, 0.2)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.35)'};

  &:hover {
    background: ${({ $isActive }) =>
      $isActive
        ? 'linear-gradient(to bottom, #1943a3, #205ac9)'
        : 'linear-gradient(to bottom, #5097f5, #357ee8)'};
  }
`;

const TabTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Bandeja del sistema (System Tray / Reloj) */
const SystemTray = styled.div`
  height: 100%;
  background: linear-gradient(
    to bottom,
    #0c59b2 0%,
    #1362be 10%,
    #135ebd 85%,
    #0c4ea0 100%
  );
  border-left: 1px solid #10428a;
  box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  color: #ffffff;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
`;

const TrayIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TrayClock = styled.span`
  letter-spacing: 0.3px;
  margin-left: 2px;
`;

const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  onToggleStartMenu,
  onCloseStartMenu,
  onOpenApp,
  openWindows,
  onWindowTabClick
}) => {
  const [time, setTime] = useState<string>('');

  // Actualizar el reloj cada minuto
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Menú de Inicio emergente */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={onCloseStartMenu}
        onOpenApp={onOpenApp}
      />

      {/* Contenedor de la barra de tareas */}
      <TaskbarContainer>
        <LeftSection>
          {/* Botón Inicio */}
          <StartButton
            isOpen={isStartMenuOpen}
            onClick={onToggleStartMenu}
          />

          {/* Separador e Inicio Rápido (Quick Launch) */}
          <QuickLaunchDivider />
          <QuickLaunch>
            {/* Mostrar Escritorio */}
            <QuickLaunchIcon
              onClick={() => onOpenApp('show_desktop')}
              title="Show Desktop"
            >
              <div style={{ fontSize: '13px' }}>🖥️</div>
            </QuickLaunchIcon>

            {/* Internet Explorer */}
            <QuickLaunchIcon
              onClick={() => onOpenApp('internet_explorer')}
              title="Launch Internet Explorer Browser"
            >
              <InternetExplorerIcon size={16} />
            </QuickLaunchIcon>

            {/* Windows Media Player */}
            <QuickLaunchIcon
              onClick={() => onOpenApp('media_player')}
              title="Launch Windows Media Player"
            >
              <WindowsMediaPlayerIcon size={16} />
            </QuickLaunchIcon>
          </QuickLaunch>
          <QuickLaunchDivider />

          {/* Ventanas abiertas (Pestañas) */}
          <TaskbarTabs>
            {openWindows.map((win) => (
              <WindowTab
                key={win.id}
                $isActive={win.isActive && !win.isMinimized}
                onClick={() => onWindowTabClick(win.id)}
                title={win.title}
              >
                {win.icon}
                <TabTitle>{win.title}</TabTitle>
              </WindowTab>
            ))}
          </TaskbarTabs>
        </LeftSection>

        {/* Bandeja del Sistema y Reloj Digital */}
        <SystemTray>
          <div style={{ cursor: 'pointer', fontSize: '9px', opacity: 0.8 }} title="Show hidden icons">
            ❮
          </div>
          <TrayIcons>
            <span title="Volume" style={{ fontSize: '12px', cursor: 'pointer' }}>
              🔊
            </span>
            <span title="Windows Security Alerts" style={{ fontSize: '12px', cursor: 'pointer' }}>
              🛡️
            </span>
          </TrayIcons>
          <TrayClock>{time || '10:23 AM'}</TrayClock>
        </SystemTray>
      </TaskbarContainer>
    </>
  );
};

export default Taskbar;