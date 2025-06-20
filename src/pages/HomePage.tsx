import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Brain, FileText, ArrowRight } from 'lucide-react';





const HomePage: React.FC = () => {
    const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
    
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/.netlify/functions/getStats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Smart Contract Security',
      description: 'Funds are secured in escrow until work is completed and verified'
    },
    {
      icon: Brain,
      title: 'AI Work Verification',
      description: 'Advanced AI reviews submissions to ensure quality standards'
    },
    {
      icon: FileText,
      title: 'IPFS Metadata Storage',
      description: 'Job requirements stored permanently on decentralized storage'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Automated fund release upon successful work completion'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Create Job Terms',
      description: 'Define requirements and upload metadata to IPFS for permanent storage'
    },
    {
      number: 2,
      title: 'Deploy Contract',
      description: 'Smart contract is created with metadata URI and NFTs minted for both parties'
    },
    {
      number: 3,
      title: 'Fund Escrow',
      description: 'Client funds the job amount into the smart contract escrow'
    },
    {
      number: 4,
      title: 'Work Reviewed by AI',
      description: 'Freelancer completes work and submits for review'
    },
    {
      number: 5,
      title: 'Work Uploaded and Delivered',
      description: 'Freelancer completes work uploads via Dropbox for delivery'
    },
   
    {
      number:6,
      title: 'AI or Client Verification & Freelancer Gets Paid',
      description: 'if AI passed, funds released automatically. If AI fails, client reviews and approves manually and funds released'
    }
  ];

  /*const stats = [
    { label: 'Jobs Completed', value: '2,500+', icon: CheckCircle },
    { label: 'Active Users', value: '1,200+', icon: Users },
    { label: 'Total Value Secured', value: '$850K+', icon: DollarSign },
    { label: 'Success Rate', value: '98.5%', icon: Star }
  ];*/

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-slate-800 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Secure Work
              </span>
              <br />
              <span className="text-gray-900">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first AI-powered job escrow platform using smart contracts to secure payments 
              and verify work quality automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/client-dashboard"
                className="group bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Create a Job Post</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/freelancer-dashboard"
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Find Work</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    

       {/* Stats Section */}
<section className="relative bg-slate-200 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {(stats && stats.length > 0 ? stats : [
        { label: 'Jobs Completed', value: '0', icon: '✔️' },
        { label: 'Active Users', value: '0', icon: '👥' },
        { label: 'Total Value Secured', value: '$0', icon: '💰' },
        { label: 'Success Rate', value: '0%', icon: '⭐' }
      ]).map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl mb-2">{'icon' in stat ? stat.icon : ''}</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Stats Section */}
{stats.length > 0 && (
  <section className="relative bg-slate-200 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureWork?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines blockchain security with AI intelligence to create 
              the most trustworthy freelance experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures secure, efficient job completion 
              from start to finish.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-200 to-emerald-200"></div>

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 lg:w-1/2">
                    <div className={`bg-white p-8 rounded-2xl shadow-lg ${
                      index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                    }`}>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center w-16 h-16 my-8 lg:my-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  <div className="flex-1 lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Next Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust SecureWork 
            for their most important projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/client-dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Post a Job
            </Link>
            <Link
              to="/freelancer-dashboard"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;