'use client';

import { Work } from '@/types/work';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface GrantStatusSectionProps {
  work: Work;
}

export const GrantStatusSection = ({ work }: GrantStatusSectionProps) => {
  const isOpen = work.note?.post?.grant?.status === 'OPEN';

  if (!work.note?.post?.grant?.endDate) {
    return (
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Status</h3>
        <div className="flex items-center gap-2 text-gray-800 text-sm">
          <span className="h-2 w-2 rounded-full bg-gray-400 inline-block" />
          <span>Unknown</span>
        </div>
      </div>
    );
  }

  const endDate = new Date(work.note?.post?.grant?.endDate);

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">Status</h3>
      <div className="flex items-center gap-2 text-gray-800 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'} inline-block`}
        />
        <span>{isOpen ? 'Accepting Applications' : 'Closed'}</span>
      </div>
      {isOpen && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <Clock size={14} className="text-gray-500" />
          <span>Closes {format(endDate, 'MMMM d, yyyy')}</span>
        </div>
      )}
      {!isOpen && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <Clock size={14} className="text-gray-500" />
          <span>Closed on {format(endDate, 'MMMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};
