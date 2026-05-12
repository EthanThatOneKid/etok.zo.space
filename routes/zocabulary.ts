import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Loader2, Send, Sparkles } from "lucide-react";

type Submission = {
  id: string;
  displayName: string;
  word: string;
  definition: string;
  example: string;
  createdAt: string;
};

const theme = {
  ink: "#111111",
  paper: "#f7f3ea",
  warm: "#e8ded0",
  gray: "#6f6b64",
  acid: "#c7ff4a",
  blue: "#214bff",
  red: "#ff4d2f",
};

const prompts = ["zocial", "zoracle", "zoetic", "zolo", "zoop loop", "zo-powered"];

const draftKey = "zocabulary:draft:v1";

type Draft = {
  displayName: string;
  word: string;
  definition: string;
  example: string;
};

const emptyDraft: Draft = {
  displayName: "",
  word: "",
  definition: "",
  example: "",
};

function readDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) return emptyDraft;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      displayName: typeof parsed.displayName === "string" ? parsed.displayName : "",
      word: typeof parsed.word === "string" ? parsed.word : "",
      definition: typeof parsed.definition === "string" ? parsed.definition : "",
      example: typeof parsed.example === "string" ? parsed.example : "",
    };
  } catch {
    return emptyDraft;
  }
}

function saveDraft(draft: Draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(draftKey, JSON.stringify(draft));
  } catch {
    // Local storage can be unavailable in private or restricted browsers.
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return "New";
  }
}

