import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">STRAY PAWS</h3>
          <p className="text-sm">
            Helping animals in need through rescue, collaboration, and compassion.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#teams" className="hover:text-blue-500">Teams</a></li>
            <li><a href="#rescues" className="hover:text-blue-500">Rescues</a></li>
            <li><a href="#products" className="hover:text-blue-500">Products</a></li>
            <li><a href="#analytics" className="hover:text-blue-500">Analytics</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="mailto:contact@straypaws.org" className="hover:text-blue-500">contact@straypaws.org</a></li>
            <li><a href="#" className="hover:text-blue-500">Facebook</a></li>
            <li><a href="#" className="hover:text-blue-500">Twitter</a></li>
            <li><a href="#" className="hover:text-blue-500">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} STRAY PAWS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
