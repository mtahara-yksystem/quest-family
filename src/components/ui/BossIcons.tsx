// ============================================================
// src/components/ui/BossIcons.tsx
// ボスキャラ専用SVGアイコン
// ============================================================

import React from 'react'
import Image from "next/image";

type BossIconProps = {
  size?: number
  className?: string
}

// ============================================================
// 1. スライムキング（第1章）
// 王冠をかぶった巨大スライム
// ============================================================

export function SlimeKingIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="90" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />

      {/* スライム本体 */}
      <path
        d="M 20 70 Q 15 50 25 35 Q 30 25 40 22 Q 50 20 60 22 Q 70 25 75 35 Q 85 50 80 70 Q 75 85 50 85 Q 25 85 20 70 Z"
        fill="#4CAF7D"
        stroke="#3A8F63"
        strokeWidth="2"
      />

      {/* ハイライト */}
      <ellipse cx="35" cy="40" rx="12" ry="16" fill="rgba(255,255,255,0.4)" />

      {/* 目（左） */}
      <g>
        <ellipse cx="38" cy="55" rx="6" ry="8" fill="#2C2040" />
        <ellipse cx="39" cy="54" rx="3" ry="4" fill="white" />
      </g>

      {/* 目（右） */}
      <g>
        <ellipse cx="62" cy="55" rx="6" ry="8" fill="#2C2040" />
        <ellipse cx="63" cy="54" rx="3" ry="4" fill="white" />
      </g>

      {/* 口 */}
      <path
        d="M 40 68 Q 50 72 60 68"
        stroke="#2C2040"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 王冠 */}
      <g transform="translate(50, 20)">
        <path
          d="M -18 0 L -15 -12 L -8 -6 L 0 -15 L 8 -6 L 15 -12 L 18 0 Z"
          fill="#F5A623"
          stroke="#D4910D"
          strokeWidth="1.5"
        />
        {/* 宝石 */}
        <circle cx="-10" cy="-8" r="2.5" fill="#FF6B6B" />
        <circle cx="0" cy="-10" r="2.5" fill="#4A90D9" />
        <circle cx="10" cy="-8" r="2.5" fill="#9B59B6" />
      </g>
    </svg>
  )
}

// ============================================================
// 2. フォレストゴーレム（第2章）
// 木と岩でできた森の守護者
// ============================================================

export function ForestGolemIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="92" rx="32" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* 体（岩） */}
      <path
        d="M 35 85 L 30 60 L 32 45 L 40 35 L 60 35 L 68 45 L 70 60 L 65 85 Z"
        fill="#7A8B99"
        stroke="#5A6B79"
        strokeWidth="2"
      />

      {/* 岩の質感 */}
      <path d="M 38 50 L 42 48 L 40 55" fill="#6A7B89" />
      <path d="M 58 52 L 62 50 L 60 57" fill="#6A7B89" />
      <path d="M 45 70 L 50 68 L 48 75" fill="#6A7B89" />

      {/* 頭（岩） */}
      <path
        d="M 38 40 L 35 25 L 40 15 L 50 12 L 60 15 L 65 25 L 62 40 Z"
        fill="#8A9BAA"
        stroke="#6A7B89"
        strokeWidth="2"
      />

      {/* 苔・木の模様 */}
      <circle cx="42" cy="22" r="3" fill="#4CAF7D" opacity="0.7" />
      <circle cx="58" cy="25" r="2.5" fill="#4CAF7D" opacity="0.7" />
      <circle cx="50" cy="30" r="2" fill="#5FB88F" opacity="0.6" />

      {/* 目（光る石） */}
      <circle cx="42" cy="28" r="4" fill="#FFD700" opacity="0.9" />
      <circle cx="58" cy="28" r="4" fill="#FFD700" opacity="0.9" />
      <circle cx="42" cy="28" r="2" fill="white" />
      <circle cx="58" cy="28" r="2" fill="white" />

      {/* 腕（左） */}
      <rect x="20" y="48" width="12" height="25" rx="3" fill="#7A8B99" stroke="#5A6B79" strokeWidth="1.5" />
      <circle cx="26" cy="75" r="5" fill="#6A7B89" />

      {/* 腕（右） */}
      <rect x="68" y="48" width="12" height="25" rx="3" fill="#7A8B99" stroke="#5A6B79" strokeWidth="1.5" />
      <circle cx="74" cy="75" r="5" fill="#6A7B89" />

      {/* 木の枝（装飾） */}
      <path
        d="M 45 15 L 42 8 M 45 15 L 48 10"
        stroke="#5A4A3A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="42" cy="6" r="3" fill="#4CAF7D" />
      <circle cx="48" cy="8" r="2.5" fill="#5FB88F" />
    </svg>
  )
}

