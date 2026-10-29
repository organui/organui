---
"@workspace/registry": minor
---

`dashboard-01` opens with the patient banner, as `dashboard-02` does: the patient's name, date of birth and age, NHS and hospital numbers, and allergies that read differently when not recorded, none known or recorded. The page heading is now "Patient dashboard", with the ward, bed and admission date under it. Its data type is now `PatientDashboardData`, which takes a structured `patient` as the banner does, plus `allergies`, `alerts` and `location`, in place of `name`, `details` and `alerts`.
