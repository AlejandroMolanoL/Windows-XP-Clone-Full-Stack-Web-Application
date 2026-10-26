// client/src/components/StartMenu/StartMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  ChessAvatar,
  InternetExplorerIcon,
  OutlookExpressIcon,
  MsnButterflyIcon,
  WindowsMediaPlayerIcon,
  WindowsMessengerIcon,
  TourXpIcon,
  TransferWizardIcon,
  MyDocumentsIcon,
  MyRecentDocumentsIcon,
  MyPicturesIcon,
  MyMusicIcon,
  MyComputerIcon,
  ControlPanelIcon,
  ProgramAccessIcon,
  PrintersFaxesIcon,
  HelpSupportIcon,
  SearchIcon,
  RunIcon,
  LogOffIcon,
  TurnOffIcon,
  CalculatorIcon,
  PaintIcon,
  MinesweeperIcon
} from '../Icons/XpIcons';

export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp?: (appId: string) => void;
}

const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 395px;
  background-color: #0055ea;
  border: 2px solid #0055ea;
  border-bottom: none;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  box-shadow: 3px -3px 15px rgba(0, 0, 0, 0.45);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 2000;
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
  box-sizing: border-box;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

/* Cabecera con Avatar de Alejandro */
const MenuHeader = styled.div`
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    to bottom,
    #225ad9 0%,
    #1d59b2 15%,
    #2b73e3 50%,
    #1854b7 100%
  );
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  gap: 10px;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #0d3b84;
  }
`;

const AvatarWrapper = styled.div`
  width: 42px;
  height: 42px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const UserName = styled.span`
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.3px;
`;

/* Cuerpo de dos columnas */
const MenuBody = styled.div`
  display: flex;
  width: 100%;
  min-height: 380px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

/* Columna Izquierda (Programas) */
const LeftColumn = styled.div`
  flex: 1;
  width: 50%;
  min-width: 0;
  background-color: #ffffff;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
`;

const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

/* Columna Derecha (Lugares y Configuración) */
const RightColumn = styled.div`
  flex: 1;
  width: 50%;
  min-width: 0;
  background: linear-gradient(to right, #d3e5fa 0%, #dbebfb 100%);
  border-left: 1px solid #95bdee;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1px;
  box-sizing: border-box;
`;

/* Elementos individuales del menú */
const MenuItem = styled.div<{ $isPinned?: boolean; $isBold?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $isPinned }) => ($isPinned ? '4px 6px' : '3px 6px')};
  border-radius: 3px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #316ac5;
    color: #ffffff;

    .item-title {
      color: #ffffff !important;
    }

    .item-subtitle {
      color: #dce6f7 !important;
    }

    .arrow-icon {
      color: #ffffff !important;
    }
  }
`;

const ItemIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  flex-shrink: 0;
`;

const ItemTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.span<{ $bold?: boolean }>`
  font-size: 11px;
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'normal')};
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

const ItemSubtitle = styled.span`
  font-size: 10px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

const SubmenuArrow = styled.span`
  font-size: 9px;
  color: #333333;
  margin-left: auto;
  padding-left: 4px;
`;

/* Separadores */
const LeftDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #c8c8c8 20%, #c8c8c8 80%, transparent);
  margin: 4px 6px;
`;

const RightDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #9abde8 20%, #9abde8 80%, transparent);
  margin: 4px 6px;
`;

/* Botón "All Programs" */
const AllProgramsBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 8px;
  margin-top: 4px;
  border-top: 1px solid #d3d3d3;
  font-weight: bold;
  font-size: 11px;
  color: #000000;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background-color: #316ac5;
    color: #ffffff;

    .green-arrow {
      border-left-color: #ffffff;
    }
  }
`;

const GreenArrow = styled.div`
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid #238b1d;
`;

/* Pie de página (Footer) con Log Off y Turn Off */
const MenuFooter = styled.div`
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    to bottom,
    #225ad9 0%,
    #1d59b2 15%,
    #2b73e3 50%,
    #1854b7 100%
  );
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  gap: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffffff;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 3px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    background: rgba(0, 0, 0, 0.2);
  }
`;

/* Submenú emergente para "My Recent Documents" */
const SubmenuFlyout = styled.div`
  position: absolute;
  left: 100%;
  top: 10px;
  width: 175px;
  background-color: #ffffff;
  border: 1px solid #0055ea;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.35);
  padding: 3px;
  display: flex;
  flex-direction: column;
  z-index: 2100;
