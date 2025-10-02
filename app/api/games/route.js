import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/db.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ GET all games
export async function GET() {
  const jsonData = readData();
  return Response.json(jsonData.games);
}

// ✅ POST add new game
export async function POST(request) {
  const body = await request.json();
  const jsonData = readData();

  const newGame = { id: Date.now(), ...body };
  jsonData.games.push(newGame);

  writeData(jsonData);
  return Response.json(newGame, { status: 201 });
}

// ✅ PUT update game
export async function PUT(request) {
  const body = await request.json();
  const jsonData = readData();

  const game = jsonData.games.find((g) => g.id === body.id);
  if (!game) return Response.json({ error: "Game not found" }, { status: 404 });

  game.name = body.name;
  writeData(jsonData);

  return Response.json(game);
}

// ✅ DELETE remove game
export async function DELETE(request) {
  const body = await request.json();
  const jsonData = readData();

  jsonData.games = jsonData.games.filter((g) => g.id !== body.id);

  writeData(jsonData);
  return Response.json({ success: true });
}