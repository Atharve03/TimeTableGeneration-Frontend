export default function Input({ label, ...props }) {
    return (
      <div className="mb-4">
        {label && <label className="block mb-1 text-gray-700 font-medium">{label}</label>}
        <input
          {...props}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    );
  }
  