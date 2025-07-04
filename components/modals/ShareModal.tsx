'use client';

import { Fragment, useRef, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Confetti from 'react-confetti';
import { PartyPopper, Copy, Share2 } from 'lucide-react';
import SocialShareButtons from '@/components/SocialShareButtons';
import AnalyticsService, { LogEvent } from '@/services/analytics.service';

export type ShareAction =
  | 'USER_OPENED_PROPOSAL'
  | 'USER_PEER_REVIEWED'
  | 'USER_FUNDED_PROPOSAL'
  | 'USER_SHARED_DOCUMENT';

interface ShareConfig {
  title: (docTitle: string, url: string) => React.ReactNode;
  description: (docTitle: string) => React.ReactNode;
  socialText: (docTitle: string) => string;
  IconComponent: React.ElementType;
}

export const SHARE_CONFIGS: Record<ShareAction, ShareConfig> = {
  USER_OPENED_PROPOSAL: {
    IconComponent: PartyPopper,
    title: (docTitle, url) => <>Congratulations on opening a proposal</>,
    description: (docTitle) => (
      <>
        Share a link to your proposal on social media to get more eyes on your work, including
        potential funders.
      </>
    ),
    socialText: (docTitle) => `New experiment proposal: ${docTitle}\n\n`,
  },
  USER_PEER_REVIEWED: {
    IconComponent: PartyPopper,
    title: (docTitle, url) => <>Thank you for your review</>,
    description: (docTitle) => (
      <>
        Thank you for reviewing{' '}
        <span className="font-semibold text-blue-600" title={docTitle}>
          {docTitle}
        </span>
        .{` `}Share your review with others.
      </>
    ),
    socialText: (docTitle) => `I just peer reviewed: ${docTitle} on ResearchHub!`,
  },
  USER_FUNDED_PROPOSAL: {
    IconComponent: PartyPopper,
    title: (docTitle, url) => <>You're a Research Champion!</>,
    description: (docTitle) => (
      <>
        Thank you for funding{' '}
        <span className="font-semibold text-blue-600" title={docTitle}>
          {docTitle}
        </span>
        .{` `}Your support is vital. Help us spread the word.
      </>
    ),
    socialText: (docTitle) => `I just funded: ${docTitle} on ResearchHub!`,
  },
  USER_SHARED_DOCUMENT: {
    IconComponent: Share2,
    title: (docTitle, url) => {
      const getShareType = (url: string): string => {
        if (url.includes('/post/')) return 'Preprint';
        if (url.includes('/paper/')) return 'Paper';
        if (url.includes('/fund/')) return 'Proposal';
        if (url.includes('/grant/')) return 'RFP';
        return '';
      };
      const type = getShareType(url);
      return <>Share {type}</>;
    },
    description: (docTitle: string) => (
      <>
        Help others discover{' '}
        <span className="font-semibold text-primary-600" title={docTitle}>
          {docTitle}
        </span>{' '}
        by sharing it on social media.
      </>
    ),
    socialText: (docTitle: string) => `${docTitle}`,
  },
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  docTitle: string;
  url: string;
  action: ShareAction;
  shouldShowConfetti?: boolean;
}

export default function ShareModal({
  isOpen,
  onClose,
  docTitle,
  url,
  action,
  shouldShowConfetti = true,
}: ShareModalProps) {
  const config = SHARE_CONFIGS[action];
  const [displayData, setDisplayData] = useState<{
    title: React.ReactNode;
    description: React.ReactNode;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayData({
        title: config.title(docTitle, url),
        description: config.description(docTitle),
      });

      AnalyticsService.logEvent(LogEvent.SHARE_MODAL_OPENED, {
        action,
        docTitle,
        url,
      });
      setShowConfetti(shouldShowConfetti);
      const timeout = setTimeout(() => {
        if (modalRef.current) {
          const width = modalRef.current.offsetWidth;
          const height = modalRef.current.offsetHeight;
          setModalDimensions({ width, height });
        }
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, action, docTitle, url, shouldShowConfetti, config]);

  const handleCopy = () => {
    const urlWithUtm = new URL(url, window.location.origin);
    urlWithUtm.searchParams.set('utm_source', 'copy_url');
    urlWithUtm.searchParams.set('utm_medium', 'social_share');
    const finalUrl = urlWithUtm.toString();

    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    AnalyticsService.logEvent(LogEvent.CLICKED_SHARE_VIA_URL, {
      action,
      docTitle,
      url: finalUrl,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    AnalyticsService.logEvent(LogEvent.SHARE_MODAL_CLOSED, {
      action,
      docTitle,
      url,
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black !bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative overflow-hidden"
              >
                {showConfetti && modalDimensions.width > 0 && (
                  <Confetti
                    width={modalDimensions.width}
                    height={modalDimensions.height}
                    gravity={0.2}
                    recycle={false}
                    numberOfPieces={100}
                    colors={['#f97316', '#3971ff']}
                  />
                )}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-colors duration-200 z-10"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-blue-100">
                    <config.IconComponent size={36} color="#3B82F6" />
                  </div>

                  {displayData && (
                    <>
                      <h2 className="text-2xl font-bold text-gray-800">{displayData.title}</h2>
                      <p className="text-gray-500 mt-2 px-4">{displayData.description}</p>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="share-url"
                      id="share-url"
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 rounded-none rounded-l-md text-sm border border-gray-300 bg-gray-50 p-2"
                      value={url}
                      readOnly
                    />
                    <button
                      onClick={handleCopy}
                      className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 rounded-r-md border border-gray-300 bg-rhBlue-500 text-white text-sm font-medium hover:bg-rhBlue-600 focus:outline-none focus:ring-1 focus:ring-rhBlue-500 focus:border-rhBlue-500"
                    >
                      <Copy size={16} />
                      <span>Copy</span>
                      {copied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 text-center">
                    Or share directly on:
                  </p>
                  <SocialShareButtons action={action} docTitle={docTitle} url={url} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
