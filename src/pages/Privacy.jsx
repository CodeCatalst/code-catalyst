import React from 'react';

const Privacy = () => (
  <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen overflow-hidden">
    {/* Decorative Blobs */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-60 animate-pulse -z-10" style={{ filter: 'blur(80px)' }} />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl opacity-60 animate-pulse -z-10" style={{ filter: 'blur(80px)' }} />
    <div className="container-max pt-32 pb-16 px-4 min-h-screen text-white relative z-10">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">Privacy Policy</h1>
        <p className="mb-2 text-lg text-gray-300">Last updated: July 3, 2025</p>
        <p className="mb-4 text-xl text-gray-200 max-w-2xl mx-auto">
          Code Catalyst is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>
      </div>
      <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl shadow-xl p-8 md:p-12 backdrop-blur-md border border-white/10">
        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>1. Information We Collect</h2>
        <ul className="list-disc ml-8 mb-4 text-gray-200 space-y-2">
          <li><span className="font-semibold text-blue-300">Personal Information:</span> Name, email address, and other information you provide when registering or contacting us.</li>
          <li><span className="font-semibold text-blue-300">Usage Data:</span> Information about how you use our website, such as pages visited, time spent, and browser/device information.</li>
          <li><span className="font-semibold text-blue-300">Cookies:</span> We use cookies to enhance your experience and analyze site usage.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>2. How We Use Your Information</h2>
        <ul className="list-disc ml-8 mb-4 text-gray-200 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To communicate with you about updates, events, and opportunities</li>
          <li>To improve our website and services</li>
          <li>To ensure security and prevent fraud</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>3. Information Sharing</h2>
        <ul className="list-disc ml-8 mb-4 text-gray-200 space-y-2">
          <li>We do not sell or rent your personal information.</li>
          <li>We may share information with trusted partners who assist us in operating our website and providing services, subject to confidentiality agreements.</li>
          <li>We may disclose information if required by law or to protect our rights and safety.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>4. Data Security</h2>
        <p className="mb-4 text-gray-200">We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>5. Your Rights</h2>
        <ul className="list-disc ml-8 mb-4 text-gray-200 space-y-2">
          <li>You may access, update, or delete your personal information by contacting us.</li>
          <li>You may opt out of receiving communications from us at any time.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-2 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>6. Third-Party Links</h2>
        <p className="mb-4 text-gray-200">Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.</p>
        <h2 className="text-2xl font-bold mt-8 mb-2 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>7. Changes to This Policy</h2>
        <p className="mb-4 text-gray-200">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        <h2 className="text-2xl font-bold mt-8 mb-2 text-purple-300 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>8. Contact Us</h2>
        <p className="text-gray-200">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:codecatalyst@gmail.com" className="text-blue-400 underline">codecatalyst@gmail.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
