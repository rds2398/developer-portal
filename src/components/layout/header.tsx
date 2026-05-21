export function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        bg-white/80
        backdrop-blur-md
        dark:bg-black/80
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
          py-4
        "
      >
        {/* LEFT */}
        <div className="min-w-0">
          <h1
            className="
              text-lg
              sm:text-xl
              lg:text-2xl
              font-bold
              truncate
            "
          >
            Welcome to Developer Portal
          </h1>

          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
              truncate
            "
          >
            Manage APIs, sandbox requests, analytics and documentation
          </p>
        </div>

        {/* RIGHT */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="
              px-3
              py-1
              rounded-full
              bg-green-100
              text-green-700
              text-xs
              font-medium
            "
          >
            System Operational
          </div>
        </div>
      </div>
    </header>
  );
}
