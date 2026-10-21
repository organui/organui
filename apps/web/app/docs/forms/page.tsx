import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, shadcn } from "@/lib/registry"

export const metadata = docsMetadata(
  "Forms",
  "Use OrganUI's clinical inputs in forms with React Hook Form, Zod and shadcn's Field.",
  "/docs/forms"
)

const schema = `import * as z from "zod"

const formSchema = z.object({
  complaint: z
    .string()
    .min(3, "Describe the complaint in at least 3 characters.")
    .max(60, "Keep the complaint to 60 characters."),
  regions: z.array(z.string()).min(1, "Select at least one region."),
  notes: z.string().max(200, "Keep the notes to 200 characters."),
})`

const setup = `import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { complaint: "", regions: [], notes: "" },
})`

const anatomy = `<Controller
  name="regions"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <BodyMap
        value={field.value}
        onValueChange={field.onChange}
        label="Where is the pain?"
      />
      <FieldDescription>
        Select every region that hurts, front and back.
      </FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>`

const dermatome = `<Controller
  name="level"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <DermatomeMap
        selectedId={field.value}
        onSelectionChange={field.onChange}
        label="Level of reduced sensation"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>`

const native = `<form action={saveAssessment}>
  <BodyMap
    value={regions}
    onValueChange={setRegions}
    name="regions"
    label="Where is the pain?"
  />
</form>

// In the server function:
const regions = formData.getAll("regions")`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/forms" title="Forms">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Use OrganUI&apos;s clinical inputs in forms with React Hook Form, Zod
          and shadcn&apos;s Field.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="demo">Demo</DocsHeading>
        <p>
          A pain assessment with a text input, the{" "}
          <Link href="/docs/components/body-map">body map</Link> and a textarea.
          Submit it empty to see the errors. Browser validation is off so the
          schema&apos;s messages show; keep it on in your own forms.
        </p>
        <ComponentPreview name="form-rhf-demo" />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="approach">Approach</DocsHeading>
        <p>
          OrganUI&apos;s inputs are controlled components: each takes its value
          and calls back with the next one. That is the shape React Hook
          Form&apos;s <code>Controller</code> expects, so they sit in a form
          like any shadcn input.
        </p>
        <ul className="ms-6 list-disc [&>li]:mt-2">
          <li>
            <code>useForm</code> holds the form&apos;s state.
          </li>
          <li>
            <code>Controller</code> connects each input to it.
          </li>
          <li>
            shadcn&apos;s <code>Field</code> lays out the label, description and
            error, and marks the field invalid.
          </li>
          <li>Zod validates on the client through zodResolver.</li>
        </ul>
        <p>Install the libraries, then the components the form uses:</p>
        <CodeBlockCommand
          label="Form dependencies"
          command="bun add react-hook-form @hookform/resolvers zod"
        />
        <CodeBlockCommand
          label="Components the form uses"
          command={`bunx ${shadcn} add field input textarea @organui/body-map`}
        />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="anatomy">Anatomy</DocsHeading>
        <p>
          The body map&apos;s <code>value</code> and <code>onValueChange</code>{" "}
          take the field&apos;s <code>value</code> and <code>onChange</code>.
          Its label names it, so it needs no <code>FieldLabel</code>.
        </p>
        <CodeSnippet label="Body map field" code={anatomy} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="schema">Schema</DocsHeading>
        <p>
          The body map&apos;s value is an array of region ids, so the schema
          checks its length.
        </p>
        <CodeSnippet label="Form schema" code={schema} />
        <p>Pass the schema to useForm through the resolver:</p>
        <CodeSnippet label="Form setup" code={setup} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="other-inputs">Other inputs</DocsHeading>
        <p>
          The <Link href="/docs/components/dermatome-map">dermatome map</Link>{" "}
          holds one level or <code>null</code>; its props are{" "}
          <code>selectedId</code> and <code>onSelectionChange</code>. Validate
          it with{" "}
          <code>
            z.string().nullable().refine((level) =&gt; level !== null)
          </code>
          .
        </p>
        <CodeSnippet label="Dermatome map field" code={dermatome} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="without-a-library">Without a library</DocsHeading>
        <p>
          Give the body map a <code>name</code> and it submits one hidden input
          per selected region, like checkboxes, so a plain form or a server
          function reads them with <code>getAll</code>.
        </p>
        <CodeSnippet label="Native form" code={native} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <ul className="ms-6 list-disc [&>li]:mt-2">
          <li>
            <code>aria-invalid</code> on inputs and <code>data-invalid</code> on
            fields style errors and announce the invalid state.
          </li>
          <li>
            <code>FieldError</code> is an alert, so screen readers read each new
            error.
          </li>
          <li>
            The maps are named groups with their own keyboard model: one tab
            stop per view, arrow keys between regions.
          </li>
        </ul>
      </section>
      <DocsPager href="/docs/forms" />
    </div>
  )
}
