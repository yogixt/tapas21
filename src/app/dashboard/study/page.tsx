import { requireAuth } from "@/lib/auth";
import { StudyTracker } from "./tracker";

export default async function StudyPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
          Study Tracker
        </h1>
        <p className="mt-1 text-[#6B7280]">
          DSA · ML · Deep Learning · LLMs · System Design · MLOps — 50 LPA target
        </p>
      </section>

      <StudyTracker />
    </div>
  );
}
