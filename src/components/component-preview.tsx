import { ClinicalAlert } from "@/registry/default/clinical-alert/clinical-alert"
import { LabResultCard } from "@/registry/default/lab-result-card/lab-result-card"
import { MedicationStatus } from "@/registry/default/medication-status/medication-status"
import { PatientStatusBadge } from "@/registry/default/patient-status-badge/patient-status-badge"
import { PatientSummaryHeader } from "@/registry/default/patient-summary-header/patient-summary-header"
import { SpecimenStatus } from "@/registry/default/specimen-status/specimen-status"
import { StudyPhaseBadge } from "@/registry/default/study-phase-badge/study-phase-badge"
import { VitalSignCard } from "@/registry/default/vital-sign-card/vital-sign-card"

export function ComponentPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "patient-status-badge":
      return <div className="flex flex-wrap gap-2"><PatientStatusBadge status="active" /><PatientStatusBadge status="pending" /><PatientStatusBadge status="critical" /><PatientStatusBadge status="unknown" /></div>
    case "lab-result-card":
      return <LabResultCard className="w-full max-w-md" name="Hemoglobin" value="13.8" unit="g/dL" referenceRange="12.0–16.0 g/dL" collectedAt="24 Jul 2026, 09:30" status="normal" />
    case "vital-sign-card":
      return <VitalSignCard className="w-full max-w-sm" label="Heart rate" value={72} unit="bpm" measuredAt="Recorded 09:32" />
    case "medication-status":
      return <div className="flex flex-wrap gap-2"><MedicationStatus status="active" /><MedicationStatus status="held" /><MedicationStatus status="completed" /><MedicationStatus status="discontinued" /></div>
    case "specimen-status":
      return <div className="flex flex-wrap gap-2"><SpecimenStatus status="collected" /><SpecimenStatus status="in-transit" /><SpecimenStatus status="received" /><SpecimenStatus status="rejected" /></div>
    case "clinical-alert":
      return <ClinicalAlert className="w-full max-w-xl" severity="warning" title="Review required" description="Confirm this synthetic result using your validated local workflow." />
    case "study-phase-badge":
      return <div className="flex flex-wrap gap-2"><StudyPhaseBadge phase="phase-1" /><StudyPhaseBadge phase="phase-2" /><StudyPhaseBadge phase="phase-3" /><StudyPhaseBadge phase="phase-4" /></div>
    case "patient-summary-header":
      return <PatientSummaryHeader className="w-full max-w-xl" displayName="Sample Patient" identifier="SYN-2048" details={["Age 42", "Pronouns they/them", "Synthetic record"]} status="Active" />
    default:
      return null
  }
}
