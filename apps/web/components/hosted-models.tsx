// Demos import the public components, which load models built in this
// repository from organui.com, as installed apps do. On this site the same
// files are served at /models, so requests for them stay on this origin: a
// local run or a preview then shows the models in its own commit, including a
// model that isn't deployed yet. On organui.com it is the same file.
const script = `(() => {
  const hosted = "https://organui.com/models/"
  const fetch = window.fetch
  window.fetch = (input, init) =>
    typeof input === "string" && input.startsWith(hosted)
      ? fetch("/models/" + input.slice(hosted.length), init)
      : fetch(input, init)
})()`

export function HostedModels() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
