// Konfigurasi Inspector untuk Next.js App Router
'use client';
import { Inspector, InspectParams } from 'react-dev-inspector';

export function InspectorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Inspector
      // Sesuaikan URL editor jika perlu, default: VSCode
      // url="vscode://file/{path}:{line}:{column}"
      disableLaunchEditor={false}
      onClickElement={(params: InspectParams) => {
        // Bisa custom handler jika ingin
      }}
    >
      {children}
    </Inspector>
  );
}
