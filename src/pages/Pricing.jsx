import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Users, BarChart3, Clock, Shield, Globe, Zap as ZapIcon } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 9 : 90,
      description: 'Perfect for individual creators getting started',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 50 scheduled casts per month',
        'Basic analytics dashboard',
        'Email support',
        'Standard templates',
        'Mobile app access',
        'Basic queue management'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 29 : 290,
      description: 'For serious content creators and small teams',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Up to 500 scheduled casts per month',
        'Advanced analytics & insights',
        'Priority email support',
        'Custom templates & branding',
        'Team collaboration (up to 3 members)',
        'Bulk upload & CSV import',
        'Advanced queue management',
        'API access',
        'White-label options'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99 : 990,
      description: 'For large teams and agencies',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      features: [
        'Unlimited scheduled casts',
        'Enterprise analytics & reporting',
        '24/7 phone & email support',
        'Custom integrations',
        'Unlimited team members',
        'Advanced automation',
        'Custom workflows',
        'Dedicated account manager',
        'SLA guarantees',
        'On-premise deployment options'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const addons = [
    {
      name: 'Analytics Pro',
      price: billingCycle === 'monthly' ? 19 : 190,
      description: 'Advanced analytics and insights',
      features: ['Custom reports', 'Competitor analysis', 'ROI tracking', 'A/B testing']
    },
    {
      name: 'Team Management',
      price: billingCycle === 'monthly' ? 15 : 150,
      description: 'Enhanced team collaboration features',
      features: ['Role-based permissions', 'Approval workflows', 'Team performance metrics']
    },
    {
      name: 'API Access',
      price: billingCycle === 'monthly' ? 25 : 250,
      description: 'Full API access for custom integrations',
      features: ['REST API', 'Webhooks', 'SDK access', 'Custom integrations']
    }
  ];

  const revenueStreams = [
    {
      title: 'Subscription Revenue',
      description: 'Monthly/annual recurring revenue from tiered plans',
      amount: '$50K - $200K+ annually',
      icon: Users
    },
    {
      title: 'Enterprise Sales',
      description: 'Custom enterprise solutions and consulting',
      amount: '$100K - $500K+ per enterprise',
      icon: Crown
    },
    {
      title: 'Add-on Services',
      description: 'Premium features and integrations',
      amount: '$20K - $100K annually',
      icon: ZapIcon
    },
    {
      title: 'White-label Solutions',
      description: 'Licensing platform to other companies',
      amount: '$25K - $100K per license',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="glass-card text-center">
        <div className="card-header">
          <h1 className="card-title">Choose Your Plan</h1>
          <p className="card-subtitle">Scale your Farcaster presence with our flexible pricing options</p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Yearly
            <span className="ml-1 text-green-400 text-xs">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`glass-card relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}>
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add-ons */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Premium Add-ons</h2>
          <p className="card-subtitle">Enhance your experience with additional features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addons.map((addon, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{addon.description}</p>
              <div className="text-2xl font-bold text-white mb-4">
                ${addon.price}/{billingCycle === 'monthly' ? 'month' : 'year'}
              </div>
              <ul className="space-y-2 mb-4">
                {addon.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full">Add to Plan</button>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Model */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">💰 Revenue Model</h2>
          <p className="card-subtitle">How we generate sustainable revenue while providing value</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {revenueStreams.map((stream, index) => {
            const Icon = stream.icon;
            return (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{stream.title}</h3>
                    <p className="text-sm text-gray-400">{stream.amount}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{stream.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Frequently Asked Questions</h2>
          <p className="card-subtitle">Everything you need to know about our pricing</p>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-300 text-sm">Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.</p>
          </div>
          
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
            <p className="text-gray-300 text-sm">Absolutely! All plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-300 text-sm">We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum.</p>
          </div>
          
          <div className="pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h3>
            <p className="text-gray-300 text-sm">Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Scale Your Farcaster Presence?</h2>
        <p className="text-gray-300 text-lg mb-8">Join thousands of creators who trust Cast Scheduler Pro</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-8 py-4">Start Free Trial</button>
          <button className="btn-secondary text-lg px-8 py-4">Schedule Demo</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
