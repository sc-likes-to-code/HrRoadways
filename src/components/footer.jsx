// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Bus, MapPin, Clock, Globe, Share, Mail } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import "../styles/footer.css";
// import { socialMediaLinks } from "../utils/translationKeyMap";

// function Footer() {
//   const { t } = useTranslation();
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [email, setEmail] = useState("");
//   const [subscriptionStatus, setSubscriptionStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // 🟩 ADD HERE — Newsletter local state
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);

//   useEffect(() => {
//     const timeInterval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timeInterval);
//   }, []);

//   const handleNewsletterSubmit = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       setSubscriptionStatus(t("newsletter.enterEmail"));
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setSubscriptionStatus(t("newsletter.invalidEmail"));
//       return;
//     }

//     setIsLoading(true);
//     setSubscriptionStatus("");

//     try {
//       const API_BASE_URL = 'http://localhost:8000';
//       const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSubscriptionStatus(t("newsletter.success"));
//         setEmail("");
//       } else {
//         setSubscriptionStatus(data.message || t("newsletter.error"));
//       }
//     } catch (error) {
//       console.error('Newsletter subscription error:', error);
//       setSubscriptionStatus(t("newsletter.error"));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <footer className="footer w-full">
//       <div className="footer-bg-overlay" />
//       <div className="footer-time">
//         <div className="footer-time-content">
//           <Globe className="footer-time-icon" />
//           <span>{currentTime.toLocaleTimeString()}</span>
//         </div>
//         <div className="footer-date-content">
//           <Clock className="footer-date-icon" />
//           <span>{currentTime.toLocaleDateString()}</span>
//         </div>
//       </div>

//       <div className="footer-container">
//         <div className="footer-header">
//           <div className="footer-logo">
//             <Bus className="footer-logo-icon" />
//             <h2 className="footer-title">Haryana Roadways</h2>
//           </div>
//         </div>

//         {/* 🟩 ADD HERE — Newsletter Subscription Section */}
//         <div className="footer-newsletter">
//           <div className="footer-newsletter-header">
//             <Mail className="footer-newsletter-icon" />
//             <h3>{t("footer.newsletterTitle") || "Subscribe to our Newsletter"}</h3>
//           </div>

//           {!subscribed ? (
//             <form onSubmit={handleSubscribe} className="footer-newsletter-form">
//               <input
//                 type="email"
//                 placeholder={t("footer.emailPlaceholder") || "Enter your email"}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="footer-newsletter-input"
//               />
//               <div className="footer-newsletter-buttons">
//                 <button type="submit" className="footer-newsletter-btn">
//                   {t("footer.subscribe") || "Subscribe"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEmail("")}
//                   className="footer-newsletter-cancel"
//                 >
//                   {t("footer.noThanks") || "No Thanks"}
//                 </button>
//               </div>
//               <p className="footer-newsletter-terms">
//                 By subscribing, you agree to our{" "}
//                 <Link to="/policy" className="footer-link">
//                   {t("footer.privacyPolicy") || "Privacy Policy"}
//                 </Link>{" "}
//                 and{" "}
//                 <Link to="/terms" className="footer-link">
//                   {t("footer.termsOfService") || "Terms of Service"}
//                 </Link>.
//               </p>
//             </form>
//           ) : (
//             <p className="footer-newsletter-success">
//               {t("footer.subscribedMessage") ||
//                 "Thank you for subscribing! You'll hear from us soon."}
//             </p>
//           )}
//         </div>
//         {/* 🟩 Newsletter section ends here */}

//         <div className="footer-sections">
//           {[
//             {
//               title: t("footer.company"),
//               icon: MapPin,
//               links: [
//                 { label: t("nav.about"), to: "/about" },
//                 { label: t("nav.services"), to: "/services" },
//                 { label: t("footer.privacy"), to: "/policy" },
//                 { label: t("affiliate.title"), to: "/affiliate" },
//               ],
//             },
//             {
//               title: t("footer.getHelp"),
//               icon: Bus,
//               links: [
//                 { label: t("reviews.title"), to: "/reviews" },
//                 { label: t("nav.contact"), to: "/contact" },
//                 { label: t("nav.track"), to: "/track" },
//                 { label: t("payment.title"), to: "/payment" },
//               ],
//             },
//             {
//               title: t("footer.rides"),
//               icon: Globe,
//               links: [
//                 { label: t("nav.trip"), to: "/trip" },
//                 { label: t("footer.luxury"), to: "/luxury" },
//                 { label: t("nav.travellocations"), to: "/travellocations" },
//                 { label: t("nav.bestrides"), to: "/bestrides" },
//               ],
//             },
//             // New Newsletter Section
//             {
//               title: t("newsletter.title"),
//               icon: Mail,
//               customContent: (
//                 <div className="footer-newsletter">
//                   <p className="footer-newsletter-description">
//                     {t("newsletter.description")}
//                   </p>
//                   <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
//                     <div className="footer-newsletter-input-group">
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder={t("newsletter.enterEmail")}
//                         className="footer-newsletter-input"
//                         disabled={isLoading}
//                       />
//                       <button
//                         type="submit"
//                         className="footer-newsletter-button"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? t("newsletter.subscribing") : t("newsletter.subscribe")}
//                       </button>
//                     </div>
//                     {subscriptionStatus && (
//                       <p className={`footer-newsletter-status ${subscriptionStatus === t("newsletter.success")
//                           ? "footer-newsletter-status-success"
//                           : "footer-newsletter-status-error"
//                         }`}>
//                         {subscriptionStatus}
//                       </p>
//                     )}
//                   </form>
//                 </div>
//               ),
//             },
//             {
//               title: t("footer.followUs"),
//               icon: Share,
//               links: [],
//             },
//           ].map((section, index) => (
//             <div key={index} className="footer-section">
//               <div className="footer-section-header">
//                 <section.icon className="footer-section-icon" />
//                 <h4 className="footer-section-title">{section.title}</h4>
//               </div>
//               {section.customContent ? (
//                 section.customContent
//               ) : section.links.length > 0 ? (
//                 <ul className="footer-links">
//                   {section.links.map((link, linkIndex) => (
//                     <li key={linkIndex}>
//                       <Link to={link.to} className="footer-link">
//                         {link.label}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="footer-social-links">
//                   {socialMediaLinks.map(
//                     ({ Icon, color, href, target, rel, label }, idx) => (
//                       <a
//                         key={idx}
//                         href={href}
//                         target={target}
//                         rel={rel}
//                         aria-label={label}
//                         className="footer-social-link"
//                       >
//                         <Icon className={`footer-social-icon ${color}`} />
//                       </a>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="footer-bottom">
//           <div className="footer-bottom-content">
//             <p className="footer-bottom-text">{t("footer.copyright")}</p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, MapPin, Clock, Globe, Share, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/footer.css";
import { socialMediaLinks } from "../utils/translationKeyMap";

