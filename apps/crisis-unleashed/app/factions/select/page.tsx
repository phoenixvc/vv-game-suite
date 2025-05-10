import { ROUTES } from "@/constants/routes"
import { redirect } from "next/navigation"

/**
  * Redirects immediately to the immersive faction selection route when accessed.
  *
  * This component does not render any UI.
  */
 export default function Page() {
   redirect(ROUTES.IMMERSIVE_FACTION_SELECTION)
 }
