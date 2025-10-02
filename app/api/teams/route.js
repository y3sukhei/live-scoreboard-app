import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/db.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ GET all teams
export async function GET() {
  const jsonData = readData();
  return Response.json(jsonData.teams);
}

// ✅ POST add a new team
export async function POST(request) {
  const body = await request.json();
  const jsonData = readData();

  const newTeam = { id: Date.now(), ...body };
  jsonData.teams.push(newTeam);

  writeData(jsonData);
  return Response.json(newTeam, { status: 201 });
}

// ✅ PUT update a team
export async function PUT(request) {
  const body = await request.json();
  const jsonData = readData();

  const team = jsonData.teams.find((t) => t.id === body.id);
  if (!team) return Response.json({ error: "Team not found" }, { status: 404 });

  team.name = body.name;
  writeData(jsonData);

  return Response.json(team);
}

// ✅ DELETE remove a team
export async function DELETE(request) {
  const body = await request.json();
  const jsonData = readData();

  jsonData.teams = jsonData.teams.filter((t) => t.id !== body.id);

  writeData(jsonData);
  return Response.json({ success: true });
}