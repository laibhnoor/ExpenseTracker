import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-4 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

      <section className="relative z-10 grid w-full max-w-6xl gap-8 rounded-3xl border border-white/60 bg-white/60 p-6 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col justify-center">
          <span className="fade-up inline-flex w-fit rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Expense Tracker
          </span>

          <h1 className="fade-up fade-delay-1 mt-5 text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Budget better.
            <br />
            Spend with confidence.
          </h1>

          <p className="fade-up fade-delay-2 mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
            Monitor every category, compare months, and turn daily transactions
            into clear decisions with one simple dashboard.
          </p>

          <div className="fade-up fade-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="fade-up fade-delay-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-700/10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl text-slate-900">Monthly Snapshot</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              +11% savings
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-slate-100/80 p-4 transition duration-300 hover:bg-slate-100">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Needs</span>
                <span>$640 / $900</span>
              </div>
              <div className="h-2.5 rounded-full bg-white">
                <div className="h-2.5 w-[71%] rounded-full bg-sky-500 transition-all duration-700" />
              </div>
            </div>

            <div className="rounded-xl bg-slate-100/80 p-4 transition duration-300 hover:bg-slate-100">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Wants</span>
                <span>$290 / $450</span>
              </div>
              <div className="h-2.5 rounded-full bg-white">
                <div className="h-2.5 w-[64%] rounded-full bg-emerald-500 transition-all duration-700" />
              </div>
            </div>

            <div className="rounded-xl bg-slate-100/80 p-4 transition duration-300 hover:bg-slate-100">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Savings</span>
                <span>$510 / $600</span>
              </div>
              <div className="h-2.5 rounded-full bg-white">
                <div className="h-2.5 w-[85%] rounded-full bg-orange-400 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
