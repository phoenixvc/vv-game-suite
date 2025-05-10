import { ROUTES } from "@/constants/routes"
import { redirect } from "next/navigation"

export default function Page() {
   redirect(ROUTES.IMMERSIVE_FACTION_SELECTION)
 }
