// client/src/components/Windows/MyComputerWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  MyComputerIcon,
  WindowsFlagIcon,
  MyDocumentsIcon,
  SearchIcon
} from '../Icons/XpIcons';

interface MyComputerWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
}

const WindowContainer = styled.div<{ $isMinimized: boolean; $isMaximized: boolean; $zIndex: number }>`
  position: absolute;
  width: ${({ $isMaximized }) => ($isMaximized ? '100%' : '620px')};
  height: ${({ $isMaximized }) => ($isMaximized ? 'calc(100vh - 30px)' : '480px')};
  background-color: #ece9d8;
  border-top-left-radius: ${({ $isMaximized }) => ($isMaximized ? '0' : '8px')};
  border-top-right-radius: ${({ $isMaximized }) => ($isMaximized ? '0' : '8px')};
  border: 3px solid #0055ea;
  border-top: none;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.4);
  display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
  flex-direction: column;
  z-index: ${({ $zIndex }) => $zIndex};
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

/* Barra de Título Luna Blue */
const TitleBar = styled.div`
  height: 30px;
  background: linear-gradient(
    to bottom,
    #0058e6 0%,
    #3a8bfb 15%,
    #0055ea 50%,
    #0045be 100%
  );
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  color: #ffffff;
  cursor: move;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const WindowButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: default;
`;

const WinBtn = styled.button<{ $type?: 'close' }>`
  width: 21px;
  height: 21px;
  border-radius: 3px;
  border: 1px solid #ffffff;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 11px;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);

  background: ${({ $type }) =>
    $type === 'close'
      ? 'linear-gradient(to bottom, #f27254 0%, #e04322 45%, #c72c0b 100%)'
      : 'linear-gradient(to bottom, #428eff 0%, #2062cc 50%, #0e4499 100%)'};

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.85);
  }
`;

/* Barra de Menús (File, Edit, View, Favorites, Tools, Help) */
const MenuBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 22px;
  background-color: #ece9d8;
  border-bottom: 1px solid #dcd9c9;
  padding: 0 4px;
`;

const MenuList = styled.div`
  display: flex;
  gap: 2px;
`;

const MenuItem = styled.span`
  padding: 2px 6px;
  font-size: 11px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background-color: #316ac5;
    color: #fff;
  }
`;

/* Barra de Herramientas Estilo XP */
const ToolBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  background-color: #ece9d8;
  border-bottom: 1px solid #c0bdb0;
  padding: 0 8px;
`;

const ToolBtn = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  color: ${({ $disabled }) => ($disabled ? '#999' : '#000')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  &:hover {
    ${({ $disabled }) =>
      !$disabled &&
      `
      background: #e2dfcf;
      border: 1px solid #999;
      padding: 2px 5px;
    `}
  }
`;

/* Barra de Direcciones (Address Bar) */
const AddressBar = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  background-color: #ece9d8;
  border-bottom: 1px solid #a09d90;
  padding: 0 6px;
  gap: 6px;
`;

const AddressLabel = styled.span`
  font-size: 11px;
  color: #555;
`;

const AddressInput = styled.div`
  flex: 1;
  height: 18px;
  background: #ffffff;
  border: 1px solid #7f9db9;
  display: flex;
  align-items: center;
  padding: 0 4px;
  gap: 4px;
  font-size: 11px;
`;

const GoButton = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #238b1d;
  color: white;
  padding: 1px 6px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
`;

/* Área de contenido dividida en dos paneles */
const ContentArea = styled.div`
  flex: 1;
  display: flex;
  background-color: #ffffff;
  overflow: hidden;
`;

/* Panel izquierdo azul con tareas y enlaces rápidos */
const LeftPanel = styled.div`
  width: 190px;
  background: linear-gradient(to bottom, #7ba2e7 0%, #6375d6 100%);
  padding: 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionBox = styled.div`
  background: #ffffff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const SectionHeader = styled.div`
  height: 22px;
  background: linear-gradient(to right, #225ad9, #4c8cf5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: #ffffff;
  font-weight: bold;
  font-size: 11px;
  cursor: pointer;
`;

const SectionContent = styled.div`
  background: #d6dff7;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TaskLink = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #0c327d;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #2b72e2;
  }
`;

/* Panel derecho con las unidades y carpetas */
const RightPanel = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 12px;
  overflow-y: auto;
`;

const GroupHeading = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: #003399;
  border-bottom: 1px solid #709ad6;
  padding-bottom: 2px;
  margin-bottom: 8px;
`;

const GridList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 18px;
`;

const DriveItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 175px;
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;

  &:hover {
    background-color: #e5efff;
  }
`;

const DriveText = styled.span`
  font-size: 11px;
  color: #000;
