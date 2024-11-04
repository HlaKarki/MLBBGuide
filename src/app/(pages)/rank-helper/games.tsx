import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { UserDataType } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function Games({userData} : {userData: UserDataType | undefined}) {
  return (
    <div>
      <Button>
        Create New Game
      </Button>
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