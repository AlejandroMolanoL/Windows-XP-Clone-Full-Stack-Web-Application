// client/src/components/Windows/CalculatorWindow.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { CalculatorIcon } from '../Icons/XpIcons';

interface CalculatorWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
}

const WindowContainer = styled.div<{ $isMinimized: boolean; $zIndex: number }>`
  position: absolute;
  width: 262px;
  background-color: #ece9d8;
  border: 3px solid #0055ea;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.45);
  display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
  flex-direction: column;
  z-index: ${({ $zIndex }) => $zIndex};
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
  box-sizing: border-box;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

/* Barra de Título Luna Blue clásica */
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
  gap: 5px;
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
    if ($type === 'disabled') {
      return 'linear-gradient(to bottom, #428eff 0%, #2062cc 50%, #0e4499 100%)';
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

/* Barra de Menú (Edit, View, Help) */
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

const MenuItem = styled.div`
  padding: 2px 6px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;

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
  z-index: 50;
  min-width: 140px;
`;

const DropdownItem = styled.div<{ $disabled?: boolean }>`
  padding: 4px 16px 4px 20px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  color: ${({ $disabled }) => ($disabled ? '#888' : '#000')};

  &:hover {
    ${({ $disabled }) =>
      !$disabled &&
      `
      background-color: #316ac5;
      color: #ffffff;
    `}
  }
`;

/* Cuerpo principal de la calculadora */
const CalcBody = styled.div`
  padding: 9px 8px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #ece9d8;
`;

/* Pantalla / Display hundido */
const DisplayScreen = styled.div`
  height: 26px;
  background-color: #ffffff;
  border: 2px solid;
  border-color: #7f9db9 #ffffff #ffffff #7f9db9;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 6px;
  font-family: 'Tahoma', 'Lucida Console', monospace;
  font-size: 14px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Fila de controles superiores (Indicador de Memoria y Backspace / CE / C) */
const TopControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MemoryBox = styled.div`
  width: 28px;
  height: 27px;
  background-color: #ece9d8;
  border: 2px solid;
  border-color: #7f9db9 #ffffff #ffffff #7f9db9;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  font-weight: bold;
  color: #cc0000;
  flex-shrink: 0;
`;

const TopButtonsGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 6px;
`;

/* Botón estilo clásico Luna XP */
const CalcButton = styled.button<{ $color?: 'red' | 'blue'; $width?: string }>`
  height: 27px;
  flex: 1;
  width: ${({ $width }) => $width || 'auto'};
  background: linear-gradient(to bottom, #ffffff 0%, #f4f3ec 40%, #e2ded0 100%);
  border: 1px solid #003c74;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  font-weight: bold;
  color: ${({ $color }) => ($color === 'red' ? '#cc0000' : '#0000cc')};
  box-shadow: inset 1px 1px 0px #ffffff, inset -1px -1px 0px #bcb8a8;
  padding: 0;

  &:hover {
    background: linear-gradient(to bottom, #ffffff 0%, #fffbe0 50%, #f7e6b0 100%);
    border-color: #e5a01a;
  }

  &:active {
    background: #d8d4c4;
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.35);
    transform: translate(1px, 1px);
  }
`;

/* Cuadrícula de 4 filas x 6 columnas */
const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 27px);
  gap: 5px;
`;

export const CalculatorWindow: React.FC<CalculatorWindowProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex
}) => {
  // Estado de la ventana (Arrastre)
  const [position, setPosition] = useState({ x: 260, y: 110 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 260,
    posY: 110
  });

  // Menús desplegables
  const [activeMenu, setActiveMenu] = useState<'edit' | 'view' | 'help' | null>(null);

  // Estado de la lógica de calculadora
  const [display, setDisplay] = useState<string>('0.');
  const [memory, setMemory] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Manejo de arrastre de la ventana
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Solo botón izquierdo
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
      const newX = Math.max(0, Math.min(window.innerWidth - 270, dragRef.current.posX + dx));
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

  // Formato número para display similar a Windows XP
  const formatResult = (num: number): string => {
    if (!isFinite(num) || isNaN(num)) {
      return 'Cannot divide by zero.';
    }
    // Redondear para evitar errores flotantes tipo 0.0000000000000002
    const str = parseFloat(num.toPrecision(12)).toString();
    // Añadir punto si no tiene decimales para emular la estética "0."
    return str.includes('.') ? str : `${str}.`;
  };

  // Helper para obtener el número actual mostrado
  const getCurrentNumber = useCallback((): number => {
    const cleanStr = display.endsWith('.') ? display.slice(0, -1) : display;
    return parseFloat(cleanStr) || 0;
  }, [display]);

  // Manejador de dígitos (0-9)
  const handleDigit = useCallback((d: string) => {
    if (isError) return;

    if (overwrite) {
      setDisplay(d === '0' ? '0.' : `${d}.`);
      setOverwrite(false);
    } else {
      if (display === '0.' || display === '0') {
        setDisplay(`${d}.`);
      } else {
        // Quitar punto final temporal si existe para agregar dígito
        const hasExplicitDot = display.includes('.') && !display.endsWith('.');
        if (hasExplicitDot) {
          setDisplay(display + d);
        } else if (display.endsWith('.')) {
          setDisplay(display.slice(0, -1) + d + '.');
        } else {
          setDisplay(display + d + '.');
        }
      }
    }
  }, [isError, overwrite, display]);

  // Manejador del punto decimal '.'
  const handleDecimal = useCallback(() => {
    if (isError) return;

    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else {
      // Si ya tiene un punto fijo con decimales, no hacer nada
      const clean = display.endsWith('.') ? display.slice(0, -1) : display;
      if (!clean.includes('.')) {
        setDisplay(clean + '.');
      }
    }
  }, [isError, overwrite, display]);

  // Manejador de Backspace
  const handleBackspace = useCallback(() => {
    if (isError || overwrite) return;

    let cur = display;
    if (cur.endsWith('.')) {
      cur = cur.slice(0, -1);
    }

    if (cur.length > 1) {
      const next = cur.slice(0, -1);
      setDisplay(next.includes('.') ? next : `${next}.`);
    } else {
      setDisplay('0.');
      setOverwrite(true);
    }
  }, [isError, overwrite, display]);

  // Manejador Clear Entry (CE)
  const handleCE = useCallback(() => {
    if (isError) {
      // Si está en error, CE limpia todo
      setDisplay('0.');
      setPreviousValue(null);
      setPendingOperator(null);
      setOverwrite(true);
      setIsError(false);
      return;
    }
    setDisplay('0.');
    setOverwrite(true);
  }, [isError]);

  // Manejador Clear (C)
  const handleC = useCallback(() => {
    setDisplay('0.');
    setPreviousValue(null);
    setPendingOperator(null);
    setOverwrite(true);
    setIsError(false);
  }, []);

  // Ejecución de cálculo
  const executeCalculation = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  // Operadores aritméticos (+, -, *, /)
  const handleOperator = useCallback((op: string) => {
    if (isError) return;

    const currentVal = getCurrentNumber();

    if (previousValue !== null && pendingOperator && !overwrite) {
      const result = executeCalculation(previousValue, currentVal, pendingOperator);
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Cannot divide by zero.');
        setIsError(true);
        setPreviousValue(null);
        setPendingOperator(null);
        return;
      }
      setDisplay(formatResult(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentVal);
    }

    setPendingOperator(op);
    setOverwrite(true);
  }, [isError, getCurrentNumber, previousValue, pendingOperator, overwrite]);

  // Igual (=)
  const handleEquals = useCallback(() => {
    if (isError || pendingOperator === null || previousValue === null) return;

    const currentVal = getCurrentNumber();
    const result = executeCalculation(previousValue, currentVal, pendingOperator);

    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Cannot divide by zero.');
      setIsError(true);
      setPreviousValue(null);
      setPendingOperator(null);
      return;
    }

    setDisplay(formatResult(result));
    setPreviousValue(null);
    setPendingOperator(null);
    setOverwrite(true);
  }, [isError, pendingOperator, previousValue, getCurrentNumber]);

  // Raíz cuadrada (sqrt)
  const handleSqrt = useCallback(() => {
    if (isError) return;
    const currentVal = getCurrentNumber();
    if (currentVal < 0) {
      setDisplay('Invalid input for function.');
      setIsError(true);
      return;
    }
    const res = Math.sqrt(currentVal);
    setDisplay(formatResult(res));
    setOverwrite(true);
  }, [isError, getCurrentNumber]);

  // Porcentaje (%)
  const handlePercent = useCallback(() => {
    if (isError) return;
    const currentVal = getCurrentNumber();
    if (previousValue !== null && pendingOperator) {
      let res = 0;
      if (pendingOperator === '+' || pendingOperator === '-') {
        res = previousValue * (currentVal / 100);
      } else {
        res = currentVal / 100;
      }
      setDisplay(formatResult(res));
    } else {
      setDisplay('0.');
    }
    setOverwrite(true);
  }, [isError, getCurrentNumber, previousValue, pendingOperator]);

  // Recíproco (1/x)
  const handleReciprocal = useCallback(() => {
    if (isError) return;
    const currentVal = getCurrentNumber();
    if (currentVal === 0) {
      setDisplay('Cannot divide by zero.');
      setIsError(true);
      return;
    }
    const res = 1 / currentVal;
    setDisplay(formatResult(res));
    setOverwrite(true);
  }, [isError, getCurrentNumber]);

  // Invertir signo (+/-)
  const handleNegate = useCallback(() => {
    if (isError) return;
    const currentVal = getCurrentNumber();
    const res = -currentVal;
    setDisplay(formatResult(res));
  }, [isError, getCurrentNumber]);

  // Funciones de Memoria (MC, MR, MS, M+)
  const handleMC = () => setMemory(0);
  const handleMR = () => {
    if (isError) return;
    setDisplay(formatResult(memory));
    setOverwrite(true);
  };
  const handleMS = () => {
    if (isError) return;
    setMemory(getCurrentNumber());
    setOverwrite(true);
  };
  const handleMPlus = () => {
    if (isError) return;
    setMemory((prev) => prev + getCurrentNumber());
    setOverwrite(true);
  };

  // Copiar y pegar
  const handleCopy = () => {
    const val = display.endsWith('.') ? display.slice(0, -1) : display;
    navigator.clipboard?.writeText(val);
    setActiveMenu(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      const num = parseFloat(text);
      if (!isNaN(num)) {
        setDisplay(formatResult(num));
        setOverwrite(true);
      }
    } catch {
      // Ignorar fallo de portapapeles
    }
    setActiveMenu(null);
  };

  // Manejo de eventos de teclado
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Si la ventana está abierta, permitir entradas de teclado
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        handleOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleC();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleCE();
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        handleCopy();
      } else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        handlePaste();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isOpen,
    isMinimized,
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleC,
    handleCE
  ]);

  if (!isOpen) return null;

  return (
    <WindowContainer
      $isMinimized={isMinimized}
      $zIndex={zIndex}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={() => {
        onFocus();
        if (activeMenu) setActiveMenu(null);
      }}
    >
      {/* 1. Barra de Título */}
      <TitleBar onMouseDown={handleMouseDown}>
        <TitleContent>
          <CalculatorIcon size={16} />
          <span>Calculator</span>
        </TitleContent>
        <WindowButtons>
          <WinBtn onClick={onMinimize} title="Minimize">
            _
          </WinBtn>
          <WinBtn $type="disabled" title="Maximize (Unavailable)">
            □
          </WinBtn>
          <WinBtn $type="close" onClick={onClose} title="Close">
            ✕
          </WinBtn>
        </WindowButtons>
      </TitleBar>

      {/* 2. Barra de Menú */}
      <MenuBar onClick={(e) => e.stopPropagation()}>
        <MenuItem
          onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
        >
          <u>E</u>dit
        </MenuItem>
        <MenuItem
          onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
        >
          <u>V</u>iew
        </MenuItem>
        <MenuItem
          onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
        >
          <u>H</u>elp
        </MenuItem>

        {/* Desplegable Edit */}
        {activeMenu === 'edit' && (
          <DropdownMenu>
            <DropdownItem onClick={handleCopy}>
              <span>Copy</span>
              <span style={{ color: '#888' }}>Ctrl+C</span>
            </DropdownItem>
            <DropdownItem onClick={handlePaste}>
              <span>Paste</span>
              <span style={{ color: '#888' }}>Ctrl+V</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Desplegable View */}
        {activeMenu === 'view' && (
          <DropdownMenu>
            <DropdownItem onClick={() => setActiveMenu(null)}>
              <span>● Standard</span>
            </DropdownItem>
            <DropdownItem $disabled>
              <span>○ Scientific</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Desplegable Help */}
        {activeMenu === 'help' && (
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                alert('Windows XP Calculator Help:\nUse mouse or keyboard numpad to perform calculations.');
                setActiveMenu(null);
              }}
            >
              <span>Help Topics</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                alert('About Calculator\nMicrosoft Windows XP [Version 5.1.2600]\n(C) 1985-2001 Microsoft Corporation.');
                setActiveMenu(null);
              }}
            >
              <span>About Calculator</span>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuBar>

      {/* 3. Contenido de la Calculadora */}
      <CalcBody>
        {/* Pantalla display */}
        <DisplayScreen>{display}</DisplayScreen>

        {/* Fila superior: Caja M + Backspace, CE, C */}
        <TopControlsRow>
          <MemoryBox title={memory !== 0 ? `Stored: ${memory}` : 'Memory is empty'}>
            {memory !== 0 ? 'M' : ''}
          </MemoryBox>
          <TopButtonsGroup>
            <CalcButton $color="red" onClick={handleBackspace}>
              Backspace
            </CalcButton>
            <CalcButton $color="red" onClick={handleCE}>
              CE
            </CalcButton>
            <CalcButton $color="red" onClick={handleC}>
              C
            </CalcButton>
          </TopButtonsGroup>
        </TopControlsRow>

        {/* Cuadrícula 4x6 idéntica a la imagen adjunta */}
        <KeypadGrid>
          {/* Fila 1 */}
          <CalcButton $color="red" onClick={handleMC} title="Memory Clear">
            MC
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('7')}>
            7
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('8')}>
            8
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('9')}>
            9
          </CalcButton>
          <CalcButton $color="red" onClick={() => handleOperator('/')}>
            /
          </CalcButton>
          <CalcButton $color="blue" onClick={handleSqrt} title="Square root">
            sqrt
          </CalcButton>

          {/* Fila 2 */}
          <CalcButton $color="red" onClick={handleMR} title="Memory Recall">
            MR
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('4')}>
            4
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('5')}>
            5
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('6')}>
            6
          </CalcButton>
          <CalcButton $color="red" onClick={() => handleOperator('*')}>
            *
          </CalcButton>
          <CalcButton $color="blue" onClick={handlePercent} title="Percent">
            %
          </CalcButton>

          {/* Fila 3 */}
          <CalcButton $color="red" onClick={handleMS} title="Memory Store">
            MS
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('1')}>
            1
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('2')}>
            2
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('3')}>
            3
          </CalcButton>
          <CalcButton $color="red" onClick={() => handleOperator('-')}>
            -
          </CalcButton>
          <CalcButton $color="blue" onClick={handleReciprocal} title="Reciprocal">
            1/x
          </CalcButton>

          {/* Fila 4 */}
          <CalcButton $color="red" onClick={handleMPlus} title="Memory Add">
            M+
          </CalcButton>
          <CalcButton $color="blue" onClick={() => handleDigit('0')}>
            0
          </CalcButton>
          <CalcButton $color="blue" onClick={handleNegate} title="Plus / Minus">
            +/-
          </CalcButton>
          <CalcButton $color="blue" onClick={handleDecimal}>
            .
          </CalcButton>
          <CalcButton $color="red" onClick={() => handleOperator('+')}>
            +
          </CalcButton>
          <CalcButton $color="red" onClick={handleEquals}>
            =
          </CalcButton>
        </KeypadGrid>
      </CalcBody>
    </WindowContainer>
  );
};

export default CalculatorWindow;
