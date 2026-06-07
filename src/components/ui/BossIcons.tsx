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
  bossImageUrl: string
}

export function BossIcon({ bossImageUrl="/images/bosses/slime_king.svg" }: BossIconSelectorProps) {
  return (
    <Image
      src={bossImageUrl}
      alt="edit"
      width={100}
      height={80}
    />
  );
}
