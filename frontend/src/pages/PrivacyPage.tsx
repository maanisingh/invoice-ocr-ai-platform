import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
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
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-8">Last updated: November 18, 2024</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Account information (name, email, password)</li>
              <li>Invoice data and documents you upload</li>
              <li>Payment and billing information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your invoices with our AI OCR technology</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Bank-level encryption for data in transit and at rest</li>
              <li>SOC 2 compliant infrastructure</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide you services.
              You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@invoiceocr.ai" className="text-purple-400 hover:text-purple-300">
                privacy@invoiceocr.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