// ============================================================
// 3. ロックドラゴン（第3章）
// 岩でできたドラゴン
// ============================================================

export function RockDragonIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="52" cy="90" rx="38" ry="7" fill="rgba(0,0,0,0.2)" />

      {/* 尻尾 */}
      <path
        d="M 18 75 Q 12 70 10 62 Q 8 55 12 50 L 18 52"
        fill="#6B5A4A"
        stroke="#4A3A2A"
        strokeWidth="2"
      />
      <path d="M 10 50 L 5 45 L 8 52 Z" fill="#8B7A6A" />

      {/* 体 */}
      <ellipse cx="45" cy="65" rx="25" ry="20" fill="#8B7A6A" stroke="#6B5A4A" strokeWidth="2" />

      {/* 岩の質感（体） */}
      <path d="M 30 60 L 34 58 L 32 65" fill="#7B6A5A" />
      <path d="M 50 55 L 54 53 L 52 60" fill="#7B6A5A" />
      <path d="M 38 72 L 42 70 L 40 77" fill="#7B6A5A" />

      {/* 頭 */}
      <ellipse cx="65" cy="50" rx="18" ry="16" fill="#9B8A7A" stroke="#7B6A5A" strokeWidth="2" />

      {/* 岩の質感（頭） */}
      <path d="M 58 45 L 61 43 L 59 48" fill="#8B7A6A" />
      <path d="M 70 52 L 73 50 L 71 55" fill="#8B7A6A" />

      {/* 鼻 */}
      <ellipse cx="78" cy="52" rx="8" ry="7" fill="#7B6A5A" stroke="#5A4A3A" strokeWidth="1.5" />
      <ellipse cx="80" cy="51" r="2" fill="#4A3A2A" />
      <ellipse cx="80" cy="54" r="2" fill="#4A3A2A" />

      {/* 目（左） */}
      <g>
        <ellipse cx="60" cy="46" rx="5" ry="6" fill="#FF6B6B" opacity="0.9" />
        <ellipse cx="61" cy="45" rx="2.5" ry="3" fill="#FFD700" />
      </g>

      {/* 目（右） */}
      <g>
        <ellipse cx="72" cy="46" rx="5" ry="6" fill="#FF6B6B" opacity="0.9" />
        <ellipse cx="73" cy="45" rx="2.5" ry="3" fill="#FFD700" />
      </g>

      {/* 角（左） */}
      <path
        d="M 58 38 L 54 28 L 56 36 Z"
        fill="#5A4A3A"
        stroke="#4A3A2A"
        strokeWidth="1.5"
      />

      {/* 角（右） */}
      <path
        d="M 70 36 L 68 26 L 72 34 Z"
        fill="#5A4A3A"
        stroke="#4A3A2A"
        strokeWidth="1.5"
      />

      {/* 背中のトゲ（岩） */}
      <path d="M 35 58 L 32 50 L 38 56 Z" fill="#6B5A4A" />
      <path d="M 42 55 L 40 47 L 45 53 Z" fill="#6B5A4A" />
      <path d="M 50 54 L 48 46 L 53 52 Z" fill="#6B5A4A" />

      {/* 翼（左） */}
      <path
        d="M 38 60 Q 25 55 18 50 Q 15 48 20 52 Q 28 58 38 62 Z"
        fill="#7B6A5A"
        stroke="#5A4A3A"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* 翼（右） */}
      <path
        d="M 52 60 Q 65 55 72 50 Q 75 48 70 52 Q 62 58 52 62 Z"
        fill="#7B6A5A"
        stroke="#5A4A3A"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )
}

// ============================================================
// 4. アイスゴーレム（第4章）
// 氷でできた巨大な守護者
// ============================================================

