import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useGame } from '@/app/gameContext';

export function CreateGameFlow({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const { state, dispatch } = useGame();

  const setGameType = (type: 'solo' | 'trio' | 'full') => {
    dispatch({ type: 'SET_GAME_TYPE', payload: type });
  };

  const setLaneType = (type: 'jungle' | 'mid' | 'gold' | 'exp' | 'roam') => {
    dispatch({ type: 'SET_LANE_TYPE', payload: type });
  };



  return (
    <div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {step === 1 ? (
              <>
                <AlertDialogTitle>Are you playing...</AlertDialogTitle>
                <Button
                  variant={state.gameType === 'solo' ? 'default' : 'outline'}
                  onClick={() => setGameType('solo')}
                >
                  Solo
                </Button>
                <Button
                  variant={state.gameType === 'trio' ? 'default' : 'outline'}
                  onClick={() => setGameType('trio')}
                >
                  Trio
                </Button>
                <Button
                  variant={state.gameType === 'full' ? 'default' : 'outline'}
                  onClick={() => setGameType('full')}
                >
                  Full Squad
                </Button>
              </>
            ) : (
              <>
                <AlertDialogTitle>
                  Choose the lane you are going...
                </AlertDialogTitle>
                <Button
                  variant={state.laneType === 'jungle' ? 'default' : 'outline'}
                  onClick={() => setLaneType('jungle')}
                >
                  Jungle
                </Button>
                <Button
                  variant={state.laneType === 'mid' ? 'default' : 'outline'}
                  onClick={() => setLaneType('mid')}
                >
                  Mid Lane
                </Button>
                <Button
                  variant={state.laneType === 'gold' ? 'default' : 'outline'}
                  onClick={() => setLaneType('gold')}
                >
                  Gold Lane
                </Button>
                <Button
                  variant={state.laneType === 'exp' ? 'default' : 'outline'}
                  onClick={() => setLaneType('exp')}
                >
                  Exp Lane
                </Button>
                <Button
                  variant={state.laneType === 'roam' ? 'default' : 'outline'}
                  onClick={() => setLaneType('roam')}
                >
                  Roaming
                </Button>
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className={'flex w-full items-center'}>
            <div className={"mr-auto"}>
              {step === 2 ? (
                <Button variant={"outline"} onClick={() => setStep(prev => prev - 1 > 0 ? prev - 1 : prev)}>Back</Button>
              ) : (
                <span className={'invisible'}>Invisible</span>
              )}
            </div>
            <div className={'flex space-x-2'}>
              <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={() =>
                  setStep(prev => {
                    if (prev + 1 < 3) return prev + 1
                    setDialogOpen(false)
                    router.push('/rank-helper/newgame')
                    return prev
                  })
                }
              >
                Continue
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
