'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getFlagOptions } from '@/constants/flags';
import { FlagReasonKey } from '@/types/work';
import { FlagRadioGroup } from '@/components/ui/form/FlagRadioGroup';
import { toast } from 'react-hot-toast';
import { useFlag } from '@/hooks/useFlagging';
import { ContentType } from '@/types/work';

interface FlagContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  workType: ContentType;
  commentId?: string;
}

const flagOptions = getFlagOptions();

export function FlagContentModal({
  isOpen,
  onClose,
  documentId,
  workType,
  commentId,
}: FlagContentModalProps) {
  const [selectedReason, setSelectedReason] = useState<FlagReasonKey | null>(null);
  const [{ isLoading }, flag] = useFlag();

  const handleSubmit = async () => {
    if (!selectedReason) return;

    try {
      await flag({
        documentType: workType === 'paper' ? 'paper' : 'researchhubpost',
        documentId,
        reason: selectedReason,
        commentId: commentId ? Number(commentId) : undefined,
      });
      toast.success('Content reported successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to report content');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black !bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="p-6">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 mb-3">
                    Reporting content
                  </DialogTitle>
                  <p className="text-xs text-gray-600 mb-3">
                    I am reporting this content because of:
                  </p>

                  <FlagRadioGroup
                    options={flagOptions}
                    value={selectedReason || ''}
                    onChange={(value) => setSelectedReason(value as FlagReasonKey)}
                    className="space-y-1.5"
                  />

                  <div className="mt-5 flex justify-end gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!selectedReason || isLoading}
                    >
                      {isLoading ? 'Reporting...' : 'Report'}
                    </Button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
