'use client'

import { useGame } from '@/app/gameContext';
import { useRouter } from 'next/navigation';

export default function GameId() {
  const { state } = useGame();
  const router = useRouter();

  if (!state.laneType || !state.gameType) {
    router.push('/rank-helper')
  }

  return (
    <div>
      <h3>Game Type: {state.gameType}</h3>
      <h3>Lane Type: {state.laneType}</h3>
    </div>
  )
}