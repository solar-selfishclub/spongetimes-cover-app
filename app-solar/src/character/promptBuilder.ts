// Sheet-reference prompt: the user attaches their per-publisher character sheet
// (e.g. the blue/red/orange/purple Sponge Club Times mascot concept sheet) in the
// AI tool, and this prompt asks the model to generate a new pose while preserving
// the exact identity shown in that reference.
import {
  CTA_POSES,
  POSES_BY_CONTENT,
  POSES_FALLBACK,
  PUBLISHERS,
  ContentType,
  PublisherName
} from '../tokens';

export type PromptInputs = {
  publisher: PublisherName;
  contentType: ContentType;
  slideType: 'cover' | 'cta';
  customPose?: string;
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCharacterPrompt({
  publisher,
  contentType,
  slideType,
  customPose
}: PromptInputs): string {
  const { colorName } = PUBLISHERS[publisher];

  let pose: string;
  if (customPose && customPose.trim()) {
    pose = customPose.trim();
  } else if (slideType === 'cta') {
    pose = pickRandom(CTA_POSES);
  } else {
    const pool = POSES_BY_CONTENT[contentType] ?? POSES_FALLBACK;
    pose = pickRandom(pool);
  }

  return (
    `Use the attached 9-pose action sheet as the visual reference for the "${publisher}" ` +
    `(${colorName}) Sponge Club Times mascot. The sheet shows the SAME character in 9 ` +
    `different activities/poses.\n\n` +
    `Task — PICK and re-render ONE pose:\n` +
    `From the 9 poses in the sheet, choose the SINGLE one that best matches this context, ` +
    `then re-render it as a standalone illustration.\n\n` +
    `Context: ${pose}\n\n` +
    `Character identity — must match the reference sheet exactly:\n` +
    `- 3D rendered clay/Blender-style mascot (NOT pixel art, NOT 2D illustration).\n` +
    `- Yellow sponge-shaped block body with surface holes.\n` +
    `- ${colorName} baseball cap with the newspaper-and-sparkle logo.\n` +
    `- ${colorName} overalls with the same logo on the bib, white t-shirt underneath.\n` +
    `- Same simple face (two small dot eyes, tiny curve mouth) and same proportions.\n` +
    `- Same color palette, lighting, material/finish, and outline as the reference sheet.\n` +
    `- Single character only, full body visible.\n` +
    `- Props that the chosen pose implies (laptop, phone, tablet, trophy, speech bubble, ` +
    `question mark, etc.) may be included — but keep them small and supporting, never ` +
    `dominating the frame.\n\n` +
    `Background — VERY IMPORTANT:\n` +
    `- Use a completely flat solid pure magenta (#FF00FF) background.\n` +
    `- Reason: the character has white shirt parts and may hold light-colored props ` +
    `(laptop, paper, tablet). A magenta background gives maximum color contrast so ` +
    `automatic background-removal can cleanly separate every part of the character ` +
    `including white clothing and silver/gray devices.\n` +
    `- DO NOT use white, gray, black, yellow, or red for the background — those colors ` +
    `appear on the character or its props and will get cut out by mistake.\n` +
    `- DO NOT draw a transparency checkerboard pattern (no gray/white squares).\n` +
    `- DO NOT draw any grid, dots, gradient, vignette, or texture in the background.\n` +
    `- DO NOT add a drop shadow under the character (shadows blend with the magenta and ` +
    `confuse the cutout).\n` +
    `- The background must be one single uninterrupted #FF00FF color so the character ` +
    `can be cleanly cut out afterward.\n` +
    `- Centered composition, full body visible, comfortable padding around the character.`
  );
}
