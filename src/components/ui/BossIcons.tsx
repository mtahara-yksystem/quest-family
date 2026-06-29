// ============================================================
// src/components/ui/BossIcons.tsx
// ボスキャラ専用SVGアイコン
// ============================================================

import Image from "next/image";

// ============================================================
// 汎用ボスアイコンコンポーネント
// 章番号に応じて自動選択
// ============================================================

type BossIconSelectorProps = {
  bossImageUrl?: string | null,
  width?: number,
  height?: number
}

export function BossIcon({ bossImageUrl, width=110, height = 85 }: BossIconSelectorProps) {
  if (!bossImageUrl) {
    return <div style={{ width, height }} />;
  }

  return (
    <Image
      src={bossImageUrl}
      alt="edit"
      width={width}
      height={height}
    />
  );
}