`;

const SubmenuItem = styled.div`
  padding: 4px 8px;
  font-size: 11px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #316ac5;
    color: #fff;
  }
`;

/* Submenú emergente para "All Programs" */
const AllProgramsFlyout = styled.div`
  position: absolute;
  left: 100%;
  bottom: 0;
  width: 200px;
  background-color: #ffffff;
  border: 1px solid #0055ea;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.35);
  padding: 4px;
  display: flex;
  flex-direction: column;
  z-index: 2100;
`;

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [showRecentDocs, setShowRecentDocs] = useState(false);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        // Asegurarse de que no sea el botón de inicio
        const startBtn = document.getElementById('xp-start-button');
        if (startBtn && startBtn.contains(event.target as Node)) {
          return;
        }
        onClose();
        setShowRecentDocs(false);
        setShowAllPrograms(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (appId: string) => {
    if (onOpenApp) {
      onOpenApp(appId);
    }
    onClose();
    setShowRecentDocs(false);
    setShowAllPrograms(false);
  };

  return (
    <MenuContainer $isOpen={isOpen} ref={menuRef}>
      {/* 1. Cabecera con Avatar y Nombre de Usuario */}
      <MenuHeader>
        <AvatarWrapper>
          <ChessAvatar size={42} />
        </AvatarWrapper>
        <UserName>Alejandro</UserName>
      </MenuHeader>

      {/* 2. Cuerpo del Menú en 2 Columnas */}
      <MenuBody>
        {/* Columna Izquierda: Programas */}
        <LeftColumn>
          <ProgramList>
            {/* Internet Explorer */}
            <MenuItem
              $isPinned
              onClick={() => handleItemClick('internet_explorer')}
              title="Browse the Internet"
            >
              <ItemIcon>
                <InternetExplorerIcon size={30} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title" $bold>Internet</ItemTitle>
                <ItemSubtitle className="item-subtitle">Internet Explorer</ItemSubtitle>
              </ItemTextWrapper>
            </MenuItem>

            {/* Outlook Express */}
            <MenuItem
              $isPinned
              onClick={() => handleItemClick('outlook_express')}
              title="E-mail Client"
            >
              <ItemIcon>
                <OutlookExpressIcon size={30} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title" $bold>E-mail</ItemTitle>
                <ItemSubtitle className="item-subtitle">Outlook Express</ItemSubtitle>
              </ItemTextWrapper>
            </MenuItem>

            <LeftDivider />

            {/* MSN */}
            <MenuItem onClick={() => handleItemClick('msn')} title="MSN">
              <ItemIcon>
                <MsnButterflyIcon size={26} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title">MSN</ItemTitle>
              </ItemTextWrapper>
            </MenuItem>

            {/* Windows Media Player */}
            <MenuItem onClick={() => handleItemClick('media_player')} title="Windows Media Player">
              <ItemIcon>
                <WindowsMediaPlayerIcon size={26} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title">Windows Media Player</ItemTitle>
              </ItemTextWrapper>
            </MenuItem>

            {/* Windows Messenger */}
            <MenuItem onClick={() => handleItemClick('messenger')} title="Windows Messenger">
              <ItemIcon>
                <WindowsMessengerIcon size={26} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title">Windows Messenger</ItemTitle>
              </ItemTextWrapper>
            </MenuItem>

            {/* Tour Windows XP */}
            <MenuItem onClick={() => handleItemClick('tour_xp')} title="Tour Windows XP">
              <ItemIcon>
                <TourXpIcon size={26} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title">Tour Windows XP</ItemTitle>
              </ItemTextWrapper>
            </MenuItem>

            {/* Files and Settings Transfer Wizard */}
            <MenuItem onClick={() => handleItemClick('transfer_wizard')} title="Files and Settings Transfer Wizard">
              <ItemIcon>
                <TransferWizardIcon size={26} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title">Files and Settings Transfer Wizard</ItemTitle>
              </ItemTextWrapper>
            </MenuItem>
          </ProgramList>

          {/* All Programs con botón y flecha verde */}
          <div style={{ position: 'relative' }}>
            <AllProgramsBtn
              onClick={() => setShowAllPrograms(!showAllPrograms)}
              onMouseEnter={() => setShowAllPrograms(true)}
            >
              <span>All Programs</span>
              <GreenArrow className="green-arrow" />
            </AllProgramsBtn>

            {showAllPrograms && (
              <AllProgramsFlyout onMouseLeave={() => setShowAllPrograms(false)}>
                <SubmenuItem onClick={() => handleItemClick('notepad')}>
                  📝 Accessories / Notepad
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('calc')}>
                  <CalculatorIcon size={16} /> Calculator
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('paint')}>
                  <PaintIcon size={16} /> Paint
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('minesweeper')}>
                  <MinesweeperIcon size={16} /> Minesweeper
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('solitaire')}>
                  🃏 Games / Solitaire
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('cmd')}>
                  💻 Command Prompt (cmd)
                </SubmenuItem>
              </AllProgramsFlyout>
            )}
          </div>
        </LeftColumn>

        {/* Columna Derecha: Sistema y Lugares */}
        <RightColumn>
          {/* My Documents */}
          <MenuItem onClick={() => handleItemClick('my_documents')} title="My Documents">
            <ItemIcon>
              <MyDocumentsIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title" $bold>My Documents</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* My Recent Documents (con submenú desplegable) */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowRecentDocs(true)}
            onMouseLeave={() => setShowRecentDocs(false)}
          >
            <MenuItem title="My Recent Documents">
              <ItemIcon>
                <MyRecentDocumentsIcon size={24} />
              </ItemIcon>
              <ItemTextWrapper>
                <ItemTitle className="item-title" $bold>My Recent Documents</ItemTitle>
              </ItemTextWrapper>
              <SubmenuArrow className="arrow-icon">▶</SubmenuArrow>
            </MenuItem>

            {showRecentDocs && (
              <SubmenuFlyout>
                <SubmenuItem onClick={() => handleItemClick('doc_resume')}>
                  📄 Resume_2003.doc
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('doc_budget')}>
                  📊 Family_Budget.xls
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('doc_photo')}>
                  🖼️ Bliss_Wallpaper.jpg
                </SubmenuItem>
                <SubmenuItem onClick={() => handleItemClick('doc_notes')}>
                  📝 Meeting_Notes.txt
                </SubmenuItem>
              </SubmenuFlyout>
            )}
          </div>

          {/* My Pictures */}
          <MenuItem onClick={() => handleItemClick('my_pictures')} title="My Pictures">
            <ItemIcon>
              <MyPicturesIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title" $bold>My Pictures</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* My Music */}
          <MenuItem onClick={() => handleItemClick('my_music')} title="My Music">
            <ItemIcon>
              <MyMusicIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title" $bold>My Music</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* My Computer (¡El de la captura!) */}
          <MenuItem onClick={() => handleItemClick('my_computer')} title="My Computer">
            <ItemIcon>
              <MyComputerIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title" $bold>My Computer</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          <RightDivider />

          {/* Control Panel */}
          <MenuItem onClick={() => handleItemClick('control_panel')} title="Control Panel">
            <ItemIcon>
              <ControlPanelIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Control Panel</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* Set Program Access and Defaults */}
          <MenuItem onClick={() => handleItemClick('program_access')} title="Set Program Access and Defaults">
            <ItemIcon>
              <ProgramAccessIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Set Program Access and Defaults</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* Printers and Faxes */}
          <MenuItem onClick={() => handleItemClick('printers')} title="Printers and Faxes">
            <ItemIcon>
              <PrintersFaxesIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Printers and Faxes</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          <RightDivider />

          {/* Help and Support */}
          <MenuItem onClick={() => handleItemClick('help')} title="Help and Support">
            <ItemIcon>
              <HelpSupportIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Help and Support</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* Search */}
          <MenuItem onClick={() => handleItemClick('search')} title="Search">
            <ItemIcon>
              <SearchIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Search</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>

          {/* Run... */}
          <MenuItem onClick={() => handleItemClick('run')} title="Run...">
            <ItemIcon>
              <RunIcon size={24} />
            </ItemIcon>
            <ItemTextWrapper>
              <ItemTitle className="item-title">Run...</ItemTitle>
            </ItemTextWrapper>
          </MenuItem>
        </RightColumn>
      </MenuBody>

      {/* 3. Pie de página (Footer) con Log Off y Turn Off Computer */}
      <MenuFooter>
        <FooterButton onClick={() => handleItemClick('log_off')} title="Log off Windows">
          <LogOffIcon size={20} />
          <span>Log Off</span>
        </FooterButton>

        <FooterButton onClick={() => handleItemClick('turn_off')} title="Shut down or restart Windows">
          <TurnOffIcon size={20} />
          <span>Turn Off Computer</span>
        </FooterButton>
      </MenuFooter>
    </MenuContainer>
  );
};

export default StartMenu;
