import React from "react";

const NewsletterSubscription = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-8 px-4 text-center">
      <h2 className="text-2xl font-semibold mb-3">
        Subscribe to our Newsletter
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Get the latest Haryana Roadways updates and travel offers!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thank you for subscribing!");
        }}
        className="flex justify-center flex-wrap gap-2"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSubscription;