export function IceGolemIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* 体（氷） */}
      <path
        d="M 38 85 L 33 62 L 35 48 L 42 38 L 58 38 L 65 48 L 67 62 L 62 85 Z"
        fill="#A8D8EA"
        stroke="#7AB8D4"
        strokeWidth="2"
      />

      {/* 氷の結晶模様 */}
      <path d="M 45 55 L 50 52 L 55 55 L 50 58 Z" fill="#E3F6FF" opacity="0.8" />
      <path d="M 40 68 L 45 65 L 50 68 L 45 71 Z" fill="#E3F6FF" opacity="0.7" />
      <path d="M 55 70 L 60 67 L 65 70 L 60 73 Z" fill="#E3F6FF" opacity="0.7" />

      {/* 頭 */}
      <path
        d="M 40 42 L 38 28 L 43 18 L 50 15 L 57 18 L 62 28 L 60 42 Z"
        fill="#B8E8F5"
        stroke="#8AC8E4"
        strokeWidth="2"
      />

      {/* 氷の角 */}
      <path d="M 45 18 L 42 8 L 46 15 Z" fill="#7AB8D4" opacity="0.9" />
      <path d="M 55 18 L 58 8 L 54 15 Z" fill="#7AB8D4" opacity="0.9" />

      {/* 目（氷の結晶） */}
      <g>
        <circle cx="42" cy="30" r="5" fill="#4A90D9" opacity="0.8" />
        <path d="M 42 27 L 42 33 M 39 30 L 45 30" stroke="white" strokeWidth="1.5" opacity="0.9" />
      </g>
      <g>
        <circle cx="58" cy="30" r="5" fill="#4A90D9" opacity="0.8" />
        <path d="M 58 27 L 58 33 M 55 30 L 61 30" stroke="white" strokeWidth="1.5" opacity="0.9" />
      </g>

      {/* 霜 */}
      <circle cx="48" cy="24" r="2" fill="white" opacity="0.6" />
      <circle cx="52" cy="22" r="1.5" fill="white" opacity="0.7" />
      <circle cx="44" cy="35" r="1.8" fill="white" opacity="0.5" />

      {/* 腕 */}
      <rect x="22" y="50" width="13" height="22" rx="3" fill="#A8D8EA" stroke="#7AB8D4" strokeWidth="1.5" />
      <rect x="65" y="50" width="13" height="22" rx="3" fill="#A8D8EA" stroke="#7AB8D4" strokeWidth="1.5" />
    </svg>
  )
}

// ============================================================
// 5. フレイムデーモン（第5章）
// 炎をまとった悪魔
// ============================================================

export function FlameDemonIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="90" rx="32" ry="7" fill="rgba(0,0,0,0.25)" />

      {/* 体 */}
      <path
        d="M 38 80 L 35 58 L 38 45 L 45 38 L 55 38 L 62 45 L 65 58 L 62 80 Z"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="2"
      />

      {/* 炎の模様 */}
      <path d="M 42 60 Q 45 55 48 60" fill="#F39C12" opacity="0.8" />
      <path d="M 52 62 Q 55 57 58 62" fill="#F39C12" opacity="0.8" />
      <path d="M 45 70 Q 50 65 55 70" fill="#F39C12" opacity="0.7" />

      {/* 頭 */}
      <ellipse cx="50" cy="28" rx="18" ry="20" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />

      {/* 角（炎） */}
      <path d="M 38 22 L 32 10 Q 35 15 38 18 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1.5" />
      <path d="M 62 22 L 68 10 Q 65 15 62 18 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1.5" />

      {/* 目（炎） */}
      <ellipse cx="42" cy="28" rx="5" ry="7" fill="#F39C12" />
      <ellipse cx="42" cy="27" rx="3" ry="4" fill="#FFD700" />
      <ellipse cx="58" cy="28" rx="5" ry="7" fill="#F39C12" />
      <ellipse cx="58" cy="27" rx="3" ry="4" fill="#FFD700" />

      {/* 口（牙） */}
      <path d="M 43 36 L 47 40 L 53 40 L 57 36" stroke="#2C2040" strokeWidth="2" fill="none" />
      <path d="M 45 36 L 45 42" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M 55 36 L 55 42" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* 炎のオーラ */}
      <path d="M 32 70 Q 28 65 30 60" stroke="#F39C12" strokeWidth="2" opacity="0.6" fill="none" />
      <path d="M 68 70 Q 72 65 70 60" stroke="#F39C12" strokeWidth="2" opacity="0.6" fill="none" />
    </svg>
  )
}

