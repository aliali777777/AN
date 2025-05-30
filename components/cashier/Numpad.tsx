
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface NumpadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onDelete?: () => void;
  onDot?: () => void;
}

export const Numpad: React.FC<NumpadProps> = ({ 
  onNumberClick, 
  onClear, 
  onDelete,
  onDot
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {/* First row */}
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(1)}
      >
        1
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(3)}
      >
        3
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(3)}
      >
        3
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(6)}
      >
        6
      </Button>

      {/* Second row */}
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(4)}
      >
        4
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(5)}
      >
        5
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(6)}
      >
        6
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={onClear}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Third row */}
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(7)}
      >
        7
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(8)}
      >
        8
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(9)}
      >
        9
      </Button>
      <div className="invisible">
        <Button variant="outline" className="number-pad-button">
          
        </Button>
      </div>

      {/* Fourth row */}
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={() => onNumberClick(0)}
      >
        0
      </Button>
      <Button
        variant="outline"
        className="number-pad-button"
        onClick={onDot}
      >
        .
      </Button>
      <div className="col-span-2">
        {/* Empty space to match the layout */}
      </div>
    </div>
  );
};
