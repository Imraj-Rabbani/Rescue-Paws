export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-md">
      <div className="text-xl font-bold">STRAY PAWS</div>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Teams</a></li>
        <li><a href="#" className="hover:underline">Rescues</a></li>
        <li><a href="#" className="hover:underline">Products</a></li>
        <li><a href="#" className="hover:underline">Analytics</a></li>
      </ul>
      <div>
        <a href="#" className="text-sm font-semibold hover:underline">Register</a>
      </div>
    </nav>
  );
}
