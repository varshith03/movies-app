import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CrewMember {
  id: number;
  name: string;
  role: string;
  department: string;
  imageUrl?: string;
}

export default function CrewDetails() {
  // Hardcoded crew data matching the image
  const crew: CrewMember[] = [
    {
      id: 1,
      name: "Christopher Nolan",
      role: "Director",
      department: "Directing",
    },
    {
      id: 2,
      name: "Jonathan Nolan",
      role: "Screenplay",
      department: "Writing",
    },
    {
      id: 3,
      name: "Christopher Nolan",
      role: "Screenplay",
      department: "Writing",
    },
    { id: 4, name: "Emma Thomas", role: "Producer", department: "Production" },
    {
      id: 5,
      name: "Charles Roven",
      role: "Producer",
      department: "Production",
    },
    {
      id: 6,
      name: "Hoyte van Hoytema",
      role: "Director of Photography",
      department: "Camera",
    },
    { id: 7, name: "Jennifer Lame", role: "Editor", department: "Editing" },
    {
      id: 8,
      name: "Ludwig Göransson",
      role: "Original Music Composer",
      department: "Sound",
    },
  ];

  return (
    <div className="w-full py-6">
      <h2 className="text-2xl font-bold mb-6 px-4 md:px-6 text-white">
        Crew and Cast
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-6">
        {crew.map((member) => (
          <Card
            key={member.id}
            className="border-none shadow-none bg-transparent"
          >
            <CardContent className="p-0 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback className="bg-gray-700 text-white">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="text-xs text-muted-foreground">
                {member.department}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
