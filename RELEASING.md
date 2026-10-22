# Releasing

Releases are made from changesets, and published as GitHub releases. Nothing
goes to npm: the registry is served from organui.com, which deploys from
`master`.

The workflow opens its pull request with the repository's `GITHUB_TOKEN`, so
GitHub Actions must be allowed to create pull requests: tick **Allow GitHub
Actions to create and approve pull requests** under Settings → Actions →
General → Workflow permissions, in the organui organization first and then in
the repository. Without it the workflow fails with "GitHub Actions is not
permitted to create or approve pull requests".

## While you work

A pull request that changes what the registry installs adds a changeset:

```bash
bunx changeset
```

Pick `@workspace/registry`, the bump, and a line for the release notes:

- **patch**: fixes that change no props or files.
- **minor**: new items, props or options.
- **major**: changes that make consumers edit their code, such as a renamed
  prop or a moved file.

CI fails a pull request that changes registry files without one. See
[.changeset/README.md](.changeset/README.md).

## Making a release

1. Merge pull requests to `master`. The Changesets workflow keeps a pull
   request named **Release the next version** up to date: it bumps
   `packages/registry/package.json` and the root `package.json`, and writes
   `packages/registry/CHANGELOG.md` from the waiting changesets.
2. Review that pull request's changelog, edit it if a line reads badly, and
   merge it.
3. The workflow runs `bun run release`, which creates the `vX.Y.Z` tag and
   GitHub release with that version's notes. `/docs/changelog` and
   `/rss.xml` show it within a day.

## After a release

- Check [organui.com/docs/changelog](https://organui.com/docs/changelog).
- The hourly registry monitor checks the catalog, items and models on
  organui.com; a failure emails the maintainers.

## By hand

If the workflow can't run, the same steps work locally with a GitHub token
that can create releases:

```bash
bun run version-packages
git commit -am "Release the next version" && git push
bun run release
```
