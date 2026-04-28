import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f172a] text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Privacy Policy
          </h1>
          <p className="mt-2 text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10 text-gray-700">

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Introduction
          </h2>
          <p>
            HR Roadways is committed to protecting your privacy and ensuring the
            security of your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit or interact with our website and services.
          </p>
          <p className="mt-3">
            By accessing or using our platform, you agree to the collection and
            use of information in accordance with this policy.
          </p>
        </section>

        {/* Information Collected */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Information We Collect
          </h2>
          <p>
            We may collect different types of information depending on how you
            interact with our website:
          </p>

          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>
              <span className="font-medium">Personal Information:</span> Name,
              email address, phone number, or other details voluntarily
              provided by you.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> Pages visited,
              time spent on pages, browser type, IP address, and device
              information.
            </li>
            <li>
              <span className="font-medium">Communication Data:</span> Any
              information you provide while contacting us or submitting forms.
            </li>
          </ul>
        </section>

        {/* How Information Is Used */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. How We Use Your Information
          </h2>
          <p>
            The information we collect is used for the following purposes:
          </p>

          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>To provide and maintain our services</li>
            <li>To improve website performance and user experience</li>
            <li>To respond to inquiries, feedback, or support requests</li>
            <li>To monitor usage trends and prevent misuse</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Cookies and Tracking Technologies
          </h2>
          <p>
            We may use cookies and similar tracking technologies to enhance your
            browsing experience. Cookies help us understand user behavior,
            remember preferences, and improve site functionality.
          </p>
          <p className="mt-3">
            You can choose to disable cookies through your browser settings;
            however, doing so may affect certain features of the website.
          </p>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Sharing of Information
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. However, we may share information in the following cases:
          </p>

          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>With service providers assisting in website operations</li>
            <li>When required by law or government authorities</li>
            <li>To protect the rights, safety, and integrity of HR Roadways</li>
          </ul>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Data Security
          </h2>
          <p>
            We implement reasonable administrative, technical, and
            organizational measures to protect your personal information from
            unauthorized access, loss, misuse, or disclosure.
          </p>
          <p className="mt-3">
            While we strive to protect your data, no method of transmission over
            the internet is completely secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Data Retention
          </h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy or to comply
            with legal obligations.
          </p>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Your Rights
          </h2>
          <p>
            Depending on applicable laws, you may have the right to:
          </p>

          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal information</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            9. Third-Party Links
          </h2>
          <p>
            Our website may contain links to external websites. We are not
            responsible for the privacy practices or content of third-party
            websites. We encourage users to review the privacy policies of those
            sites.
          </p>
        </section>

        {/* Policy Updates */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with an updated revision date. Continued use
            of the website after changes indicates acceptance of the updated
            policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            11. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us through the official HR Roadways
            communication channels.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
