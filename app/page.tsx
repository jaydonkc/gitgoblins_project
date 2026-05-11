import { AppChrome } from "@/components/AppChrome";

export default function HomePage() {
  return (
    <AppChrome>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay">
          Shelter pet discovery MVP
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-normal text-ink sm:text-5xl">
          Find adoptable pets faster.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-ink/70">
          Browse shelter pets, open detailed profiles, save favorites, and submit
          structured adoption interest from one focused workflow.
        </p>
      </section>
    </AppChrome>
  );
}
