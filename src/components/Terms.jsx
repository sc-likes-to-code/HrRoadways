import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f172a] text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Terms & Conditions
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
            Welcome to <span className="font-medium">HR Roadways</span>. These
            Terms and Conditions govern your use of our website, services, and
            any related platforms operated by HR Roadways. By accessing or using
            our services, you agree to be bound by these terms. If you do not
            agree with any part of these terms, please do not use our services.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Eligibility
          </h2>
          <p>
            By using this website, you confirm that you are at least 18 years of
            age or accessing the platform under the supervision of a legal
            guardian. You also confirm that the information you provide is
            accurate and complete.
          </p>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Services Provided
          </h2>
          <p>
            HR Roadways provides information and digital services related to
            transport operations, roadways management, and associated public
            services. We reserve the right to modify, suspend, or discontinue
            any part of the service at any time without prior notice.
          </p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. User Responsibilities
          </h2>
          <p>
            You agree to use the website only for lawful purposes. You must not:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Upload or transmit malicious software or harmful code</li>
            <li>Misuse, copy, or distribute website content without permission</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Intellectual Property Rights
          </h2>
          <p>
            All content on this website, including text, graphics, logos,
            designs, and software, is the property of HR Roadways or its
            licensors and is protected by applicable intellectual property
            laws. Unauthorized use of any content is strictly prohibited.
          </p>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Third-Party Links
          </h2>
          <p>
            Our website may contain links to third-party websites or services.
            HR Roadways is not responsible for the content, accuracy, or
            practices of any third-party websites. Accessing such links is at
            your own risk.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Limitation of Liability
          </h2>
          <p>
            HR Roadways shall not be liable for any direct, indirect, incidental,
            consequential, or special damages arising out of your use or
            inability to use the website or services, even if we have been
            advised of the possibility of such damages.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Disclaimer
          </h2>
          <p>
            The website and services are provided on an “as is” and “as
            available” basis. We make no warranties, express or implied,
            regarding the accuracy, reliability, or availability of the
            services.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            9. Termination
          </h2>
          <p>
            We reserve the right to terminate or restrict access to our services
            at any time, without notice, if we believe you have violated these
            Terms and Conditions.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            10. Changes to These Terms
          </h2>
          <p>
            HR Roadways may update these Terms and Conditions from time to time.
            Any changes will be effective immediately upon posting. Continued
            use of the website after changes constitutes acceptance of the
            revised terms.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            11. Governing Law
          </h2>
          <p>
            These Terms and Conditions shall be governed by and interpreted in
            accordance with the laws of India. Any disputes arising under these
            terms shall be subject to the exclusive jurisdiction of Indian
            courts.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            12. Contact Us
          </h2>
          <p>
            If you have any questions or concerns regarding these Terms and
            Conditions, please contact us through the official HR Roadways
            communication channels.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsAndConditions;