// ============================================================
// 6. サンダーバード（第6章）
// 雷をまとった巨鳥
// ============================================================

export function ThunderBirdIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* 翼（左） */}
      <path
        d="M 35 50 Q 15 45 8 40 Q 5 38 10 42 Q 20 48 35 52 Z"
        fill="#9B59B6"
        stroke="#7D3C98"
        strokeWidth="2"
      />
      <path d="M 25 45 L 18 42 L 20 48" fill="#FFD700" />

      {/* 翼（右） */}
      <path
        d="M 65 50 Q 85 45 92 40 Q 95 38 90 42 Q 80 48 65 52 Z"
        fill="#9B59B6"
        stroke="#7D3C98"
        strokeWidth="2"
      />
      <path d="M 75 45 L 82 42 L 80 48" fill="#FFD700" />

      {/* 体 */}
      <ellipse cx="50" cy="55" rx="20" ry="25" fill="#8E44AD" stroke="#6C3483" strokeWidth="2" />

      {/* 頭 */}
      <ellipse cx="50" cy="32" rx="14" ry="16" fill="#9B59B6" stroke="#7D3C98" strokeWidth="2" />

      {/* 羽根の模様 */}
      <path d="M 42 55 Q 45 50 48 55" fill="#FFD700" opacity="0.8" />
      <path d="M 52 55 Q 55 50 58 55" fill="#FFD700" opacity="0.8" />

      {/* くちばし */}
      <path
        d="M 50 35 L 45 42 L 50 40 L 55 42 Z"
        fill="#F39C12"
        stroke="#E67E22"
        strokeWidth="1.5"
      />

      {/* 目 */}
      <circle cx="44" cy="30" r="4" fill="white" />
      <circle cx="44" cy="30" r="2.5" fill="#2C2040" />
      <circle cx="56" cy="30" r="4" fill="white" />
      <circle cx="56" cy="30" r="2.5" fill="#2C2040" />

      {/* トサカ（雷） */}
      <path
        d="M 50 18 L 48 10 L 50 14 L 52 8 L 50 14"
        fill="#FFD700"
        stroke="#F39C12"
        strokeWidth="1.5"
      />

      {/* 雷のエフェクト */}
      <path d="M 38 48 L 35 45 L 37 47 L 34 44" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
      <path d="M 62 48 L 65 45 L 63 47 L 66 44" stroke="#FFD700" strokeWidth="2" opacity="0.7" />

      {/* 尾羽 */}
      <path
        d="M 44 75 L 40 85 L 45 78 Z"
        fill="#9B59B6"
        stroke="#7D3C98"
        strokeWidth="1.5"
      />
      <path
        d="M 50 78 L 48 88 L 52 80 Z"
        fill="#8E44AD"
        stroke="#6C3483"
        strokeWidth="1.5"
      />
      <path
        d="M 56 75 L 60 85 L 55 78 Z"
        fill="#9B59B6"
        stroke="#7D3C98"
        strokeWidth="1.5"
      />
    </svg>
  )
}

// ============================================================
// 7. シャドウウルフ（第7章）
// 影でできた狼
// ============================================================

