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
  bossImageUrl: string,
  width?: number,
  height?: number
}

export function BossIcon({ bossImageUrl="/images/bosses/slime_king.svg", width=110, height = 85 }: BossIconSelectorProps) {
  return (
    <Image
      src={bossImageUrl}
      alt="edit"
      width={width}
      height={height}
    />
  );
}