export default function Zocabulary() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [displayName, setDisplayName] = useState(() => readDraft().displayName);
  const [word, setWord] = useState(() => readDraft().word);
  const [definition, setDefinition] = useState(() => readDraft().definition);
  const [example, setExample] = useState(() => readDraft().example);
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasZo = useMemo(() => word.toLowerCase().includes("zo"), [word]);

  async function loadSubmissions() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/zocabulary", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load submissions.");
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    saveDraft({ displayName, word, definition, example });
  }, [displayName, word, definition, example]);

  async function submitEntry(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!hasZo) {
      setError("The word or phrase must include 'zo'.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/zocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ displayName, word, definition, example, website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit that entry.");
      setSubmissions((current) => [data.submission, ...current]);
      setWord("");
      setDefinition("");
      setExample("");
      setWebsite("");
      saveDraft({ displayName, word: "", definition: "", example: "" });
      setSuccess("Added to the Zocabulary.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit that entry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={
        {
          "--zo-ink": theme.ink,
          "--zo-paper": theme.paper,
          "--zo-warm": theme.warm,
          "--zo-gray": theme.gray,
          "--zo-acid": theme.acid,
          "--zo-blue": theme.blue,
          "--zo-red": theme.red,
        } as React.CSSProperties
      }
      className="min-h-screen overflow-hidden bg-[var(--zo-paper)] text-[var(--zo-ink)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,700;1,500&family=Hanken+Grotesk:wght@400;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .zo-sans { font-family: 'Hanken Grotesk', sans-serif; }
        .zo-serif { font-family: 'EB Garamond', serif; }
        .zo-mono { font-family: 'IBM Plex Mono', monospace; }
        @keyframes drift { from { transform: translateX(-12px); } to { transform: translateX(12px); } }
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .drift { animation: drift 6s ease-in-out infinite alternate; }
        .rise { animation: rise .7s ease-out both; }
      `}</style>

      <section className="relative border-b border-black/15">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--zo-ink)_1px,transparent_1px),linear-gradient(90deg,var(--zo-ink)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute -left-16 top-20 h-64 w-64 rotate-12 bg-[var(--zo-acid)] blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[var(--zo-blue)] opacity-95" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-12">
          <div className="rise flex min-h-[520px] flex-col justify-between gap-12">
            <header className="flex items-center justify-between gap-4">
              <a href="https://www.zo.computer/brand" className="flex items-center gap-3" target="_blank" rel="noreferrer">
                <span className="grid size-11 place-items-center rounded-full bg-black">
                  <img src="https://www.zo.computer/pegasus-white.svg" alt="Zo Pegasus" className="h-6 w-6" />
                </span>
                <span className="zo-mono text-xs font-semibold uppercase tracking-[0.2em]">Zo Computer</span>
              </a>
              <span className="zo-mono hidden rounded-full border border-black/20 bg-white/45 px-3 py-2 text-[11px] uppercase tracking-[0.18em] sm:inline-flex">
                open lexicon
              </span>
            </header>

            <div className="max-w-3xl">
              <div className="zo-mono mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                <Sparkles className="size-3.5 text-[var(--zo-acid)]" /> crowdsource the pun layer
              </div>
              <h1 className="zo-serif max-w-4xl text-6xl font-bold leading-[0.88] tracking-normal sm:text-7xl lg:text-8xl">
                Zocabulary
              </h1>
              <p className="zo-sans mt-7 max-w-2xl text-xl leading-8 text-black/72 sm:text-2xl">
                A public dictionary for Zo Computer wordplay. Submit a word, phrase, or pun that contains <span className="font-bold text-black">zo</span>, then define it like it already belongs here.
              </p>
            </div>

            <div className="drift grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setWord(prompt)}
                  className="zo-mono border border-black bg-white/60 px-3 py-3 text-left text-xs font-semibold uppercase transition hover:-translate-y-0.5 hover:bg-[var(--zo-acid)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submitEntry} className="rise relative z-10 border border-black bg-white p-4 shadow-[12px_12px_0_#111] sm:p-6 lg:mt-12">
            <div className="mb-6 flex items-center justify-between border-b border-black pb-4">
              <div>
                <p className="zo-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">new entry</p>
                <h2 className="zo-serif text-4xl font-bold">Coin a Zoism</h2>
              </div>
              <BookOpen className="size-8" />
            </div>

            <label className="zo-sans mb-4 block text-sm font-bold">
              Display name <span className="font-normal text-black/50">optional</span>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={48} placeholder="Anonymous" className="mt-2 w-full border border-black bg-[var(--zo-paper)] px-4 py-3 text-base outline-none focus:bg-white" />
            </label>

            <label className="zo-sans mb-4 block text-sm font-bold">
              Word or phrase
              <input value={word} onChange={(event) => setWord(event.target.value)} maxLength={80} placeholder="zoptimistic" required className="mt-2 w-full border border-black bg-[var(--zo-paper)] px-4 py-3 text-base outline-none focus:bg-white" />
              <span className={`zo-mono mt-2 block text-[11px] uppercase tracking-[0.16em] ${hasZo || !word ? "text-black/45" : "text-[var(--zo-red)]"}`}>must include zo</span>
            </label>

            <label className="zo-sans mb-4 block text-sm font-bold">
              Definition or context
              <textarea value={definition} onChange={(event) => setDefinition(event.target.value)} maxLength={520} rows={4} placeholder="A concise definition, origin story, or usage note." required className="mt-2 w-full resize-none border border-black bg-[var(--zo-paper)] px-4 py-3 text-base outline-none focus:bg-white" />
            </label>

            <label className="zo-sans block text-sm font-bold">
              Example sentence <span className="font-normal text-black/50">optional</span>
              <textarea value={example} onChange={(event) => setExample(event.target.value)} maxLength={320} rows={3} placeholder="I used Zo to zorganize the whole thing before lunch." className="mt-2 w-full resize-none border border-black bg-[var(--zo-paper)] px-4 py-3 text-base outline-none focus:bg-white" />
            </label>

            <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <p className="zo-mono mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">Draft saves on this device</p>

            {error && <p className="zo-sans mt-4 border border-[var(--zo-red)] bg-red-50 px-3 py-2 text-sm font-semibold text-[var(--zo-red)]">{error}</p>}
            {success && <p className="zo-sans mt-4 border border-black bg-[var(--zo-acid)] px-3 py-2 text-sm font-semibold">{success}</p>}

            <button type="submit" disabled={submitting} className="zo-mono mt-5 flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--zo-blue)] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              submit
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-black/20 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="zo-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">public entries</p>
            <h2 className="zo-serif text-5xl font-bold">The living list</h2>
          </div>
          <a href="https://www.zo.computer/brand" target="_blank" rel="noreferrer" className="zo-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] underline decoration-black/30 underline-offset-4 hover:decoration-black">
            brand source <ArrowUpRight className="size-4" />
          </a>
        </div>

        {loading ? (
          <div className="zo-mono flex items-center gap-3 border border-black bg-white px-4 py-6 text-sm uppercase tracking-[0.16em]"><Loader2 className="size-4 animate-spin" /> loading entries</div>
        ) : submissions.length === 0 ? (
          <div className="zo-sans border border-black bg-white px-5 py-8 text-lg">No entries yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {submissions.map((entry, index) => (
              <article key={entry.id} className="rise border border-black bg-white p-5 shadow-[6px_6px_0_rgba(17,17,17,.2)]" style={{ animationDelay: `${Math.min(index, 9) * 55}ms` }}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="zo-serif break-words text-4xl font-bold leading-none">{entry.word}</h3>
                  <span className="zo-mono shrink-0 bg-[var(--zo-acid)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="zo-sans text-base leading-7 text-black/75">{entry.definition}</p>
                {entry.example && <p className="zo-serif mt-5 border-l-4 border-black pl-4 text-xl italic leading-7 text-black/80">"{entry.example}"</p>}
                <p className="zo-mono mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">by {entry.displayName || "Anonymous"}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}