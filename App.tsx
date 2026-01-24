/**
 * @app Control
 * @description Aplicativo React Native com Clean Architecture
 * @architecture
 *   - Presentation: UI e lógica de apresentação
 *   - Domain: Regras de negócio e entidades
 *   - Data: Acesso a dados e repositórios
 *   - Infrastructure: Detalhes técnicos (API, Storage)
 *   - Shared: Código compartilhado entre camadas
 *
 * @documentation
 *   - README: /README.md
 *   - Architecture: /docs/ARCHITECTURE.md
 *   - Quick Start: /docs/QUICK-START.md
 *   - Templates: /docs/TEMPLATES.md
 *   - Index: /docs/INDEX.md
 */

import "./global.css";

import ControlApp from "./src";

export default function App() {
  return <ControlApp />;
}
