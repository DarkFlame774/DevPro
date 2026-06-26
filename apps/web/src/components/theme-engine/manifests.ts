/**
 * DevPro Theme Engine — Official Theme Manifests
 */

import { ThemeManifest } from './contracts';

export const ProfessionalManifest: ThemeManifest = {
  id: 'devpro-professional',
  name: 'Professional',
  version: '2.0.0',
  author: 'DevPro',
  engineVersion: '^1.0.0',
  minimumSchema: 1,
  maximumSchema: 1,
  capabilities: {
    darkMode: false,
    customAccents: true,
  },
  layout: {
    type: 'single-column',
    slots: ['header', 'primary', 'footer'],
  },
};

export const MinimalManifest: ThemeManifest = {
  id: 'devpro-minimal',
  name: 'Minimal',
  version: '2.0.0',
  author: 'DevPro',
  engineVersion: '^1.0.0',
  minimumSchema: 1,
  maximumSchema: 1,
  capabilities: {
    darkMode: false,
    customAccents: false,
  },
  layout: {
    type: 'single-column',
    slots: ['header', 'primary', 'footer'],
  },
};

export const TerminalManifest: ThemeManifest = {
  id: 'devpro-terminal',
  name: 'Terminal',
  version: '2.0.0',
  author: 'DevPro',
  engineVersion: '^1.0.0',
  minimumSchema: 1,
  maximumSchema: 1,
  capabilities: {
    darkMode: true,
    customAccents: false,
  },
  layout: {
    type: 'stream',
    slots: ['header', 'primary', 'footer'],
  },
};
