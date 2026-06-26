/**
 * Language Taxonomy mapping
 * Strictly assigns unambiguous languages to broad technical domains.
 * Ambiguous languages (Python, JavaScript, etc.) are intentionally omitted 
 * from this map to prevent incorrect, low-confidence classifications.
 */

export const LanguageTaxonomy: Record<string, string> = {
  // Systems Programming
  'C': 'Systems Programming',
  'C++': 'Systems Programming',
  'Rust': 'Systems Programming',
  'Assembly': 'Systems Programming',
  'Zig': 'Systems Programming',

  // Backend & Enterprise
  'Go': 'Backend Development',
  'Elixir': 'Backend Development',
  'Erlang': 'Backend Development',
  
  // Mobile
  'Swift': 'Mobile Development',
  'Kotlin': 'Mobile Development',
  'Objective-C': 'Mobile Development',

  // Web3 / Smart Contracts
  'Solidity': 'Web3 Development',
  'Vyper': 'Web3 Development',
  
  // Data / Scientific (Unambiguous ones)
  'R': 'Data Science',
  'Julia': 'Scientific Computing',

  // Note: Python, JavaScript, TypeScript, Java, C# are intentionally omitted
  // because they are multi-domain and assigning them statically violates
  // the Conservative Classification Policy.
};
