import { ArrowDown, ArrowUpRight, Code2, GitBranch, Scan } from "lucide-react"
import { ExplorerPreview } from "@/components/explorer-preview"
import { explorers } from "@/lib/explorers"

function Wordmark() {
  return (
    <span className="wordmark">
      <svg
        width="29"
        height="29"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 17h7l4-11 6 21 4-10h7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Organ<span>UI</span>
    </span>
  )
}

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header shell">
        <a href="#" aria-label="OrganUI home">
          <Wordmark />
        </a>
        <nav aria-label="Main navigation">
          <a href="#explorers">Explorers</a>
          <a href="#about">About</a>
          <a className="nav-github" href="https://github.com/organui">
            GitHub <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero shell" aria-labelledby="hero-title">
          <p className="eyebrow">
            <span className="status-dot" /> An open invitation to explore
          </p>
          <h1 id="hero-title">
            Open-source interfaces
            <br className="desktop-break" /> for{" "}
            <span>health and life science.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              Starting with interactive 3D anatomy,
              <br className="desktop-break" /> built for the web.
            </p>
            <a className="primary-link" href="#explorers">
              Discover the explorers <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section
          id="explorers"
          className="collection shell"
          aria-labelledby="collection-title"
        >
          <div className="section-heading">
            <h2 id="collection-title">
              The anatomy collection <span>01—03</span>
            </h2>
            <p>Three perspectives. A closer look.</p>
          </div>
          <div className="explorer-grid">
            {explorers.map((explorer, index) => (
              <article
                className="explorer"
                key={explorer.id}
                aria-labelledby={`${explorer.id}-title`}
              >
                <ExplorerPreview explorer={explorer} index={index} />
                <div className="explorer-heading">
                  <h3 id={`${explorer.id}-title`}>{explorer.name}</h3>
                  <span>{explorer.category}</span>
                </div>
                <p className="explorer-description">{explorer.description}</p>
                <div className="explorer-links">
                  <a href={`https://github.com/organui/${explorer.id}-3d`}>
                    <Code2 size={16} aria-hidden="true" /> GitHub repository{" "}
                    <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only"> for {explorer.name}</span>
                  </a>
                  <a href="#credits" className="credit-link">
                    Image credits
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="collection-note">
            <span className="status-dot" /> A first look: screenshots from
            working local explorers. Public demos and full source releases are
            on the way.
          </p>
        </section>
        <section
          id="about"
          className="about shell"
          aria-labelledby="about-title"
        >
          <div className="about-intro">
            <p className="eyebrow">The idea behind OrganUI</p>
            <h2 id="about-title">
              Complex subjects.
              <br />
              <span>Clearer interfaces.</span>
            </h2>
            <p>
              Health and life science deserve thoughtful tools. OrganUI is an
              independent, open-source project exploring how we interact with
              them—starting with the human body.
            </p>
          </div>
          <div className="principles">
            <div>
              <Scan aria-hidden="true" size={22} />
              <div>
                <h3>Made for discovery</h3>
                <p>
                  Rotate a model, select a structure, and see how the pieces
                  relate. Small interactions that invite a closer look.
                </p>
              </div>
            </div>
            <div>
              <Code2 aria-hidden="true" size={22} />
              <div>
                <h3>Built for the web</h3>
                <p>
                  Standalone React and Three.js explorers. A starting point for
                  developers and educators to study and adapt.
                </p>
              </div>
            </div>
            <div>
              <GitBranch aria-hidden="true" size={22} />
              <div>
                <h3>Growing in the open</h3>
                <p>
                  Source-mapped anatomy, documented model origins, and room to
                  improve. Contributions help shape what comes next.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="contribute shell"
          aria-labelledby="contribute-title"
        >
          <div>
            <p className="eyebrow">Help shape the next iteration</p>
            <h2 id="contribute-title">A useful idea starts a conversation.</h2>
            <p>
              Found something to improve? Have a teaching use case or an
              interface in mind?
              <br className="desktop-break" /> Share it with us on GitHub.
            </p>
          </div>
          <a
            className="primary-link"
            href="https://github.com/organui/organui/issues"
          >
            Share an idea <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </section>
        <section
          id="credits"
          className="credits shell"
          aria-labelledby="credits-title"
        >
          <h2 id="credits-title">Built on open anatomy</h2>
          <div>
            <p>
              BodyParts3D / Anatomography, © The Database Center for Life
              Science (DBCLS). Adapted and rendered by OrganUI. Heart and Liver:{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/">
                CC BY 4.0
              </a>
              . Lungs:{" "}
              <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en">
                CC BY-SA 2.1 Japan
              </a>
              . Previews are cropped or compressed from the original explorers.{" "}
              <a href="/licenses/ATTRIBUTION.txt">
                Full attribution & sources{" "}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </p>
            <p>
              Educational demonstrations. Independent anatomical review is
              pending; not for clinical use.
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <a href="#" aria-label="OrganUI home">
          <Wordmark />
        </a>
        <p>Open by nature. Built for discovery.</p>
        <a href="https://github.com/organui/organui">
          Website source <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </>
  )
}
