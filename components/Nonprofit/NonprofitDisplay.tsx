'use client';

import { NonprofitOrg } from '@/types/nonprofit';
import { Info, X, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/styles';
import { Input } from '@/components/ui/form/Input';
import { Button } from '@/components/ui/Button';

interface NonprofitDisplayProps {
  nonprofit: NonprofitOrg;
  note: string;
  onNoteChange: (note: string) => void;
  onInfoClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClear: () => void;
  isInfoOpen: boolean;
  readOnly?: boolean;
  allowClear?: boolean;
}

/**
 * Displays a selected nonprofit organization with options to view details or clear the selection
 */
export default function NonprofitDisplay({
  nonprofit,
  note,
  onNoteChange,
  onInfoClick,
  onClear,
  isInfoOpen,
  readOnly = false,
  allowClear = false,
}: NonprofitDisplayProps) {
  return (
    <div className="mt-2 p-2 border border-gray-100 rounded-md bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-medium text-gray-800">{nonprofit.name}</h4>
          <p className="text-xs text-gray-500 flex items-center">
            <span>EIN: {nonprofit.ein.substring(0, 2) + '-' + nonprofit.ein.substring(2)}</span>
            <Button
              type="button"
              onClick={onInfoClick}
              className={cn(
                'ml-1 p-0 h-auto',
                isInfoOpen ? 'text-primary-600 bg-transparent' : 'text-gray-400 hover:text-gray-600'
              )}
              variant="ghost"
              size="icon"
            >
              <Info className="h-3 w-3" />
            </Button>
          </p>
        </div>
        <div className="flex items-center shrink-0">
          {(!readOnly || allowClear) && (
            <Button
              type="button"
              onClick={onClear}
              className="ml-1 text-gray-400 hover:text-gray-600"
              variant="ghost"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Note field - show text in readonly mode, input field in edit mode */}
      {readOnly ? (
        note && (
          <div className="mt-2 text-xs text-gray-700">
            <span className="font-medium">Designated for:</span> {note}
          </div>
        )
      ) : (
        <div className="mt-2">
          <Input
            label="Designated for"
            placeholder="Smith Lab, School of Mechanical Engineering"
            value={note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            className="text-sm"
            helperText="Provide your lab name and university department"
          />
        </div>
      )}
    </div>
  );
}
