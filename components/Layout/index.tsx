import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {
        //**bg-hero-pattern bg-no-repeat bg-cover */
      }
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
