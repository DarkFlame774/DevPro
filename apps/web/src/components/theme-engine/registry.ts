import ProfessionalTemplate, { manifest as proManifest } from '../templates/ProfessionalTemplate';
import MinimalTemplate, { manifest as minimalManifest } from '../templates/MinimalTemplate';
import TerminalTemplate, { manifest as terminalManifest } from '../templates/TerminalTemplate';

export const ThemeRegistry = {
  [proManifest.id]: {
    manifest: proManifest,
    component: ProfessionalTemplate,
  },
  [minimalManifest.id]: {
    manifest: minimalManifest,
    component: MinimalTemplate,
  },
  [terminalManifest.id]: {
    manifest: terminalManifest,
    component: TerminalTemplate,
  },
};

export const getTheme = (id: string) => {
  return ThemeRegistry[id as keyof typeof ThemeRegistry] || ThemeRegistry['professional'];
};
