import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-md">
      <div className="text-xl font-bold">STRAY PAWS</div>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Teams</a></li>
        <li><a href="#" className="hover:underline">Rescues</a></li>
        <li><Link to="/products" className="hover:underline">Products</Link></li>
        <li><a href="#" className="hover:underline">Analytics</a></li>
      </ul>
      <div>
        <a href="http://localhost:5173/login" className="text-sm font-semibold hover:underline">Register</a>
      </div>
    </nav>
  );
}
