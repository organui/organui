# Changesets

Each pull request that changes what the registry installs adds a changeset:
a short note of what changed, for the release notes.

```bash
bunx changeset
```

Pick `@workspace/registry`, the bump (patch for fixes, minor for new items
or options, major for changes that need consumers to edit their code), and
write the note as a reader of the release would want it. Commit the file it
creates with your change.

On master, a pull request named "Release the next version" collects the
notes into `packages/registry/CHANGELOG.md` and bumps the version. Merging
it publishes the GitHub release, which the changelog page and RSS feed
read.
