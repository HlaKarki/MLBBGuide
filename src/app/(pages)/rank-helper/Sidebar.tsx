import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

export function RankedSidebar() {
  return (
    <div className={"w-full min-h-screen"}>
      <Card className={"h-full"}>
        <CardContent>
          <section>
            <h3 className={'text-neutral-400'}>Type</h3>
            <RankedButton label={'Solo'} />
            <RankedButton label={'Trio'} />
            <RankedButton label={'Full Squad'} />
          </section>
          <section>
            <h3 className={'text-neutral-400'}>Hero Type</h3>
            <RankedButton label={'Jungle'} />
            <RankedButton label={'Mid Lane'} />
            <RankedButton label={'Gold Lane'} />
            <RankedButton label={'Exp Lane'} />
            <RankedButton label={'Roam'} />
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

function RankedButton({ label }: { label: string }) {
  return (
    <Button className={'w-full'} variant={'ghost'}>{label}</Button>
  )
}