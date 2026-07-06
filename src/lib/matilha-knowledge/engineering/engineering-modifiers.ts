/**
 * Modificadores globais de stack/tecnologia.
 *
 * São selecionáveis no nível da estimativa e aplicam-se a qualquer bloco cuja
 * `stackTags` contenha uma das tags em `appliesTo` (ou "*" para todos).
 *
 * O valor `factor` é uma fração: -0.1 = -10%, +0.4 = +40%.
 */

import type { AppliedModifier, EngineeringBlock } from "./engineering-types";

export interface StackModifier {
  id: string;
  label: string;
  /** Fração aplicada ao esforço (ex.: -0.2 para -20%). */
  factor: number;
  /** Tags de bloco às quais se aplica. "*" = todos os blocos. */
  appliesTo: string[];
  description?: string;
}

export const STACK_MODIFIERS: StackModifier[] = [
  {
    id: "nextjs",
    label: "Next.js",
    factor: -0.1,
    appliesTo: ["*"],
    description: "Stack padrão da casa reduz esforço de frontend/infra.",
  },
  {
    id: "authjs",
    label: "Auth.js",
    factor: -0.2,
    appliesTo: ["auth"],
    description: "Biblioteca de autenticação madura reduz esforço de auth.",
  },
  {
    id: "clerk",
    label: "Clerk",
    factor: -0.3,
    appliesTo: ["auth"],
    description: "Auth as a service reduz drasticamente o esforço de auth.",
  },
  {
    id: "firebase_auth",
    label: "Firebase Auth",
    factor: -0.15,
    appliesTo: ["auth"],
    description: "Auth gerenciada, com custo de integração.",
  },
  {
    id: "oauth",
    label: "OAuth",
    factor: 0.15,
    appliesTo: ["auth", "oauth"],
    description: "Fluxos OAuth adicionam configuração e tratamento de erros.",
  },
  {
    id: "mfa",
    label: "MFA / 2FA",
    factor: 0.4,
    appliesTo: ["auth"],
    description: "Segundo fator adiciona telas, provedores e QA.",
  },
  {
    id: "azure_ad",
    label: "Azure AD",
    factor: 0.35,
    appliesTo: ["auth", "oauth"],
    description: "SSO corporativo com provisionamento e regras.",
  },
  {
    id: "legacy",
    label: "Sistema legado",
    factor: 0.6,
    appliesTo: ["*"],
    description: "Integração/manutenção sobre legado eleva muito o esforço.",
  },
];

export const STACK_MODIFIER_MAP: Map<string, StackModifier> = new Map(
  STACK_MODIFIERS.map((modifier) => [modifier.id, modifier])
);

export function findStackModifier(id: string): StackModifier | undefined {
  return STACK_MODIFIER_MAP.get(id);
}

function stackModifierAppliesToBlock(
  modifier: StackModifier,
  block: EngineeringBlock
): boolean {
  if (modifier.appliesTo.includes("*")) return true;
  const tags = block.stackTags ?? [];
  return modifier.appliesTo.some((tag) => tags.includes(tag));
}

/**
 * Resolve todos os modificadores aplicáveis a um bloco (stack globais + do bloco).
 *
 * @param block Bloco de engenharia.
 * @param activeStackModifierIds IDs de stack modifiers ativos na estimativa.
 * @param activeComplexityModifierKeys Chaves de complexityModifiers ativas.
 */
export function resolveAppliedModifiers(
  block: EngineeringBlock,
  activeStackModifierIds: string[] = [],
  activeComplexityModifierKeys: string[] = []
): AppliedModifier[] {
  const applied: AppliedModifier[] = [];

  for (const id of activeStackModifierIds) {
    const modifier = STACK_MODIFIER_MAP.get(id);
    if (!modifier) continue;
    if (!stackModifierAppliesToBlock(modifier, block)) continue;
    applied.push({
      id: modifier.id,
      label: modifier.label,
      factor: modifier.factor,
      source: "stack",
    });
  }

  const blockModifiers = block.complexityModifiers ?? {};
  for (const key of activeComplexityModifierKeys) {
    if (!(key in blockModifiers)) continue;
    applied.push({
      id: key,
      label: key,
      factor: blockModifiers[key],
      source: "block",
    });
  }

  return applied;
}

/**
 * Fator multiplicador combinado dos modificadores.
 *
 * Somamos os deltas (aditivo) e garantimos piso de 0.1 para nunca zerar/negativar
 * o esforço, mesmo com muitos redutores empilhados.
 */
export function combineModifierFactor(applied: AppliedModifier[]): number {
  const totalDelta = applied.reduce((acc, modifier) => acc + modifier.factor, 0);
  return Math.max(0.1, 1 + totalDelta);
}
