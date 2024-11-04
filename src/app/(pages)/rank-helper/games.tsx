import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { UserDataType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreateGameFlow } from '@/app/(pages)/rank-helper/CreateGameFlow';

export function Games({userData} : {userData: UserDataType | undefined}) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <div>
      <Button onClick={() => setDialogOpen(prev => !prev)}>
        Create New Game
      </Button>
      <CreateGameFlow dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />

      {userData && userData.games && userData.games.map((data: any, idx: number) => {
        return (
          <Card key={"idx"}>
            <CardTitle>{data.game.created_at}</CardTitle>
            <CardContent>
              {data.game.name}
            </CardContent>
            <CardFooter>
              Footer
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}