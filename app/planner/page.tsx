"use client"

import { SpaceDesigner } from "@/components/space-designer"
import { useRouter } from "next/navigation"

export default function PlannerPage() {
  const router = useRouter()

  return (
    <div className="h-screen w-screen overflow-hidden bg-white" suppressHydrationWarning>
      <SpaceDesigner 
        onSave={(totalArea, rooms) => {
          // In a real app, we might persist this to a database or context
          console.log("Saved Rooms:", rooms)
          router.back()
        }}
      />
    </div>
  )
}
