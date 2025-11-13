import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CastMember } from "@/types";

interface CrewDetailsProps {
  cast: CastMember[];
}

export default function CrewDetails({ cast }: CrewDetailsProps) {
  return (
    <section className="bg-background/95">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Cast</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {cast.map((member) => (
            <Card
              key={member.id}
              className="border-none shadow-none bg-transparent"
            >
              <CardContent className="p-0 flex flex-col items-center text-center group">
                <Avatar className="w-28 h-28 mb-3 relative">
                  <AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-foreground text-2xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-accent/50 transition-all duration-300" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