export function ShadowWolfIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="52" cy="88" rx="35" ry="7" fill="rgba(0,0,0,0.3)" />

      {/* 尻尾 */}
      <path
        d="M 22 65 Q 15 58 12 48 Q 10 42 15 45 Q 20 50 25 60"
        fill="#34495E"
        stroke="#2C3E50"
        strokeWidth="2"
      />

      {/* 体 */}
      <ellipse cx="48" cy="60" rx="24" ry="18" fill="#2C3E50" stroke="#1A252F" strokeWidth="2" />

      {/* 影の模様 */}
      <path d="M 35 55 Q 40 52 45 55" fill="#1A252F" opacity="0.6" />
      <path d="M 48 62 Q 53 59 58 62" fill="#1A252F" opacity="0.6" />

      {/* 首 */}
      <path
        d="M 58 52 L 65 45 L 70 50 L 65 58"
        fill="#34495E"
        stroke="#2C3E50"
        strokeWidth="2"
      />

      {/* 頭 */}
      <ellipse cx="72" cy="42" rx="16" ry="14" fill="#2C3E50" stroke="#1A252F" strokeWidth="2" />

      {/* 耳 */}
      <path d="M 64 32 L 60 20 L 66 28 Z" fill="#34495E" stroke="#2C3E50" strokeWidth="1.5" />
      <path d="M 78 30 L 82 18 L 76 26 Z" fill="#34495E" stroke="#2C3E50" strokeWidth="1.5" />

      {/* 目（光る） */}
      <ellipse cx="68" cy="40" rx="4" ry="5" fill="#E74C3C" />
      <ellipse cx="68" cy="39" rx="2" ry="3" fill="#F39C12" />
      <ellipse cx="80" cy="40" rx="4" ry="5" fill="#E74C3C" />
      <ellipse cx="80" cy="39" rx="2" ry="3" fill="#F39C12" />

      {/* 鼻 */}
      <ellipse cx="85" cy="44" rx="4" ry="3" fill="#1A252F" />

      {/* 口・牙 */}
      <path d="M 82 48 Q 84 50 86 48" stroke="#1A252F" strokeWidth="1.5" fill="none" />
      <path d="M 80 48 L 79 52" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 84 48 L 85 52" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

      {/* 前足 */}
      <rect x="38" y="70" width="8" height="16" rx="2" fill="#34495E" stroke="#2C3E50" strokeWidth="1.5" />
      <rect x="52" y="70" width="8" height="16" rx="2" fill="#34495E" stroke="#2C3E50" strokeWidth="1.5" />

      {/* 影のオーラ */}
      <path
        d="M 30 68 Q 25 65 27 60"
        stroke="#5D6D7E"
        strokeWidth="2"
        opacity="0.5"
        fill="none"
        strokeDasharray="3,3"
      />
    </svg>
  )
}

// ============================================================
// 8. クリスタルスパイダー（第8章）
// 水晶でできた蜘蛛
// ============================================================

export function CrystalSpiderIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="90" rx="36" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* 脚（左側） */}
      <path d="M 30 55 L 15 45 L 18 48" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 32 60 L 18 58 L 21 60" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 34 65 L 20 70 L 23 70" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 36 70 L 25 78 L 28 77" stroke="#9B59B6" strokeWidth="3" fill="none" />

      {/* 脚（右側） */}
      <path d="M 70 55 L 85 45 L 82 48" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 68 60 L 82 58 L 79 60" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 66 65 L 80 70 L 77 70" stroke="#9B59B6" strokeWidth="3" fill="none" />
      <path d="M 64 70 L 75 78 L 72 77" stroke="#9B59B6" strokeWidth="3" fill="none" />

      {/* 体 */}
      <ellipse cx="50" cy="62" rx="18" ry="14" fill="#8E44AD" stroke="#6C3483" strokeWidth="2" />

      {/* 水晶の模様 */}
      <path d="M 44 58 L 50 55 L 56 58 L 50 61 Z" fill="#E8DAEF" opacity="0.9" />
      <path d="M 40 64 L 45 61 L 50 64 L 45 67 Z" fill="#D7BDE2" opacity="0.8" />
      <path d="M 50 64 L 55 61 L 60 64 L 55 67 Z" fill="#D7BDE2" opacity="0.8" />

      {/* 頭 */}
      <ellipse cx="50" cy="45" rx="14" ry="12" fill="#9B59B6" stroke="#7D3C98" strokeWidth="2" />

      {/* 複眼（8つ） */}
      <circle cx="42" cy="42" r="3.5" fill="#2C2040" />
      <circle cx="42" cy="42" r="1.5" fill="#E74C3C" />
      <circle cx="50" cy="40" r="4" fill="#2C2040" />
      <circle cx="50" cy="40" r="2" fill="#E74C3C" />
      <circle cx="58" cy="42" r="3.5" fill="#2C2040" />
      <circle cx="58" cy="42" r="1.5" fill="#E74C3C" />

      <circle cx="40" cy="48" r="2.5" fill="#2C2040" opacity="0.8" />
      <circle cx="46" cy="50" r="2.5" fill="#2C2040" opacity="0.8" />
      <circle cx="54" cy="50" r="2.5" fill="#2C2040" opacity="0.8" />
      <circle cx="60" cy="48" r="2.5" fill="#2C2040" opacity="0.8" />

      {/* 水晶のハイライト */}
      <circle cx="48" cy="48" r="3" fill="white" opacity="0.4" />
    </svg>
  )
}

