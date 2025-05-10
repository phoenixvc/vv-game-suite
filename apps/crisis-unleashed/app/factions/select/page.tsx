import { ROUTES } from "@/constants/routes"
import { redirect } from "next/navigation"

export default function ImmersiveFactionSelectionRedirect() {
  redirect(ROUTES.IMMERSIVE_FACTION_SELECTION)
}
