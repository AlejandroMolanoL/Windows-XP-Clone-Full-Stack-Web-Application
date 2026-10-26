// client/src/components/Taskbar/StartButton.tsx
import React from 'react';
import styled from 'styled-components';
import { WindowsFlagIcon } from '../Icons/XpIcons';

interface StartButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
}

const Button = styled.button<{ $isOpen?: boolean }>`
  /* Gradiente verde clásico de Windows XP Luna */
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(to top, #3DA953 0%, #2f9920 40%, #1e5c2d 100%)'
      : 'linear-gradient(to bottom, #49b55f 0%, #38bb22 15%, #3ed82b 30%, #2e7143 100%)'};
  
  border: 1px solid #1a5325;
  border-right-color: #123b1a;
  border-bottom-color: #123b1a;

  /* La famosa curvatura del botón Start */
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  
  width: 104px;
  height: 28px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  color: #ffffff;
  font-family: 'Tahoma', 'Franklin Gothic Medium', sans-serif;
  font-size: 15px;
  font-weight: bold;
  font-style: italic;
  
  /* Sombra de texto azul clásica de XP */
  text-shadow: 1px 1px 2px #0146db; 
  
  cursor: pointer;
  outline: none;
  user-select: none;
  
  box-shadow: ${({ $isOpen }) =>
    $isOpen
      ? 'inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 1px 1px 3px rgba(0, 0, 0, 0.3)'};

  filter: ${({ $isOpen }) => ($isOpen ? 'brightness(0.92)' : 'none')};

  &:hover {
    filter: brightness(1.12);
  }

  &:active {
    background: linear-gradient(to top, #3da953 0%, #2f9920 40%, #1e5c2d 100%);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6);
    filter: brightness(0.92);
  }
`;

const StartText = styled.span`
  margin-top: -1px;
  letter-spacing: 0.5px;
`;

const StartButton: React.FC<StartButtonProps> = ({ isOpen = false, onClick }) => {
  return (
    <Button id="xp-start-button" $isOpen={isOpen} onClick={onClick}>
      <WindowsFlagIcon size={18} />
      <StartText>start</StartText>
    </Button>
  );
};

export default StartButton;