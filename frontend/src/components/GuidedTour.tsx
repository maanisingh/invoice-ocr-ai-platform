import React, { useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import Confetti from 'react-confetti';

interface GuidedTourProps {
  runTour?: boolean;
  onFinish?: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ runTour = false, onFinish }) => {
  const [run, setRun] = useState(runTour);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps: Step[] = [
    {
      target: '.demo-mode-toggle',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Welcome to Invoice OCR Platform!</h3>
          <p>
            Toggle <strong>Demo Mode</strong> to explore the platform with 150+ sample invoices.
            This is perfect for testing and demonstrations!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.theme-toggle',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Theme Toggle</h3>
          <p>
            Switch between <strong>Light</strong> and <strong>Dark</strong> modes for your
            preferred viewing experience.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.dashboard-metrics',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Real-time Metrics</h3>
          <p>
            View key performance indicators including revenue, invoice counts, and payment status.
            All metrics are <strong>animated</strong> and update in real-time!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.revenue-chart',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Interactive Charts</h3>
          <p>
            Analyze trends with beautiful, interactive charts. Hover over data points for detailed
            information. Charts support <strong>zoom, pan, and filtering</strong>!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.invoice-list',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Advanced Invoice Management</h3>
          <p>
            Browse, search, and filter invoices with powerful tools. Features include:
          </p>
          <ul className="list-disc ml-4 mt-2">
            <li>Real-time search</li>
            <li>Multi-field filtering</li>
            <li>AI confidence scores</li>
            <li>Bulk operations</li>
          </ul>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.mobile-capture',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Mobile Invoice Capture</h3>
          <p>
            Use your device camera or upload files to instantly extract invoice data using
            <strong> AI-powered OCR technology</strong>. Processing takes just seconds!
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '.ai-confidence',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">AI Confidence Scores</h3>
          <p>
            Every extracted field has an <strong>AI confidence score</strong> showing accuracy.
            High scores mean no manual review needed!
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '.duplicate-detection',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Duplicate Detection</h3>
          <p>
            Our AI automatically detects potential duplicate invoices to prevent double payments.
            Review and merge duplicates with one click!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 Tour Complete!</h2>
          <p className="text-lg mb-4">
            You're all set to explore the Invoice OCR Platform!
          </p>
          <p>
            Start by toggling <strong>Demo Mode</strong> to see sample data, or upload your first
            invoice to begin.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        onFinish?.();
      }, 5000);
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Handle step changes if needed
    }
  };

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#8b5cf6',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: '12px',
            padding: '20px',
          },
          buttonNext: {
            backgroundColor: '#8b5cf6',
            borderRadius: '8px',
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#8b5cf6',
          },
        }}
        locale={{
          last: 'Finish',
          skip: 'Skip Tour',
          next: 'Next',
          back: 'Back',
        }}
      />

      {!run && (
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={() => setRun(true)}
          className="fixed bottom-6 right-6 z-50 shadow-lg"
          size="large"
        >
          Start Tour
        </Button>
      )}
    </>
  );
};

export default GuidedTour;
