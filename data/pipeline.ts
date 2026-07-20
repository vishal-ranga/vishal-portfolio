export interface PipelineStage {
  id: string;
  label: string;
  description: string;
}

export const pipelineStages: PipelineStage[] = [
  { id: "about", label: "source", description: "who I am" },
  { id: "philosophy", label: "principles", description: "how I work" },
  { id: "projects", label: "build", description: "shipped work" },
  { id: "stack", label: "stack", description: "tools & tech" },
  { id: "certifications", label: "verify", description: "certifications" },
  { id: "experience", label: "deploy", description: "experience & education" },
  { id: "contact", label: "monitor", description: "get in touch" },
];

export function stageLabel(id: string): string {
  return pipelineStages.find((s) => s.id === id)?.label ?? id;
}
