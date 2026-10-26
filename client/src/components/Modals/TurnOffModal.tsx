// client/src/components/Modals/TurnOffModal.tsx
import React from 'react';
import styled from 'styled-components';
import { WindowsFlagIcon } from '../Icons/XpIcons';

interface TurnOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: 'standby' | 'turnoff' | 'restart') => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: grayscale(80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
`;

const DialogBox = styled.div`
  width: 310px;
  background: linear-gradient(to bottom, #0055ea 0%, #0040b0 100%);
  border: 1px solid #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const DialogBody = styled.div`
  background: linear-gradient(to bottom, #5a7edc 0%, #3a5bb0 100%);
  padding: 24px 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover .icon-btn {
    filter: brightness(1.25);
    transform: scale(1.05);
  }

  &:active .icon-btn {
    transform: scale(0.95);
  }
`;

const CircleButton = styled.button<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background-color: ${({ $color }) => $color};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: transform 0.1s, filter 0.1s;
`;

const ButtonLabel = styled.span`
  color: #ffffff;
  font-size: 11px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
`;

const DialogFooter = styled.div`
  background: #0040b0;
  padding: 8px 12px;
  display: flex;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background-color: #ece9d8;
  border: 1px solid #003c74;
  border-radius: 3px;
  padding: 3px 14px;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background-color: #f5f4ea;
  }

  &:active {
    background-color: #d8d4c0;
  }
`;

export const TurnOffModal: React.FC<TurnOffModalProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <DialogBox onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <span>Turn off computer</span>
          <WindowsFlagIcon size={18} />
        </DialogHeader>

        <DialogBody>
          {/* Stand By */}
          <ActionButton
            onClick={() => {
              if (onAction) onAction('standby');
              onClose();
            }}
          >
            <CircleButton className="icon-btn" $color="#ff9900" title="Stand By">
              ⏸
            </CircleButton>
            <ButtonLabel>Stand By</ButtonLabel>
          </ActionButton>

          {/* Turn Off */}
          <ActionButton
            onClick={() => {
              if (onAction) onAction('turnoff');
              onClose();
            }}
          >
            <CircleButton className="icon-btn" $color="#e81123" title="Turn Off">
              ⏻
            </CircleButton>
            <ButtonLabel>Turn Off</ButtonLabel>
          </ActionButton>

          {/* Restart */}
          <ActionButton
            onClick={() => {
              if (onAction) onAction('restart');
              onClose();
            }}
          >
            <CircleButton className="icon-btn" $color="#00b050" title="Restart">
              🔄
            </CircleButton>
            <ButtonLabel>Restart</ButtonLabel>
          </ActionButton>
        </DialogBody>

        <DialogFooter>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
        </DialogFooter>
      </DialogBox>
    </Overlay>
  );
};

export default TurnOffModal;