// ============================================================
// 9. ダークナイト（第9章）
// 闇の騎士
// ============================================================

export function DarkKnightIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.3)" />

      {/* マント */}
      <path
        d="M 30 50 Q 25 65 28 80 L 35 88 L 40 85 L 38 55 Z"
        fill="#34495E"
        stroke="#2C3E50"
        strokeWidth="2"
      />
      <path
        d="M 70 50 Q 75 65 72 80 L 65 88 L 60 85 L 62 55 Z"
        fill="#34495E"
        stroke="#2C3E50"
        strokeWidth="2"
      />

      {/* 体（鎧） */}
      <path
        d="M 40 85 L 38 62 L 40 50 L 45 42 L 55 42 L 60 50 L 62 62 L 60 85 Z"
        fill="#5D6D7E"
        stroke="#34495E"
        strokeWidth="2"
      />

      {/* 鎧の装飾 */}
      <rect x="42" y="55" width="16" height="20" rx="2" fill="#34495E" opacity="0.6" />
      <path d="M 46 58 L 50 55 L 54 58" stroke="#7D3C98" strokeWidth="2" />

      {/* 肩当て */}
      <ellipse cx="38" cy="48" rx="7" ry="6" fill="#5D6D7E" stroke="#34495E" strokeWidth="1.5" />
      <ellipse cx="62" cy="48" rx="7" ry="6" fill="#5D6D7E" stroke="#34495E" strokeWidth="1.5" />

      {/* 頭（兜） */}
      <path
        d="M 38 42 L 36 30 L 40 22 L 50 18 L 60 22 L 64 30 L 62 42 Z"
        fill="#34495E"
        stroke="#2C3E50"
        strokeWidth="2"
      />

      {/* 兜の角 */}
      <path d="M 44 22 L 42 12 L 46 18 Z" fill="#7D3C98" stroke="#6C3483" strokeWidth="1.5" />
      <path d="M 56 22 L 58 12 L 54 18 Z" fill="#7D3C98" stroke="#6C3483" strokeWidth="1.5" />

      {/* バイザー（目の部分） */}
      <rect x="40" y="30" width="20" height="8" rx="2" fill="#2C3E50" />

      {/* 目（光る） */}
      <ellipse cx="45" cy="34" rx="3" ry="4" fill="#E74C3C" />
      <ellipse cx="45" cy="33" rx="1.5" ry="2" fill="#F39C12" />
      <ellipse cx="55" cy="34" rx="3" ry="4" fill="#E74C3C" />
      <ellipse cx="55" cy="33" rx="1.5" ry="2" fill="#F39C12" />

      {/* 剣 */}
      <g transform="translate(68, 55) rotate(25)">
        <rect x="0" y="0" width="6" height="35" rx="1" fill="#7D8B99" stroke="#5D6D7E" strokeWidth="1.5" />
        <path d="M -2 0 L 8 0 L 6 -8 L 2 -8 Z" fill="#5D6D7E" stroke="#34495E" strokeWidth="1.5" />
        <circle cx="3" cy="-4" r="2" fill="#9B59B6" />
      </g>
    </svg>
  )
}

// ============================================================
// 10. エンシェントドラゴン（第10章）
// 古代の伝説の龍
// ============================================================