`;

export const MyComputerWindow: React.FC<MyComputerWindowProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Estado de posición y arrastre
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const initialX = Math.max(40, window.innerWidth - 620 - 80);
      return { x: initialX, y: 60 };
    }
    return { x: 240, y: 60 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 240,
    posY: 60
  });

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMaximized) return;
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
      const newX = Math.max(0, Math.min(window.innerWidth - 120, dragRef.current.posX + dx));
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

  if (!isOpen) return null;

  return (
    <WindowContainer
      $isMinimized={isMinimized}
      $isMaximized={isMaximized}
      $zIndex={zIndex}
      onClick={onFocus}
      style={
        isMaximized
          ? { top: 0, left: 0, right: 0, bottom: 30, width: '100%', height: 'calc(100vh - 30px)' }
          : { top: `${position.y}px`, left: `${position.x}px` }
      }
    >
      {/* 1. Barra de Título */}
      <TitleBar
        onMouseDown={handleMouseDownTitle}
        onDoubleClick={() => setIsMaximized((prev) => !prev)}
      >
        <TitleContent>
          <MyComputerIcon size={18} />
          <span>My Computer</span>
        </TitleContent>
        <WindowButtons onMouseDown={(e) => e.stopPropagation()}>
          <WinBtn onClick={onMinimize} title="Minimize">_</WinBtn>
          <WinBtn onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
            {isMaximized ? '❐' : '□'}
          </WinBtn>
          <WinBtn $type="close" onClick={onClose} title="Close">✕</WinBtn>
        </WindowButtons>
      </TitleBar>

      {/* 2. Menú Superior */}
      <MenuBar>
        <MenuList>
          <MenuItem>File</MenuItem>
          <MenuItem>Edit</MenuItem>
          <MenuItem>View</MenuItem>
          <MenuItem>Favorites</MenuItem>
          <MenuItem>Tools</MenuItem>
          <MenuItem>Help</MenuItem>
        </MenuList>
        <WindowsFlagIcon size={16} />
      </MenuBar>

      {/* 3. Barra de Herramientas */}
      <ToolBar>
        <ToolBtn $disabled>
          <span style={{ color: '#238b1d', fontSize: '14px' }}>←</span>
          <span>Back</span>
        </ToolBtn>
        <ToolBtn $disabled>
          <span style={{ fontSize: '14px' }}>→</span>
        </ToolBtn>
        <ToolBtn>
          <span>📁 Up</span>
        </ToolBtn>
        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 4px' }} />
        <ToolBtn>
          <SearchIcon size={16} />
          <span>Search</span>
        </ToolBtn>
        <ToolBtn>
          <span>🗂️ Folders</span>
        </ToolBtn>
      </ToolBar>

      {/* 4. Barra de Direcciones */}
      <AddressBar>
        <AddressLabel>Address</AddressLabel>
        <AddressInput>
          <MyComputerIcon size={14} />
          <span>My Computer</span>
        </AddressInput>
        <GoButton>➔ Go</GoButton>
      </AddressBar>

      {/* 5. Área de Contenido */}
      <ContentArea>
        {/* Panel izquierdo de tareas */}
        <LeftPanel>
          <SectionBox>
            <SectionHeader>
              <span>System Tasks</span>
              <span>˄</span>
            </SectionHeader>
            <SectionContent>
              <TaskLink>ℹ️ View system information</TaskLink>
              <TaskLink>➕ Add or remove programs</TaskLink>
              <TaskLink>⚙️ Change a setting</TaskLink>
            </SectionContent>
          </SectionBox>

          <SectionBox>
            <SectionHeader>
              <span>Other Places</span>
              <span>˄</span>
            </SectionHeader>
            <SectionContent>
              <TaskLink>🌐 My Network Places</TaskLink>
              <TaskLink>📁 My Documents</TaskLink>
              <TaskLink>📂 Shared Documents</TaskLink>
              <TaskLink>🛠️ Control Panel</TaskLink>
            </SectionContent>
          </SectionBox>

          <SectionBox>
            <SectionHeader>
              <span>Details</span>
              <span>˄</span>
            </SectionHeader>
            <SectionContent>
              <div style={{ fontWeight: 'bold', fontSize: '11px' }}>My Computer</div>
              <div style={{ color: '#555', fontSize: '10px' }}>System Folder</div>
            </SectionContent>
          </SectionBox>
        </LeftPanel>

        {/* Panel derecho con discos y carpetas */}
        <RightPanel>
          {/* Files Stored on This Computer */}
          <GroupHeading>Files Stored on This Computer</GroupHeading>
          <GridList>
            <DriveItem>
              <MyDocumentsIcon size={32} />
              <DriveText>Shared Documents</DriveText>
            </DriveItem>
            <DriveItem>
              <MyDocumentsIcon size={32} />
              <DriveText>Alejandro's Documents</DriveText>
            </DriveItem>
          </GridList>

          {/* Hard Disk Drives */}
          <GroupHeading>Hard Disk Drives</GroupHeading>
          <GridList>
            <DriveItem>
              <div style={{ fontSize: '28px' }}>💽</div>
              <div>
                <DriveText style={{ fontWeight: 'bold' }}>Local Disk (C:)</DriveText>
                <div style={{ fontSize: '10px', color: '#666' }}>NTFS (38.2 GB free)</div>
              </div>
            </DriveItem>
          </GridList>

          {/* Devices with Removable Storage */}
          <GroupHeading>Devices with Removable Storage</GroupHeading>
          <GridList>
            <DriveItem>
              <div style={{ fontSize: '28px' }}>💿</div>
              <div>
                <DriveText style={{ fontWeight: 'bold' }}>CD Drive (D:)</DriveText>
              </div>
            </DriveItem>
          </GridList>
        </RightPanel>
      </ContentArea>
    </WindowContainer>
  );
};

export default MyComputerWindow;
