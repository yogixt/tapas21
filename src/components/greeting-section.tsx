"use client";

export function GreetingSection({
  dayNumber,
  streak,
}: {
  dayNumber: number;
  streak: number;
}) {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-[#1F2937] lg:text-3xl">
        {greeting}, Bijoy
      </h1>
      <p className="mt-1 text-sm text-[#6B7280]">
        {streak > 0
          ? `${streak}-day streak. Keep the momentum going.`
          : "Start your transformation today."}
      </p>
    </div>
  );
}
