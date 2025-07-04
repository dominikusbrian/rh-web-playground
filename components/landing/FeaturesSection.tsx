'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { colors } from '@/app/styles/colors';
import { useAuthenticatedAction } from '@/contexts/AuthModalContext';

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  primaryAction: {
    text: string;
    description: string;
  };
  secondaryAction?: {
    text: string;
    description: string;
  };
  iconName: string;
  gradient: string;
}

const features: Feature[] = [
  {
    id: 'fund',
    title: 'Fund',
    subtitle: 'Accelerate scientific discovery',
    description:
      'Connect researchers with funding opportunities and enable philanthropists to directly support groundbreaking experiments.',
    benefits: [
      'Transparent funding allocation',
      'Direct impact tracking',
      'Tax-deductible donations',
      'Real-time progress updates',
    ],
    primaryAction: {
      text: 'Give research funding',
      description: 'Support research as a donor or philanthropist',
    },
    secondaryAction: {
      text: 'Request funding',
      description: 'Get crowdfunding for your experiments',
    },
    iconName: 'fund',
    gradient: 'from-[#3971FF] to-[#4A7FFF]',
  },
  {
    id: 'earn',
    title: 'Earn',
    subtitle: 'Get paid for peer review',
    description:
      'Earn meaningful compensation for your valuable peer review contributions to open access scientific literature.',
    benefits: [
      'Earn $150 in RSC per review',
      'Choose preprints to review',
      'Get feedback from editors',
      'Build your reputation',
    ],
    primaryAction: {
      text: 'Start reviewing',
      description: 'Begin earning through peer review',
    },
    iconName: 'earn1',
    gradient: 'from-[#3971FF] to-[#4A7FFF]',
  },
  {
    id: 'publish',
    title: 'Publish',
    subtitle: 'Champion open science',
    description:
      'Publish in the ResearchHub Journal with transparent peer review, low fees, and a commitment to open access.',
    benefits: [
      'Only $300 APC fee',
      'Open peer review process',
      'Immediate preprint option',
      'Reviewers paid $150 in RSC',
    ],
    primaryAction: {
      text: 'Submit paper',
      description: 'Publish your research with open access',
    },
    iconName: 'rhJournal2',
    gradient: 'from-[#3971FF] to-[#4A7FFF]',
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();
  const { executeAuthenticatedAction } = useAuthenticatedAction();

  const handleGiveResearchFunding = () => {
    router.push('/fund/grants');
  };

  const handleRequestFunding = () => {
    router.push('/fund/needs-funding');
  };

  const handleStartReviewing = () => {
    router.push('/earn');
  };

  const handleSubmitPaper = () => {
    router.push('/paper/create/pdf');
  };

  const getClickHandler = (featureId: string, isPrimary: boolean) => {
    if (featureId === 'fund') {
      return isPrimary ? handleGiveResearchFunding : handleRequestFunding;
    }
    if (featureId === 'earn') {
      return handleStartReviewing;
    }
    if (featureId === 'publish') {
      return handleSubmitPaper;
    }
    return () => {};
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50/50 via-slate-50/20 to-slate-100/40 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#3971FF]/5 to-transparent transform -skew-y-1"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM0E3MVBGIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-16 h-16 bg-[#3971FF]/40 rounded-full animate-pulse-slow blur-sm"></div>
        <div
          className="absolute bottom-20 left-20 w-12 h-12 bg-blue-300/35 rounded-full animate-pulse-slow blur-sm"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-8 h-8 bg-purple-200/50 rounded-full animate-pulse-slow blur-sm"
          style={{ animationDelay: '2.5s' }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'Cal Sans, sans-serif' }}
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-[#3971FF] via-[#4A7FFF] to-[#5B8DFF] bg-clip-text text-transparent">
              advance science
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Fund groundbreaking research, earn through peer review, and publish with transparency.
            The complete ecosystem for modern scientific collaboration.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-gray-100 rounded-full overflow-x-auto">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-base whitespace-nowrap flex-shrink-0 ${
                  activeFeature === index
                    ? 'bg-gradient-to-r from-[#3971FF] to-[#4A7FFF] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Feature Display */}
        <div className="flex justify-center">
          <SpotlightCard
            className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-2 border-white/20 shadow-xl"
            spotlightColor="rgba(79, 70, 229, 0.15)"
          >
            <div className="text-center space-y-8">
              {/* Header with Icon */}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeFeature].gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon name={features[activeFeature].iconName as any} size={32} color="white" />
                </div>

                <div>
                  <h3
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Cal Sans, sans-serif' }}
                  >
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-xl text-gray-600">{features[activeFeature].subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto px-2 md:px-4">
                {features[activeFeature].description}
              </p>

              {/* Benefits Grid */}
              <div className="flex flex-wrap gap-4 max-w-xl mx-auto px-2 md:px-4 justify-center">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-left w-64 flex-shrink-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${features[activeFeature].gradient} flex-shrink-0`}
                    />
                    <span className="text-gray-700 text-base">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={features[activeFeature].secondaryAction ? 'space-y-4' : 'space-y-4'}>
                {features[activeFeature].secondaryAction ? (
                  // Side by side layout for Fund feature (has both buttons)
                  <div className="flex flex-wrap gap-4 justify-center items-start max-w-2xl mx-auto">
                    <div className="flex-1 min-w-64 max-w-80 text-center">
                      <Button
                        size="lg"
                        onClick={() => getClickHandler(features[activeFeature].id, true)()}
                        className={`w-full bg-gradient-to-r ${features[activeFeature].gradient} text-white hover:shadow-lg`}
                      >
                        {features[activeFeature].primaryAction.text}
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        {features[activeFeature].primaryAction.description}
                      </p>
                    </div>
                    <div className="flex-1 min-w-64 max-w-80 text-center">
                      <Button
                        variant="outlined"
                        size="lg"
                        onClick={() => getClickHandler(features[activeFeature].id, false)()}
                        className="w-full"
                      >
                        {features[activeFeature].secondaryAction.text}
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        {features[activeFeature].secondaryAction.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Single button layout for other features
                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => getClickHandler(features[activeFeature].id, true)()}
                      className={`bg-gradient-to-r ${features[activeFeature].gradient} text-white hover:shadow-lg`}
                    >
                      {features[activeFeature].primaryAction.text}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {features[activeFeature].primaryAction.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
