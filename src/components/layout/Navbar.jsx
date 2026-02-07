export default function Navbar({ title }) {
    return (
      <div className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    );
  }

  