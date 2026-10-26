// client/src/components/Modals/RunDialog.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { RunIcon } from '../Icons/XpIcons';

interface RunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRun?: (command: string) => void;
}

const DialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  background-color: rgba(0, 0, 0, 0.1);
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
`;

const DialogWindow = styled.div`
  width: 390px;
  background-color: #ece9d8;
  border: 3px solid #0055ea;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
`;

const TitleBar = styled.div`
  height: 25px;
  background: linear-gradient(to right, #0058e6, #3a8bfb);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  width: 17px;
  height: 17px;
  background: linear-gradient(to bottom, #f27254 0%, #c72c0b 100%);
  border: 1px solid #fff;
  border-radius: 3px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const Body = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DescriptionRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const DescText = styled.span`
  font-size: 11px;
  line-height: 1.4;
  color: #000;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 11px;
  color: #000;
  width: 45px;
`;

const StyledInput = styled.input`
  flex: 1;
  height: 20px;
  padding: 0 4px;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  border: 1px solid #7f9db9;
  outline: none;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  min-width: 72px;
  height: 22px;
  background-color: #ece9d8;
  border: 1px solid ${({ $primary }) => ($primary ? '#003c74' : '#7f9db9')};
  border-radius: 3px;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background-color: #f7f6f0;
  }

  &:active {
    background-color: #dedbd0;
  }
`;

export const RunDialog: React.FC<RunDialogProps> = ({ isOpen, onClose, onRun }) => {
  const [command, setCommand] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRun && command.trim()) {
      onRun(command.trim());
    }
    onClose();
  };

  return (
    <DialogBackdrop onClick={onClose}>
      <DialogWindow onClick={(e) => e.stopPropagation()}>
        <TitleBar>
          <span>Run</span>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </TitleBar>

        <form onSubmit={handleSubmit}>
          <Body>
            <DescriptionRow>
              <RunIcon size={32} />
              <DescText>
                Type the name of a program, folder, document, or Internet resource,
                and Windows will open it for you.
              </DescText>
            </DescriptionRow>

            <InputRow>
              <InputLabel>Open:</InputLabel>
              <StyledInput
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                autoFocus
                placeholder="notepad, calc, cmd, etc."
              />
            </InputRow>

            <ActionsRow>
              <ActionBtn type="submit" $primary>
                OK
              </ActionBtn>
              <ActionBtn type="button" onClick={onClose}>
                Cancel
              </ActionBtn>
              <ActionBtn type="button">Browse...</ActionBtn>
            </ActionsRow>
          </Body>
        </form>
      </DialogWindow>
    </DialogBackdrop>
  );
};

export default RunDialog;
