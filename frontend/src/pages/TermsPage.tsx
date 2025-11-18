import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Invoice OCR AI
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-8">Last updated: November 18, 2024</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Invoice OCR AI platform, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use Invoice OCR AI for personal or commercial invoice
              processing. This is the grant of a license, not a transfer of title, and under this license
              you may not:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose without a paid subscription</li>
              <li>Attempt to reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Service Description</h2>
            <p>
              Invoice OCR AI provides AI-powered optical character recognition services to extract data
              from invoice documents. We strive for 99.5% accuracy but do not guarantee 100% accuracy.
              Users are responsible for verifying extracted data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Provide accurate account information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Not upload malicious or illegal content</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Payments and Refunds</h2>
            <p>
              Subscription fees are billed in advance on a monthly or annual basis. Refunds are provided
              within 30 days of initial purchase if you are not satisfied with the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              Invoice OCR AI shall not be liable for any damages that may occur from the use or inability
              to use our service, including but not limited to reliance on any information obtained from
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior
              notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material
              changes via email or through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@invoiceocr.ai" className="text-purple-400 hover:text-purple-300">
                legal@invoiceocr.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