function Footer() {
  const { t } = useTranslation();

  // 🕓 Current Time & Date
  const [currentTime, setCurrentTime] = useState(new Date());

  // 📧 Newsletter State
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // 📩 Newsletter Subscription Handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setSubscriptionStatus(t("newsletter.enterEmail"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setSubscriptionStatus(t("newsletter.invalidEmail"));
      return;
    }

    setIsLoading(true);
    setSubscriptionStatus("");

    try {
      const API_BASE_URL = "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus(t("newsletter.success"));
        setEmail("");
      } else {
        setSubscriptionStatus(data.message || t("newsletter.error"));
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscriptionStatus(t("newsletter.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="footer w-full">
      <div className="footer-bg-overlay" />

      {/* 🕓 Time & Date Display */}
      <div className="footer-time">
        <div className="footer-time-content">
          <Globe className="footer-time-icon" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
        <div className="footer-date-content">
          <Clock className="footer-date-icon" />
          <span>{currentTime.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="footer-container">
        {/* 🚍 Header */}
        <div className="footer-header">
          <div className="footer-logo">
            <Bus className="footer-logo-icon" />
            <h2 className="footer-title">Haryana Roadways</h2>
          </div>
        </div>

        {/* 🟩 ADD HERE — Newsletter Subscription Section */}
        <div className="footer-newsletter">
          <div className="footer-newsletter-header">
            <Mail className="footer-newsletter-icon" />
            <h3>{t("footer.newsletterTitle") || "Subscribe to our Newsletter"}</h3>
          </div>

          {!subscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder") || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="footer-newsletter-input"
              />
              <div className="footer-newsletter-buttons">
                <button type="submit" className="footer-newsletter-btn">
                  {t("footer.subscribe") || "Subscribe"}
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  className="footer-newsletter-cancel"
                >
                  {t("footer.noThanks") || "No Thanks"}
                </button>
              </div>
              <p className="footer-newsletter-terms">
                By subscribing, you agree to our{" "}
                <Link to="/policy" className="footer-link">
                  {t("footer.privacyPolicy") || "Privacy Policy"}
                </Link>{" "}
                and{" "}
                <Link to="/terms" className="footer-link">
                  {t("footer.termsOfService") || "Terms of Service"}
                </Link>.
              </p>
            </form>
          ) : (
            <p className="footer-newsletter-success">
              {t("footer.subscribedMessage") ||
                "Thank you for subscribing! You'll hear from us soon."}
            </p>
          )}
        </div>
        {/* 🟩 Newsletter section ends here */}

        {/* 📚 Footer Sections */}
        <div className="footer-sections">
          {[
            {
              title: t("footer.company"),
              icon: MapPin,
              links: [
                { label: t("nav.about"), to: "/about" },
                { label: t("nav.services"), to: "/services" },
                { label: t("footer.privacy"), to: "/policy" },
                { label: t("affiliate.title"), to: "/affiliate" },
              ],
            },
            {
              title: t("footer.getHelp"),
              icon: Bus,
              links: [
                { label: t("reviews.title"), to: "/reviews" },
                { label: t("nav.contact"), to: "/contact" },
                { label: t("nav.track"), to: "/track" },
                { label: t("payment.title"), to: "/payment" },
              ],
            },
            {
              title: t("footer.rides"),
              icon: Globe,
              links: [
                { label: t("nav.trip"), to: "/trip" },
                { label: t("footer.luxury"), to: "/luxury" },
                { label: t("nav.travellocations"), to: "/travellocations" },
                { label: t("nav.bestrides"), to: "/bestrides" },
              ],
            },
            {
              title: t("footer.followUs"),
              icon: Share,
              customContent: (
                <div className="footer-social-links">
                  {socialMediaLinks.map(
                    ({ Icon, color, href, target, rel, label }, idx) => (
                      <a
                        key={idx}
                        href={href}
                        target={target}
                        rel={rel}
                        aria-label={label}
                        className="footer-social-link"
                      >
                        <Icon className={`footer-social-icon ${color}`} />
                      </a>
                    )
                  )}
                </div>
              ),
            },
          ].map((section, index) => (
            <div key={index} className="footer-section">
              <div className="footer-section-header">
                <section.icon className="footer-section-icon" />
                <h4 className="footer-section-title">{section.title}</h4>
              </div>
              {section.customContent ? (
                section.customContent
              ) : (
                <ul className="footer-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.to} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* 🟫 Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-bottom-text">{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
