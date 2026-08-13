import IndexedSteps from "@/components/shared/IndexedSteps";

const steps = [
  {
    number: "01",
    title: "Pick one",
    description:
      "Start with the automation that fixes your loudest bottleneck, for most operators, that's Instagram DMs going unanswered.",
  },
  {
    number: "02",
    title: "Install",
    description: "Self-serve checkout, guided setup. No call, no proposal, running inside a day.",
  },
  {
    number: "03",
    title: "It runs",
    description: "It works while you don't. The numbers tell you plainly whether it paid for itself.",
  },
  {
    number: "04",
    title: "Stack",
    description: "Add the next automation from the catalog of five. Own the system. Own the profit.",
  },
];

export default function ProcessTimeline() {
  return (
    <IndexedSteps
      id="system"
      label="The ladder: 01–04"
      heading="One automation. Then the next."
      steps={steps}
    />
  );
}
