export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 px-4">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to the Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Select an option from the sidebar to get started.
        </p>
      </div>
    </div>
  );
}