export function AncientDragonIcon({ size = 80, className = '' }: BossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 影 */}
      <ellipse cx="52" cy="92" rx="40" ry="7" fill="rgba(0,0,0,0.25)" />

      {/* 尻尾 */}
      <path
        d="M 20 72 Q 12 68 8 60 Q 5 52 10 48 L 18 52 Q 16 58 20 64"
        fill="#C0392B"
        stroke="#A93226"
        strokeWidth="2"
      />
      <path d="M 8 48 L 3 42 L 7 48 L 5 52 Z" fill="#E74C3C" />

      {/* 体 */}
      <ellipse cx="45" cy="62" rx="26" ry="20" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />

      {/* ウロコの模様 */}
      <path d="M 32 58 Q 36 55 40 58" fill="#C0392B" opacity="0.7" />
      <path d="M 42 60 Q 46 57 50 60" fill="#C0392B" opacity="0.7" />
      <path d="M 52 60 Q 56 57 60 60" fill="#C0392B" opacity="0.7" />
      <path d="M 35 66 Q 40 63 45 66" fill="#C0392B" opacity="0.7" />
      <path d="M 48 68 Q 53 65 58 68" fill="#C0392B" opacity="0.7" />

      {/* 首 */}
      <path
        d="M 58 54 L 66 45 L 72 48 L 68 58"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="2"
      />

      {/* 頭 */}
      <ellipse cx="74" cy="40" rx="18" ry="16" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />

      {/* 鼻 */}
      <ellipse cx="87" cy="42" rx="9" ry="8" fill="#C0392B" stroke="#A93226" strokeWidth="1.5" />
      <circle cx="89" cy="40" r="2.5" fill="#2C2040" />
      <circle cx="89" cy="44" r="2.5" fill="#2C2040" />

      {/* 目 */}
      <g>
        <ellipse cx="68" cy="38" rx="5" ry="7" fill="#F39C12" />
        <ellipse cx="69" cy="37" rx="3" ry="4" fill="#FFD700" />
        <ellipse cx="69" cy="36" rx="1.5" ry="2" fill="white" />
      </g>
      <g>
        <ellipse cx="80" cy="38" rx="5" ry="7" fill="#F39C12" />
        <ellipse cx="81" cy="37" rx="3" ry="4" fill="#FFD700" />
        <ellipse cx="81" cy="36" rx="1.5" ry="2" fill="white" />
      </g>

      {/* 角（立派な） */}
      <path
        d="M 66 30 L 62 18 Q 64 22 66 26 L 68 28 Z"
        fill="#F39C12"
        stroke="#E67E22"
        strokeWidth="1.5"
      />
      <path
        d="M 74 28 L 72 16 Q 74 20 76 24 L 76 26 Z"
        fill="#F39C12"
        stroke="#E67E22"
        strokeWidth="1.5"
      />
      <path
        d="M 82 30 L 84 18 Q 82 22 80 26 L 80 28 Z"
        fill="#F39C12"
        stroke="#E67E22"
        strokeWidth="1.5"
      />

      {/* 背中のトゲ */}
      <path d="M 36 54 L 33 44 L 38 52 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1" />
      <path d="M 43 52 L 41 42 L 46 50 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1" />
      <path d="M 50 51 L 48 41 L 53 49 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1" />
      <path d="M 57 52 L 56 42 L 60 50 Z" fill="#F39C12" stroke="#E67E22" strokeWidth="1" />

      {/* 翼（左） */}
      <path
        d="M 38 58 Q 22 52 12 46 Q 8 44 14 48 Q 26 56 38 62 Z"
        fill="#C0392B"
        stroke="#A93226"
        strokeWidth="2"
        opacity="0.9"
      />
      <path d="M 28 52 L 20 48 L 25 55" fill="#F39C12" opacity="0.7" />

      {/* 翼（右） */}
      <path
        d="M 52 58 Q 68 52 78 46 Q 82 44 76 48 Q 64 56 52 62 Z"
        fill="#C0392B"
        stroke="#A93226"
        strokeWidth="2"
        opacity="0.9"
      />
      <path d="M 62 52 L 70 48 L 65 55" fill="#F39C12" opacity="0.7" />

      {/* 炎のオーラ */}
      <circle cx="92" cy="38" r="3" fill="#F39C12" opacity="0.6" />
      <circle cx="95" cy="42" r="2" fill="#FFD700" opacity="0.7" />
    </svg>
  )
}


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
  // switch (chapterNo) {
  //   case 1:
  //     return <SlimeKingIcon size={size} className={className} />
  //   case 2:
  //     return <ForestGolemIcon size={size} className={className} />
  //   case 3:
  //     return <RockDragonIcon size={size} className={className} />
  //   case 4:
  //     return <IceGolemIcon size={size} className={className} />
  //   case 5:
  //     return <FlameDemonIcon size={size} className={className} />
  //   case 6:
  //     return <ThunderBirdIcon size={size} className={className} />
  //   case 7:
  //     return <ShadowWolfIcon size={size} className={className} />
  //   case 8:
  //     return <CrystalSpiderIcon size={size} className={className} />
  //   case 9:
  //     return <DarkKnightIcon size={size} className={className} />
  //   case 10:
  //     return <AncientDragonIcon size={size} className={className} />
  //   default:
  //     return <SlimeKingIcon size={size} className={className} />
  // }
}
