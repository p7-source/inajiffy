import React from 'react';
import { Button } from '../shared/Button';

interface ActionButtonsProps {
  onSkip: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSkip,
  onSave,
  isSaving = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="secondary"
        fullWidth
        onClick={onSkip}
        disabled={isSaving}
      >
        Skip
      </Button>
      <Button
        variant="primary"
        fullWidth
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Meal'}
      </Button>
    </div>
  );
};

