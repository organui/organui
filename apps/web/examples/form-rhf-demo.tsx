"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { BodyMap } from "@workspace/registry/body-map"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

const formSchema = z.object({
  complaint: z
    .string()
    .min(3, "Describe the complaint in at least 3 characters.")
    .max(60, "Keep the complaint to 60 characters."),
  regions: z.array(z.string()).min(1, "Select at least one region."),
  notes: z.string().max(200, "Keep the notes to 200 characters."),
})

type FormValues = z.infer<typeof formSchema>

export function Example() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { complaint: "", regions: [], notes: "" },
  })

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Pain Assessment</CardTitle>
        <CardDescription>
          Record where it hurts before the consultation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-rhf-demo"
          noValidate
          onSubmit={form.handleSubmit(setSubmitted)}
        >
          <FieldGroup>
            <Controller
              name="complaint"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-complaint">
                    Main complaint
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-complaint"
                    aria-invalid={fieldState.invalid}
                    placeholder="Lower back pain"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-notes">Notes</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-notes"
                    aria-invalid={fieldState.invalid}
                    placeholder="Worse when sitting, started two weeks ago."
                    className="min-h-20 resize-none"
                  />
                  <FieldDescription className="tabular-nums">
                    {field.value.length}/200 characters
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              setSubmitted(null)
            }}
          >
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
        <output aria-label="Submitted values" className="empty:hidden">
          {submitted && (
            <pre className="bg-code text-code-foreground overflow-x-auto rounded-md p-4 text-xs">
              <code>{JSON.stringify(submitted, null, 2)}</code>
            </pre>
          )}
        </output>
      </CardFooter>
    </Card>
  )
}
