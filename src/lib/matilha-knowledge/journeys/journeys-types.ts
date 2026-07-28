/**
 * Jornadas de Building Blocks — tipos.
 *
 * Cadeia ordenada (jornada do usuário) + flag de pacote comercial.
 */

export type BuildingBlockJourney = {
  id: string;
  name: string;
  description?: string;
  /** Ordem da jornada: ex. auth_basic_login → dashboard_charts → cms_simple */
  blockIds: string[];
  /** Costumam ser vendidos juntos (além da ordem de telas). */
  commercialBundle: boolean;
  notes?: string;
};

export type JourneysCatalog = {
  version: string;
  name: string;
  description: string;
  lastReviewed: string;
  journeys: BuildingBlockJourney[];
};
