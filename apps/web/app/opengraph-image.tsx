import { socialImage, socialImageSize } from "@/lib/social-image"

export const alt =
  "OrganUI · Healthcare & life science UI for humans and agents"
export const size = socialImageSize
export const contentType = "image/png"

export default function Image() {
  return socialImage({
    title: "Healthcare & life science UI for humans and agents",
  })
}
