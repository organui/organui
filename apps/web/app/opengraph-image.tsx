import { socialImage, socialImageSize } from "@/lib/social-image"

export const alt = "OrganUI — The interfaces healthcare deserves."
export const size = socialImageSize
export const contentType = "image/png"

export default function Image() {
  return socialImage({
    title: "The interfaces healthcare deserves.",
    description: "Interfaces for healthcare and life sciences.",
  })
}
