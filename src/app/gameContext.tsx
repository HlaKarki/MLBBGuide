// gameContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type GameType = 'solo' | 'trio' | 'full' | null;
type LaneType = 'jungle' | 'mid' | 'gold' | 'exp' | 'roam' | null;

interface GameState {
  gameType: GameType;
  laneType: LaneType;
}

type GameAction =
  | { type: 'SET_GAME_TYPE'; payload: GameType }
  | { type: 'SET_LANE_TYPE'; payload: LaneType }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  gameType: null,
  laneType: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_GAME_TYPE':
      return { ...state, gameType: action.payload };
    case 'SET_LANE_TYPE':
      return { ...state, laneType: action.payload };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
  {children}
  </GameContext.Provider>
);
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}