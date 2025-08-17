import { useState } from "react";
import Onramp from "./Onramp";

export default function BuyUSDC() {
  const [showDirectInterface, setShowDirectInterface] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Buy USDC with Fonbnk</h2>
          <p className="text-gray-600">
            Convert airtime, mobile money, or fiat to USDC on the Base network using our secure server integration
          </p>
        </div>
        
        {/* Main Onramp Interface */}
        <div className="mb-6">
          <Onramp />
        </div>
        
        {/* Alternative Options */}
        <div className="border-t pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Alternative Purchase Methods</h3>
            <p className="text-gray-600 mb-4">
              If you prefer other onramp solutions, here are some alternatives
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowDirectInterface(!showDirectInterface)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showDirectInterface ? 'Hide' : 'Show'} Direct Options
              </button>
              <a
                href="https://app.fonbnk.com/onramp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Fonbnk App
              </a>
            </div>
          </div>
        </div>
        
        {/* Direct Interface Options */}
        {showDirectInterface && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Direct Integration Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-white rounded border">
                <h5 className="font-medium text-gray-700 mb-2">1. Direct API Integration</h5>
                <p className="text-gray-600 mb-2">Make direct API calls to Fonbnk from your frontend</p>
                <code className="text-xs bg-gray-100 p-1 rounded block">
                  POST https://api.fonbnk.io/transactions/initiate
                </code>
              </div>
              <div className="p-3 bg-white rounded border">
                <h5 className="font-medium text-gray-700 mb-2">2. Widget Integration</h5>
                <p className="text-gray-600 mb-2">Embed Fonbnk widget directly in your app</p>
                <code className="text-xs bg-gray-100 p-1 rounded block">
                  &lt;div id="fonbnk-widget"&gt;&lt;/div&gt;
                </code>
              </div>
              <div className="p-3 bg-white rounded border">
                <h5 className="font-medium text-gray-700 mb-2">3. Redirect Integration</h5>
                <p className="text-gray-600 mb-2">Redirect users to Fonbnk app with parameters</p>
                <code className="text-xs bg-gray-100 p-1 rounded block">
                  https://app.fonbnk.com/onramp?crypto=USDC&network=base
                </code>
              </div>
              <div className="p-3 bg-white rounded border">
                <h5 className="font-medium text-gray-700 mb-2">4. Server Integration</h5>
                <p className="text-gray-600 mb-2">✅ Currently using - Most secure approach</p>
                <code className="text-xs bg-gray-100 p-1 rounded block">
                  POST /api/fonbnk/onramp
                </code>
              </div>
            </div>
          </div>
        )}
        
        {/* Information */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Enter your phone number and the amount you want to convert</li>
            <li>• Our secure server creates a Fonbnk onramp session</li>
            <li>• Complete the payment through the provided flow</li>
            <li>• USDC will be sent directly to your connected wallet</li>
            <li>• Real-time status updates via secure webhooks</li>
          </ul>
        </div>

        {/* Security Features */}
        <div className="mt-4 bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Security Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• API keys stored securely on server (never exposed to frontend)</li>
            <li>• Webhook signature verification for transaction updates</li>
            <li>• Input validation and sanitization</li>
            <li>• Rate limiting and error handling</li>
            <li>• Secure database storage of transaction data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
