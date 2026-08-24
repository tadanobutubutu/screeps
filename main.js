export function Main({ state }) {
  if (state.fetchingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (state.error) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-red-50">
        <p className="text-2xl text-red-600">
          {state.error.status || 'Error'} {state.error.message}
        </p>
        <button
          onClick={() => state.handleResponse(null)}
          className="rounded-lg bg-red-200 px-4 py-2 text-red-800 hover:bg-red-300"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-3">
        <img
          className="h-14 w-14 rounded-full border-2 border-gray-200"
          src={state.user?.image}
          alt={state.user?.name}
        />
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{state.user?.name}</span>
          <span className="text-lg text-gray-600">{state.user?.email}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3">
        <h2 className="text-4xl">Welcome back!</h2>
        <button
          onClick={() => state.handleResponse(null)}
          className="rounded-lg bg-blue-200 px-4 py-2 text-blue-800 hover:bg-blue-300"
        >
          Log out
        </button>
      </div>
    </main>
  );
}