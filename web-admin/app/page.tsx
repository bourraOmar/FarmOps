import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          {/* You can replace this title with a logo later */}
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            FarmOps
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Admin Dashboard Login
          </p>
        </div>

        <form className="flex w-full flex-col gap-4">
          <input
            type="email"
            placeholder="admin@farmops.com"
            className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
          />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
          />
          <button
            type="button"
            className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign In
          </button>
        </form>
      </main>
    </div>
  );
}